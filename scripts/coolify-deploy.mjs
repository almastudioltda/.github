const {
  COOLIFY_URL,
  COOLIFY_DEPLOY_TOKEN,
  COOLIFY_RESOURCE_UUID,
  PRODUCTION_URL,
  EXPECTED_COMMIT,
  HEALTH_PATH = '/health/ready',
  META_PATH = '/api/v1/meta',
  COMMIT_FIELD = 'sourceCommit',
  DEPLOY_TIMEOUT_SECONDS = '600',
  FORCE_DEPLOY = 'false',
} = process.env;

for (const [name, value] of Object.entries({
  COOLIFY_URL,
  COOLIFY_DEPLOY_TOKEN,
  COOLIFY_RESOURCE_UUID,
  EXPECTED_COMMIT,
})) {
  if (!value) throw new Error(`${name} is required`);
}

if ((HEALTH_PATH || META_PATH) && !PRODUCTION_URL) {
  throw new Error('PRODUCTION_URL is required when health or metadata verification is enabled');
}

const coolifyBase = COOLIFY_URL.replace(/\/$/, '');
const productionBase = PRODUCTION_URL ? PRODUCTION_URL.replace(/\/$/, '') : '';
const timeoutMs = Number(DEPLOY_TIMEOUT_SECONDS) * 1000;
const pollMs = 10_000;
const startedAt = Date.now();

function valueAtPath(value, path) {
  if (!path) return undefined;
  return path.split('.').reduce(
    (current, segment) => current && typeof current === 'object'
      ? current[segment]
      : undefined,
    value,
  );
}

async function responseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); }
  catch { return text; }
}

async function readProductionState() {
  let commit = null;
  let healthOk = false;
  let metaReachable = false;
  let healthReachable = false;

  if (META_PATH) {
    try {
      const response = await fetch(productionBase + META_PATH, {
        headers: { 'user-agent': 'alma-delivery' },
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) {
        const body = await responseBody(response);
        metaReachable = true;
        const candidate = valueAtPath(body, COMMIT_FIELD);
        commit = typeof candidate === 'string' ? candidate : null;
      }
    } catch {
      // A deployment can transiently make production unavailable.
    }
  }

  if (HEALTH_PATH) {
    try {
      const response = await fetch(productionBase + HEALTH_PATH, {
        headers: { 'user-agent': 'alma-delivery' },
        signal: AbortSignal.timeout(15_000),
      });
      healthReachable = true;
      if (response.ok) {
        const body = await responseBody(response);
        if (body && typeof body === 'object' && 'status' in body) {
          healthOk = ['ready', 'ok', 'healthy', 'live'].includes(String(body.status).toLowerCase());
        } else {
          healthOk = true;
        }
      }
    } catch {
      // A deployment can transiently make production unavailable.
    }
  } else {
    healthOk = true;
  }

  return { commit, healthOk, metaReachable, healthReachable };
}

function stateIsCurrent(state) {
  const commitOk = META_PATH ? state.commit === EXPECTED_COMMIT : false;
  return commitOk && state.healthOk;
}

const before = await readProductionState();

if (stateIsCurrent(before)) {
  console.log(`Production already runs ${EXPECTED_COMMIT}; deploy skipped.`);
  process.exit(0);
}

console.log(
  `Deploy required. expected=${EXPECTED_COMMIT} current=${before.commit ?? 'unknown'} health=${before.healthOk ? 'ok' : 'not-ready'}`,
);

const deployResponse = await fetch(`${coolifyBase}/api/v1/deploy`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${COOLIFY_DEPLOY_TOKEN}`,
    accept: 'application/json',
    'content-type': 'application/json',
    'user-agent': 'alma-delivery',
  },
  body: JSON.stringify({
    uuid: COOLIFY_RESOURCE_UUID,
    force: FORCE_DEPLOY === 'true',
  }),
  signal: AbortSignal.timeout(30_000),
});

const deployBody = await responseBody(deployResponse);
if (!deployResponse.ok) {
  throw new Error(
    `Coolify rejected deployment (${deployResponse.status}): ${typeof deployBody === 'string' ? deployBody : JSON.stringify(deployBody)}`,
  );
}

const deploymentUuid =
  deployBody && typeof deployBody === 'object' && Array.isArray(deployBody.deployments)
    ? deployBody.deployments[0]?.deployment_uuid ?? null
    : null;

console.log(
  deploymentUuid
    ? `Coolify queued deployment ${deploymentUuid} for resource ${COOLIFY_RESOURCE_UUID}.`
    : `Coolify accepted deployment for resource ${COOLIFY_RESOURCE_UUID}.`,
);

if (!HEALTH_PATH && !META_PATH) {
  console.log('Deployment accepted. Runtime verification is disabled for this non-HTTP resource.');
  process.exit(0);
}

while (Date.now() - startedAt < timeoutMs) {
  await new Promise((resolve) => setTimeout(resolve, pollMs));
  const state = await readProductionState();

  console.log(
    `Waiting for production: expected=${EXPECTED_COMMIT} current=${state.commit ?? 'unknown'} health=${state.healthOk ? 'ok' : 'not-ready'}`,
  );

  if (META_PATH) {
    if (stateIsCurrent(state)) {
      console.log(`Production healthy on expected commit ${EXPECTED_COMMIT}.`);
      process.exit(0);
    }
  } else if (state.healthOk) {
    console.log('Production healthcheck passed. Commit verification is disabled for this resource.');
    process.exit(0);
  }
}

throw new Error(
  `Deployment verification timed out after ${DEPLOY_TIMEOUT_SECONDS}s. expected=${EXPECTED_COMMIT}`,
);

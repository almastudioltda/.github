# ALMA Studio · GitHub Organization Configuration

Este repositório mantém **configurações do GitHub, templates e workflows executáveis compartilhados** da organização `almastudioltda`. A autoridade documental de **padrões técnicos transversais aprovados** pertence ao [ALMA Standards](https://github.com/almastudioltda/alma-standards), conforme [ALMA-STD-001](https://github.com/almastudioltda/alma-standards/blob/main/architecture/ECOSYSTEM_SURFACES.md).

O `.github` implementa mecanismos; não substitui o registro de decisões nem os contratos de Core, Comercial, Payments ou dos produtos. Essa distinção é especialmente importante para o fluxo de manutenção dos READMEs.

## Conteúdo

- `profile/README.md` — apresentação do perfil da organização.
- `PULL_REQUEST_TEMPLATE.md` — checklist consultivo de impacto documental para PRs sem template próprio, alinhado às normas [ALMA-STD-003](https://github.com/almastudioltda/alma-standards/blob/main/engineering/README_STANDARD.md) e [ALMA-STD-004](https://github.com/almastudioltda/alma-standards/blob/main/engineering/DOCUMENTATION_CHANGE_CONTROL.md).
- `workflow-templates/alma-node-npm.yml` — CI padrão para projetos Node.js com npm.
- `workflow-templates/alma-node-pnpm.yml` — CI padrão para projetos Node.js com pnpm.
- `.github/workflows/deploy-coolify.yml` — entrega reutilizável e seletiva para recursos no Coolify.
- `scripts/coolify-deploy.mjs` — executor determinístico compartilhado da entrega.

## Atualização dos READMEs

Quando uma PR alterar arquitetura, fronteira de produto, autenticação, APIs, persistência, stack ou deploy, o autor deve **revisar o impacto no README e nos documentos técnicos** e registrar o motivo se nenhuma atualização for necessária. Um README descreve o produto real, não um modelo genérico nem uma implementação futura como concluída.

O template padrão de PR é **advisory** e não cria job bloqueante, regra de merge ou alteração automática. A análise semântica exige evidências e revisão humana. Ver [ALMA-STD-003](https://github.com/almastudioltda/alma-standards/blob/main/engineering/README_STANDARD.md) e [ALMA-STD-004](https://github.com/almastudioltda/alma-standards/blob/main/engineering/DOCUMENTATION_CHANGE_CONTROL.md).

## Padrão de CI

O runner padrão para cargas compatíveis é:

```yaml
runs-on: [self-hosted, Linux, X64, alma-ci]
```

O runner self-hosted da ALMA é usado para validações que não exigem acesso ao Docker de produção nem outras capacidades privilegiadas. Jobs com requisitos especiais permanecem em runners específicos até existir uma capacidade ALMA isolada para aquela classe de carga.

### Política operacional

1. Preferir capacidade ALMA quando ela for suficiente e segura.
2. Não conceder ao runner de CI acesso ao Docker/Coolify de produção.
3. Limitar CPU e memória do runner.
4. Limpar workspace, HOME e temporários ao término de cada job.
5. Evitar CI duplicado para o mesmo evento.
6. Registrar exceções por capacidade, segurança ou compatibilidade.
7. Evoluir o roteamento para gestão automática pelo ALMA Dev.

## Direção

O ALMA Dev deve assumir progressivamente a gestão de CI, runners, quotas, capacidade, filas, custos, saúde, limpeza, fallback e demais recursos do ciclo de desenvolvimento.


## Padrão de entrega

O deploy padrão da organização é **por demanda e por recurso**:

```text
merge em main
  -> CI do produto
  -> deploy reutilizável
  -> produção já está no SHA esperado?
       -> sim: skip
       -> não: deploy somente daquele recurso
  -> healthcheck
  -> confirmação do SHA implantado
```

Um merge em um produto não redeploya os demais. `force=false` é o padrão; rebuild forçado é exceção operacional.

Produtos chamam o workflow reutilizável depois do CI:

```yaml
jobs:
  deploy:
    needs: validate
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    uses: almastudioltda/.github/.github/workflows/deploy-coolify.yml@main
    with:
      resource_uuid: <uuid-do-recurso>
      production_url: https://produto.almastudio.ia.br
    secrets:
      COOLIFY_DEPLOY_TOKEN: ${{ secrets.COOLIFY_DEPLOY_TOKEN }}
```

O único segredo necessário para disparo é um token Coolify com permissão `deploy`, armazenado no secret manager do GitHub. UUID de recurso e URLs não são credenciais.

### Compatibilidade com ALMA Dev

Esse workflow é uma implementação transitória da capacidade de **delivery**, não o dono do domínio.

O contrato intencional é:

```text
request(project, revision, environment)
  -> decide skip/deploy
  -> trigger selected resource
  -> verify health
  -> verify deployed revision
  -> result/evidence
```

Enquanto o ALMA Dev ainda não executa produção, o GitHub Actions chama essa capacidade automaticamente após CI. Quando o ALMA Dev assumir deploy/rollback, ele deve consumir ou substituir o mesmo contrato sem exigir mudanças conceituais nos produtos.

# ALMA Studio · GitHub Organization Configuration

Este repositório concentra padrões compartilhados da organização `almastudioltda`.

## Conteúdo

- `profile/README.md` — apresentação do perfil da organização.
- `workflow-templates/alma-node-npm.yml` — CI padrão para projetos Node.js com npm.
- `workflow-templates/alma-node-pnpm.yml` — CI padrão para projetos Node.js com pnpm.
- `.github/workflows/deploy-coolify.yml` — entrega reutilizável e seletiva para recursos no Coolify.
- `scripts/coolify-deploy.mjs` — executor determinístico compartilhado da entrega.

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

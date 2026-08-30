# ALMA Studio · GitHub Organization Configuration

Este repositório concentra padrões compartilhados da organização `almastudioltda`.

## Conteúdo

- `profile/README.md` — apresentação do perfil da organização.
- `workflow-templates/alma-node-npm.yml` — CI padrão para projetos Node.js com npm.
- `workflow-templates/alma-node-pnpm.yml` — CI padrão para projetos Node.js com pnpm.

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

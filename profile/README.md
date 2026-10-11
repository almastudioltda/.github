# ALMA Studio

**Tecnologia para transformar operações em produtos simples, conectados e inteligentes.**

A ALMA Studio desenvolve produtos próprios e uma base tecnológica compartilhada para que diferentes soluções evoluam de forma integrada sem perder independência de domínio.

## Ecossistema ALMA

### Produtos

| Produto | Foco |
| --- | --- |
| **ALMA Monitor de Contas** | Organização, acompanhamento e inteligência financeira operacional |
| **ALMA Atendimento** | Atendimento omnichannel, CRM, automações e IA contextual |
| **ALMA Eventos** | Venda, gestão e credenciamento de eventos |
| **ALMA Varejo** | Operação de varejo, estoque e gestão comercial |
| **ALMA Finance** | Autoridade financeira pessoal e APIs de dados financeiros |
| **ALMA Compras** | Decisão de compra, ofertas, histórico de preços e confiança |
| **ALMA Assistant** | Chefe de gabinete digital pessoal e organizacional |

### Plataforma e infraestrutura

| Componente | Papel |
| --- | --- |
| **ALMA Hub** | **Portal do cliente** para conta, contextos e produtos contratados — direção aprovada, implementação em readequação |
| **ALMA Console** | **Backoffice interno**: suporte e administração da equipe ALMA, com permissões de staff |
| **ALMA Standards** | Repositório de **padrões técnicos transversais e decisões aprovadas**, não aplicação de negócio |
| **ALMA Core** | Identidade, organizações, memberships e autorização |
| **ALMA Comercial** | Catálogo, planos, contratos e direitos comerciais |
| **ALMA Payments** | Execução e registro de pagamentos, assinaturas e reembolsos |

### Inteligência e engenharia

| Componente | Papel |
| --- | --- |
| **ALMA Intelligence / ALMA IA** | Fronteira transversal de cognição, contexto, ferramentas, custos, auditoria e avaliação |
| **ALMA Dev** | Especialização de desenvolvimento autônomo, supervisão e operação de engenharia |

### Incubação

Ideias ainda não aceitas como arquitetura ou produto canônico ficam em **`alma-ideas`**. Experimentos executáveis e provas de conceito pertencem à família **`alma-lab-*`**. A existência de uma ideia não implica a criação de um repositório de produto.

## Convenção de repositórios

```text
alma-*         produto/aplicação
alma-ia-*      inteligência especializada ou fundação de IA
alma-infra-*   infraestrutura compartilhada
alma-lab-*     experimento, POC, fixture ou sandbox
alma-standards governança e padrões transversais aprovados
alma-hub       portal de autosserviço do cliente
alma-console   administração e suporte internos
alma-ideas     descoberta e incubação não normativa
```

**ALMA Platform** é um nome histórico da fase anterior à divisão Hub / Console / Standards. A nomenclatura antiga pode permanecer em código, contratos ou documentação histórica até a migração ser realizada com segurança. Os nomes das famílias `alma-ia-*` e `alma-infra-*` são direções de classificação, **não ordem automática para renomear repositórios operacionais**.

Decisões normativas versionadas: [Registro do ALMA Standards](https://github.com/almastudioltda/alma-standards/blob/main/governance/DECISION_REGISTRY.md).

## Como pensamos produto

Cada solução deve funcionar bem sozinha, mas aproveitar capacidades comuns quando isso reduz complexidade, custo e trabalho repetitivo. Cada domínio possui uma autoridade clara; produtos não compartilham banco como atalho e integrações acontecem por contratos explícitos.

A IA interpreta, recomenda e orquestra. Sistemas determinísticos continuam sendo a fonte de verdade dos fatos de negócio. A automação entra onde melhora a operação sem eliminar controle, auditoria e responsabilidade humana.

Na engenharia, buscamos sistemas observáveis, recuperáveis e cada vez mais autônomos. O objetivo é reduzir intervenção manual sem abrir mão de segurança, proveniência e capacidade de decisão humana quando ela realmente importa.

> **O humano dirige. Os sistemas executam, verificam e se autorregulam.**

---

**ALMA Studio** · Timbó, Santa Catarina · Brasil

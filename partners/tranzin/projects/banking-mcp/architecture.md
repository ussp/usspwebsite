# Reference Architecture · Agentic Enterprise Architecture for Banking

> Companion to `deck.md` Slide 8. This file drills into each layer with the specific technology choices and decision points. Use it as the back-pocket reference when an architect on the bank's side starts asking detailed questions.

---

## The five-layer model — at a glance

```
┌─────────────────────────────────────────────────────────────────────┐
│  5 · ACTION LAYER                                                    │
│  Workflows · Notifications · Decisioning APIs · Approval Gates       │
│  Immutable Audit Trail · Customer-facing Surfaces · Reporting        │
└────────────────────────────────▲────────────────────────────────────┘
                                 │  governed actions, with audit
┌────────────────────────────────┴────────────────────────────────────┐
│  4 · AGENTIC REASONING LAYER                                         │
│  AI Crews · Semantic Knowledge Graph · Tool Use · HITL · Guardrails  │
│  Framework-agnostic — Claude · GPT · CrewAI · LangGraph · custom     │
│  Observability (OTel + Langfuse) · Cost & Model-Version Tracking     │
└────────────────────────────────▲────────────────────────────────────┘
                                 │  TTL + trust-scored context
┌────────────────────────────────┴────────────────────────────────────┐
│  3 · GOVERNED DATA LAYER · Single Source of Truth                    │
│  Bronze → Silver → Gold ETL · Catalog · Lineage · RBAC · Audit Log   │
│  Postgres · Snowflake / Databricks · Vector Store · S3 Data Lake     │
└────────────────────────────────▲────────────────────────────────────┘
                                 │  normalized, versioned, fresh
┌────────────────────────────────┴────────────────────────────────────┐
│  2 · INTEROPERABILITY · MCP GATEWAY                                  │
│  MCP Server · 34+ Connectors · API Adapters · Event Bus              │
│  Rate-limit · Auth · Schema Registry · Replay                        │
└────────────────────────────────▲────────────────────────────────────┘
                                 │  uniform read/write contract
┌────────────────────────────────┴────────────────────────────────────┐
│  1 · SOURCE SYSTEMS · LEGACY (unchanged)                             │
│  Oracle DB · SQL Server · Salesforce · Reporting · Files · Streams   │
└─────────────────────────────────────────────────────────────────────┘
```

**Core property:** Layer 1 doesn't change. We wrap, govern, and reason above it. Replace components in Layer 1 when economically justified, not as a precondition.

---

## Layer 1 · Source Systems (Legacy — Unchanged)

| Component | Banking instance | LW analog |
|-----------|------------------|-----------|
| Core record-of-truth DB | Oracle (deposits, loans, ledger) | CenterEdge POS (Oracle-class) |
| Analytical DB | SQL Server data marts | Neon DW |
| CRM | Salesforce | Internal CRM, GroundTruth ads |
| Reporting | OBIEE / Cognos / custom | Static exports |
| Files / streams | SFTP feeds, batch CSVs | CSV exports, RTSP camera streams |

**Design rule:** read first, write later. Read access from Day 1; write actions land only after Layer 5 governance is in place.

---

## Layer 2 · Interoperability — MCP Gateway

> Where Tranzin's Context-First AI Platform plugs in.

**Components**
- **MCP Server** (Model Context Protocol — open standard)
- **34+ pre-built connectors** with source tagging
- Custom **API adapters** for any system without a stock connector
- **Event bus** for real-time streams (Kafka, AWS EventBridge, or Azure Service Bus)
- **Schema registry** — versioned contracts
- **Rate limiting · auth · replay**

**Design rules**
- Every read carries a source tag (provenance)
- Every write goes through an approval gate
- All access auth'd via SSO/OIDC and audited
- Connector outages don't propagate — circuit-breakers and graceful degradation (production-proven at LW)

**Why MCP** — open protocol, framework-agnostic. Any agent (Claude, GPT, CrewAI, LangGraph, custom) queries the same surface. No vendor lock-in.

---

## Layer 3 · Governed Data Layer (Single Source of Truth)

**Components**
- **Bronze → Silver → Gold ETL** pattern
  - Bronze: raw landed data, immutable
  - Silver: cleaned, normalized, joined
  - Gold: business-ready datasets, served to agents
- **Data catalog + lineage** (e.g., Atlan, Collibra, or open-source equivalent)
- **TTL + trust score + source tag on every data point**
- **RBAC** at the row/column level for regulated data
- **Immutable audit log** — every read and write captured

**Storage choices** (pick per cloud strategy)
- Warehouse: Snowflake, Databricks, or Postgres for smaller scopes
- Lake: S3 / ADLS / GCS with Iceberg or Delta
- Vector store: pgvector, Pinecone, or Weaviate for semantic search

**Trust scoring example**
- Source tag: `salesforce.account` (CRM, manually maintained) — trust score 0.7
- Source tag: `oracle.transactions` (system of record) — trust score 0.95
- Source tag: `third_party.bureau` — trust score 0.85, TTL 24h
Agents factor trust + freshness into every reasoning step. **They know what to trust.**

---

## Layer 4 · Agentic Reasoning Layer

**Components**
- **AI Crews** — multi-agent workflows (CrewAI, LangGraph, or Tranzin's workflow engine)
- **Semantic knowledge graph** — entities + relationships above the warehouse (Cognee at LW, or Neo4j / Memgraph at the bank)
- **Tool use** — agents call functions through the MCP gateway (read DB, send notification, trigger workflow)
- **HITL (human-in-the-loop)** — every action above a sensitivity threshold pauses for human sign-off
- **Guardrails** — per-agent policy: allowed tools, allowed data scopes, allowed action types
- **Observability** — OpenTelemetry traces + Langfuse for AI-specific tracing
- **Cost tracking** — per-agent, per-model, per-use-case cost ledger
- **Model versioning** — every decision captures the exact model version + prompt version + tool versions that produced it

**Why framework-agnostic matters at the bank**
- Today: Claude for reasoning, GPT for some classification
- Tomorrow: open-source model for sensitive data that can't leave the bank's network
- The platform doesn't change — only the model behind the agent does

---

## Layer 5 · Action Layer

**Components**
- **Workflow engine** — Temporal, Airflow, or Tranzin's workflow runtime
- **Notification fabric** — email, Slack, SMS, internal messaging, push to CRM
- **Decisioning APIs** — agent outputs delivered to systems that act on them (e.g., loan origination, fraud system, marketing automation)
- **Approval gates** — workflow pauses, routes to approver, captures sign-off
- **Immutable audit trail** — what the agent decided, the data it used, the model version, the approver, the timestamp
- **Customer-facing surfaces** (where appropriate) — co-pilot UI for officers, status notifications to customers

**Design rules**
- Action ≠ autonomy. The bank decides which actions an agent can take without approval, and which require sign-off.
- Every action is reversible or compensatable where the regulator expects it.
- The audit trail is the compliance product — usable directly for FFIEC / SOX / GLBA evidence.

---

## Cross-cutting concerns

| Concern | How it's handled |
|---------|------------------|
| **Security** | SSO/OIDC, RBAC, secrets vaulting (Vault / Secrets Manager), encryption at rest + in flight |
| **Compliance** | Immutable audit log, model-version capture, explainability surface, HITL where regulator expects it |
| **Cost control** | Per-agent + per-model cost ledger with threshold alerts (production-proven at LW) |
| **Observability** | OTel distributed traces, Langfuse for AI-specific traces, dashboards per crew + per use case |
| **DevOps** | IaC (Terraform), CI/CD with policy-as-code gates, blue/green deploys for agents |
| **Privacy** | Data residency respected; sensitive fields tokenized or held in restricted scopes; no PII leaves agreed boundaries |

---

## Migration optionality

The architecture preserves future moves you might want to make:

- **Replace Oracle?** When economic, swap Layer 1 — Layers 2–5 unchanged.
- **Move clouds?** Layer 3 storage choices are decoupled from Layers 2, 4, 5.
- **Swap model providers?** Layer 4 is framework-agnostic by design.
- **Tighten governance?** Add controls to Layer 5 without redesigning the platform.

The bank earns the right to make those moves on its own schedule — not on a vendor's.

---

## SVG / HTML build plan

When we convert to the HTML deck, the architecture diagram becomes an interactive SVG with:

- **Hover-to-highlight** per layer (dims others, shows layer description)
- **Click-through** on each layer to a drill-in panel (the layer detail from this file)
- **Toggle:** "LW (proof)" vs. "Banking (proposed)" view — same diagram, different labels on each box
- **Color coding:** Source / Interop / Data / Reasoning / Action — five distinct colors, consistent across the deck

Reference for HTML pattern: `frontend/launch_warwick/public/igmfund/launch/` (IG Fund interactive model) and `sales/web/index.html` (VionOS Story Deck).

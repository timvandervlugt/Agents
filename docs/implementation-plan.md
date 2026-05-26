# Quatta Implementation Plan

Use this plan to build from architecture to pilot. Each phase should end with a demo, audit evidence, and a clear go/no-go decision.

## Phase 0: Interactive Architecture Guide

Build the implementation guide before building the platform. It becomes the shared map for sales, CTO review, delivery, and engineering.

Setup tasks:
- Add stable step IDs to the flowchart nodes.
- Make the HTML flowcharts clickable.
- Connect each node to a side panel with purpose, services, inputs, outputs, security, monitoring, setup checklist, and done criteria.
- Maintain a node map in [Architecture Map](architecture-map.md).
- Use implementation statuses: `Planned`, `Designed`, `Build`, `Pilot`, `Production`.

Done criteria:
- A reviewer can click a flowchart node and understand what must be built.
- Every major box in the diagrams maps to a step ID and document section.

## Phase 1: Cloud Foundation

Services:
- Python + FastAPI
- Google Cloud Run
- Cloud SQL PostgreSQL
- pgvector
- Secret Manager
- OpenTelemetry

Setup tasks:
- Create `dev`, `staging`, and `prod` environments.
- Deploy a FastAPI skeleton to Cloud Run.
- Create PostgreSQL schemas for tenants, users, roles, audit logs, connector config, cache metadata, documents, embeddings, and workflow state.
- Enable pgvector in PostgreSQL.
- Store connector credentials in Secret Manager.
- Add OpenTelemetry request tracing from day one.

Done criteria:
- Health endpoint is live.
- Cloud Run can reach PostgreSQL.
- Every request has a trace ID in logs.
- Database migrations can be applied repeatably.

## Phase 2: Identity, Tenancy, And RBAC

Services:
- Microsoft Entra ID
- FastAPI auth middleware
- PostgreSQL row-level security

Setup tasks:
- Configure Entra OIDC/OAuth.
- Map Entra groups to Quatta roles.
- Add tenant ID to every request context.
- Add permission checks before connector, retrieval, or agent calls.
- Enforce tenant isolation in PostgreSQL and pgvector metadata filters.
- Audit failed permission checks.

Done criteria:
- Users only see allowed tenant, site, customer, article, and claim data.
- Unauthorized connector calls are blocked and logged.

## Phase 3: Connector Layer

Services:
- FastAPI connector services
- PostgreSQL metadata/cache
- Secret Manager
- OpenTelemetry
- Optional MCP wrappers for agent-facing tools

Setup tasks:
- Define a Python connector interface: `authenticate`, `fetch`, `normalize`, `health_check`, `emit_audit_event`.
- Build read-only connectors for ERP, WMS, SQL, Excel/CSV, SharePoint, APIs, and documents.
- Store source-specific credentials in Secret Manager.
- Normalize outputs into canonical objects such as `InventoryTransaction`, `WarehouseMovement`, `OrderDelivery`, `ClaimTicket`, `ContractRule`, and `DocumentEvidence`.
- Add TTL cache rules, freshness timestamps, retry/backoff, and partial-result behavior.

Done criteria:
- Every connector returns normalized data with source provenance.
- Connector failures create user-facing warnings and audit records.

## Phase 4: Retrieval + RAG

Services:
- PostgreSQL
- pgvector
- Vertex AI Document AI
- Vertex AI embeddings or approved embedding provider
- FastAPI retrieval service

Setup tasks:
- Structured path: query ERP/WMS/SQL/API connectors, map IDs/units/statuses/dates, and return structured facts.
- Document path: extract text with Document AI, chunk by document structure, generate embeddings, store in pgvector.
- Apply tenant, role, SharePoint ACL, metadata, document version, and retention filters before retrieval.
- Build a Context Builder that merges structured facts and document passages with citations.

Done criteria:
- Context Builder returns a grounded context package with record IDs, document IDs, chunk IDs, timestamps, and trace IDs.

## Phase 5: AI Gateway And MCP Tool Layer

Services:
- FastAPI AI Gateway
- Vertex AI Gemini
- Optional OpenAI/Azure OpenAI
- MCP for controlled agent tools
- OpenTelemetry

Setup tasks:
- Build a model router with Gemini via Vertex AI as default.
- Add prompt policy, data minimization, tool-call allowlists, prompt-injection checks, response validation, and confidence thresholds.
- Expose controlled tools through MCP when agents need standardized access, for example `search_inventory_transactions`, `retrieve_contract_rules`, or `calculate_claim_liability`.
- Log model provider, model name, token/cost estimates, safety results, and trace ID.

Done criteria:
- Agents cannot query arbitrary systems directly.
- Every model call and tool call is permissioned, traced, and audited.

## Phase 6: Inventory Agent

Services:
- LangGraph
- AI Gateway
- Connector layer
- Retrieval + RAG
- PostgreSQL audit/workflow state

Setup tasks:
- Build a LangGraph workflow for intent detection, permission check, ERP/WMS retrieval, tickets/claims retrieval, SOP/contract retrieval, reconciliation, pattern analysis, financial impact, root-cause summary, and recommended actions.
- Reconcile time zones, units of measure, locations, article IDs, status codes, and transaction direction.
- Return confidence, evidence, and escalation when evidence is missing or conflicting.

Done criteria:
- The user gets an operational explanation with cited evidence and recommended next actions.
- No ERP/WMS writeback occurs without explicit approval.

## Phase 7: Claims Agent

Services:
- LangGraph
- AI Gateway
- Connector layer
- Retrieval + RAG
- PostgreSQL audit/workflow state

Setup tasks:
- Build a LangGraph workflow for claim request, permission check, ticket retrieval, delivery/order retrieval, contract-rule retrieval, evidence collection, eligibility check, liability calculation, draft email, human review, approved send, and status tracking.
- Keep outbound action gated: AI drafts; human approves.
- Audit the final human-approved version.

Done criteria:
- Claim package is explainable, evidence-backed, and not sent automatically.

## Phase 8: Observability, Audit, And Governance

Services:
- OpenTelemetry
- PostgreSQL audit log
- Cloud Logging/Monitoring or equivalent

Setup tasks:
- Track request ID, tenant ID, user ID, role, permissions checked, connectors queried, records used, documents/chunks used, model/provider, cost metrics, generated answer, and human approval/rejection.
- Build dashboards for connector health, latency, error rate, model cost, retrieval quality, audit completeness, failed permissions, and SLO alerts.

Done criteria:
- Every AI answer can be reconstructed from logs, evidence, and model/tool-call records.

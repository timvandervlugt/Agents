# 01 - High-Level Quatta Architecture

## What This Flowchart Implements

The high-level architecture creates the secure path from user request to grounded AI response:

User -> Quatta App -> Auth/RBAC -> AI Gateway -> Connector Layer -> Retrieval Layer -> AI/Agent Layer -> Response -> Audit Log.

## Services To Set Up

| Flowchart step | Implementation choice | Why |
| --- | --- | --- |
| Quatta App | Python FastAPI on Cloud Run | Simple API surface, async support, container-native deployment |
| Auth/RBAC | Microsoft Entra ID OIDC + internal RBAC table | Enterprise identity plus Quatta-specific tenant/site/item permissions |
| AI Gateway | FastAPI service module | Central control point for model routing, prompt policy, guardrails, and tool permissions |
| Connector Layer | Python connector modules, optionally exposed as MCP tools | Keeps data access standardized and auditable |
| Retrieval Layer | PostgreSQL, SQLAlchemy, pgvector | One store for metadata, audit, cache, vector indexes |
| AI/Agent Layer | LangGraph | State, branching, retries, human checkpoints |
| Response | FastAPI response contract | Structured answer, citations, confidence, recommended actions |
| Audit Log | PostgreSQL append-only tables | Evidence-grade traceability |
| Monitoring | OpenTelemetry | Latency, errors, connector health, model calls, cost signals |

## Setup Steps

1. Create a GCP project for Quatta platform services.
2. Enable Cloud Run, Artifact Registry, Cloud Build, Vertex AI, Document AI, Secret Manager, Cloud SQL, and Cloud Logging.
3. Create a Python FastAPI application with these modules:
   - `app/api`: REST endpoints
   - `app/auth`: Entra token validation and RBAC
   - `app/gateway`: model routing, safety policy, data minimization
   - `app/connectors`: source-specific adapters
   - `app/retrieval`: structured and vector retrieval
   - `app/agents`: LangGraph workflows
   - `app/audit`: append-only audit events
   - `app/observability`: OpenTelemetry setup
4. Create PostgreSQL schemas:
   - `identity`: tenants, users, roles, permissions
   - `connectors`: connector config, health, credentials references
   - `retrieval`: normalized metadata, vector documents, source provenance
   - `audit`: requests, tool calls, model calls, responses, reviewer actions
5. Configure Entra ID app registration:
   - OIDC sign-in for the UI/API
   - API scopes for Quatta backend
   - group claims or app roles mapped to Quatta RBAC
6. Deploy to Cloud Run with service account permissions limited by least privilege.
7. Add OpenTelemetry instrumentation to FastAPI, HTTP clients, database calls, and model calls.

## AI Gateway Responsibilities

- Select model provider: Vertex AI Gemini by default, OpenAI/Azure OpenAI when configured.
- Enforce tenant, role, connector, and tool-call policy.
- Strip or mask unnecessary PII before model calls.
- Apply prompt-injection checks to user input and retrieved documents.
- Require structured JSON output for agent decisions.
- Attach provenance and audit correlation IDs to every response.
- Escalate low-confidence or high-risk outputs to human review.

## Security Controls

- Tenant isolation in every table, vector index query, cache key, and audit record.
- Row-level security or equivalent application-enforced tenant filters.
- Secrets stored in Secret Manager, never in connector config rows.
- No source writeback credentials in the default connector set.
- Separate service accounts for app runtime, ingestion jobs, and export jobs.

## Acceptance Criteria

- A request without a valid Entra token is rejected.
- A valid user cannot query another tenant, site, customer, SKU, or claim outside scope.
- Every request creates an audit trace from request to response.
- The response includes model name, evidence references, and confidence.
- The default deployment has no writeback capability.

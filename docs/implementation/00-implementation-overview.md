# Quatta AI Architecture Implementation Guide

This guide turns the Quatta architecture flowcharts into an executable implementation plan for Quatta: an AI layer above customer ERP, WMS, SQL, Excel, SharePoint, documents, local/SFTP drops, and APIs. Customer data remains in customer systems unless an explicit, tenant-scoped cache, storage bucket, or index is configured.

## Audience

- CTO/CIO: understands the platform controls, data-residency posture, rollout phases, and risk ownership.
- Engineering: understands exactly which services to build, which language to use, and how each architecture node maps to setup work.
- Customer IT: understands what must be connected, which permissions are required, and what Quatta will and will not write back.

## Recommended Delivery Shape

Build the platform as a Python-first backend with a small web UI:

- Backend language: Python 3.12+
- API framework: FastAPI
- Agent orchestration: LangGraph
- Primary model provider: Gemini on Vertex AI
- Optional provider fallback: OpenAI or Azure OpenAI through a provider abstraction
- Database: PostgreSQL
- Vector search: pgvector extension inside PostgreSQL
- Hosting: Google Cloud Run
- Identity: Microsoft Entra ID using OIDC / OAuth2
- Document OCR: Vertex AI Document AI
- Document staging: tenant-scoped Google Cloud Storage for uploads, local/SFTP drops, extracted artifacts, and governed exports
- Observability: OpenTelemetry traces, metrics, and logs

## When To Use Which Capability

| Capability | Use it when | Do not use it when |
| --- | --- | --- |
| MCP | You need standardized agent tools with schemas, permissions, and inspectable tool calls across connectors. | A simple internal function call is enough and the tool will not be reused by agents or external clients. |
| RAG | The answer depends on SOPs, contracts, claims evidence, emails, PDFs, scans, or policy text. | The answer can be produced from structured ERP/WMS/SQL/API data alone. |
| Vertex AI Gemini | You need enterprise GCP deployment, Gemini models, IAM integration, region control, and model monitoring. | The customer mandates Azure/OpenAI-only deployment. |
| Document AI | You need OCR or document structure extraction from PDFs, scans, contracts, PODs, claims attachments, or SOPs. | Documents are already clean text with stable metadata and no OCR need. |
| LangGraph | The workflow has multiple steps, branching, approvals, retries, tool calls, or state. | A single deterministic API call or SQL query is enough. |
| pgvector | You need vector retrieval close to PostgreSQL audit, tenancy, and metadata filters. | The customer needs a dedicated managed vector DB for very high-scale semantic search. |

## Architecture Principles

1. Source systems remain authoritative.
2. Quatta uses read-only connectors by default.
3. No operational writeback unless explicitly enabled and approved.
4. Every answer must include evidence, provenance, confidence, and known gaps.
5. Every tool call must be tenant-scoped, role-scoped, logged, and traceable.
6. Agents recommend actions; humans approve business-impacting outbound actions.
7. Cache and vector indexes must preserve source permissions and freshness metadata.

## Implementation Phases

| Phase | Outcome | Main Deliverables |
| --- | --- | --- |
| 0. Foundation | Secure running platform shell | FastAPI app, Entra auth, PostgreSQL, Cloud Run, OpenTelemetry |
| 1. Read-only connectors | Data can be retrieved safely | ERP/WMS/API/SQL/file connectors, secrets, logging, cache policy |
| 2. Retrieval and RAG | Structured and document context can be assembled | semantic mapping, Document AI ingestion, chunking, embeddings, pgvector |
| 3. AI gateway and agents | Controlled model use and repeatable workflows | model router, guardrails, LangGraph workflows, tool registry |
| 4. Inventory agent | Stock variance root-cause assistant | reconciliation logic, evidence citations, confidence, recommendations |
| 5. Claims agent | Draft claim assistant with approval gate | contract rule retrieval, eligibility, liability calculation, claim draft |
| 6. Production hardening | Enterprise operating model | SLOs, alerts, evals, red-team tests, backup, retention, runbooks |

## Acceptance Criteria For The Whole Platform

- A user can sign in with Microsoft Entra ID and only see permitted tenants/sites/items.
- A request produces an audit record with user, tenant, permissions, tool calls, sources, model, latency, cost estimate, answer, and reviewer actions.
- A connector outage produces partial-result behavior and a visible freshness warning.
- RAG answers cite document IDs, chunk IDs, source timestamps, and retrieval timestamps.
- Agents refuse or escalate when confidence is low, evidence conflicts, or permissions are insufficient.
- No connector performs writes unless a separately approved writeback workflow exists.

## Official References

- FastAPI on Cloud Run: https://docs.cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-fastapi-service
- Vertex AI Gemini models: https://cloud.google.com/vertex-ai/generative-ai/docs/models
- Document AI OCR processors: https://docs.cloud.google.com/document-ai/docs/processors-list
- Microsoft Entra OAuth2/OIDC: https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols
- LangGraph: https://docs.langchain.com/oss/python/langgraph
- MCP specification: https://modelcontextprotocol.io/specification/2024-11-05/index
- OpenTelemetry FastAPI instrumentation: https://opentelemetry-python-contrib.readthedocs.io/en/latest/instrumentation/fastapi/fastapi.html
- OpenAI Responses API option: https://platform.openai.com/docs/api-reference/responses
- Azure OpenAI option: https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/chatgpt

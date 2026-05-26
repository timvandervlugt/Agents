# Quatta Implementation Guide

This guide turns the Quatta architecture flowcharts into an implementation plan.

Quatta is not a replacement for ERP, WMS, SQL, SharePoint, Excel, documents, or operational APIs. Quatta adds a secure AI layer above those systems. It reads data with permission, builds context, lets agents reason over that context, and returns evidence-backed answers to users.

## What Quatta Does

| Quatta does | Quatta does not do by default |
| --- | --- |
| Reads operational data from existing systems | Replace ERP, WMS, SQL, or SharePoint |
| Applies tenant, role, and source permissions | Copy all customer data into a new platform |
| Combines structured data and document evidence | Treat RAG as the source of truth for transactions |
| Uses AI agents for guided analysis and drafting | Let AI write back to ERP/WMS without approval |
| Logs requests, retrieval, model usage, and decisions | Produce untraceable black-box answers |

## Document Map

- [Implementation Plan](implementation-plan.md): build phases, services, and done criteria.
- [Architecture Map](architecture-map.md): stable step IDs that connect flowchart nodes to implementation sections.
- [01 Core Platform](flows/01-core-platform.md): app, auth, gateway, retrieval, agents, audit.
- [02 Data Access](flows/02-data-access.md): connector patterns, cache, freshness, failure handling.
- [03 Retrieval + RAG](flows/03-retrieval-rag.md): structured retrieval and document RAG.
- [04 Inventory Agent](flows/04-inventory-agent.md): inventory variance analysis workflow.
- [05 Claims Agent](flows/05-claims-agent.md): claim eligibility, liability, evidence, draft, approval.

## Service Decisions

| Need | Use | When |
| --- | --- | --- |
| Backend APIs and gateway | Python + FastAPI | All Quatta HTTP APIs, auth middleware, AI Gateway, connector orchestration |
| Hosting | Google Cloud Run | Stateless API services, connector workers, ingestion jobs, agent endpoints |
| Primary model | Gemini via Vertex AI | Reasoning, summarization, classification, drafting, root-cause analysis |
| Optional model provider | OpenAI or Azure OpenAI | Customer requires Azure tenancy, specific model behavior, or model redundancy |
| Agent orchestration | LangGraph | Multi-step workflows with permissions, retrieval, analysis, fallback, approval |
| Tool boundary for agents | MCP | Controlled agent tools such as `get_erp_transactions` or `draft_claim_email`; not bulk ingestion |
| App database | PostgreSQL | Tenants, roles, audit logs, connector config, cache metadata, job state |
| Vector retrieval | pgvector | Embedding storage and similarity search inside PostgreSQL |
| Document OCR/extraction | Vertex AI Document AI | PDFs, contracts, SOPs, PODs, invoices, claim evidence |
| Identity | Microsoft Entra ID | SSO, OIDC/OAuth, group claims, RBAC mapping |
| Observability | OpenTelemetry | Traces, logs, latency, error rate, connector health, model cost correlation |

## Official References

- Vertex AI documentation: https://cloud.google.com/vertex-ai/docs
- Cloud Run FastAPI quickstart: https://docs.cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-fastapi-service
- Document AI overview: https://cloud.google.com/document-ai/docs/overview
- Microsoft Entra OAuth/OIDC flows: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow
- OpenTelemetry Python: https://opentelemetry.io/docs/languages/python/
- OpenTelemetry FastAPI instrumentation: https://opentelemetry-python-contrib.readthedocs.io/en/latest/instrumentation/fastapi/fastapi.html
- pgvector: https://github.com/pgvector/pgvector
- Model Context Protocol: https://modelcontextprotocol.io/docs/learn

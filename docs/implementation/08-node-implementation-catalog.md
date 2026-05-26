# 08 - Node Implementation Catalog

This catalog explains the main tiles in the Quatta architecture map. Use it when a tile needs to become actual implementation work at a customer.

## Standard Node Template

Each build node should define:

- What it is
- Where it fits in the flow
- What to implement at a customer
- Required stack and services
- Prerequisites
- Setup steps
- Data contracts and metadata
- Security controls
- Monitoring and audit
- Acceptance criteria
- Test fixtures
- Open decisions

## Core Nodes

| Node | Standard implementation |
| --- | --- |
| Customer Systems | Register every ERP, WMS, SQL, file, SharePoint, API and document source with owner, access method, freshness SLA and permission model. |
| Quatta App | FastAPI on Cloud Run with typed schemas, trace ID middleware, health endpoints and Entra-authenticated request context. |
| Auth / RBAC | Microsoft Entra ID token validation plus Quatta tenant, role, site, customer, article, order, claim and document filters. |
| AI Gateway | FastAPI policy layer for model routing, safety, prompt versioning, tool allowlists and response validation. |
| Connector Modules | Read-only Python adapters with `authenticate`, `fetch`, `normalize`, `health_check` and `emit_audit_event`. |
| Structured Retrieval | Allowlisted SQL/API query templates that return exact operational facts with source IDs and timestamps. |
| Document AI | Vertex AI Document AI processors for OCR, table extraction, page references and document confidence. |
| Chunking | Semantic chunks with document ID, version, page range, section title, ACL and tenant metadata. |
| Embeddings / Vertex AI | Versioned embedding model that converts approved chunks into vectors and stores model metadata. |
| pgvector | PostgreSQL vector index with tenant and ACL filters applied before similarity ranking. |
| Context Builder | Merges structured facts and RAG passages into a grounded context package with citations and warnings. |
| LangGraph | Workflow state machine for tool calls, model calls, retries, branching and human checkpoints. |
| Audit / OpenTelemetry | Traceable record of source access, retrieval, model calls, policy checks, approvals and final response. |

## Customer Implementation Defaults

At a customer, Quatta should implement these defaults unless there is a strong reason not to:

1. Data remains in customer systems.
2. Connectors use read-only credentials.
3. Structured data stays structured for calculations.
4. Documents use RAG only after OCR, chunking, metadata and ACL handling.
5. Financial and liability calculations are deterministic tools, not model guesses.
6. Model calls go through the AI Gateway.
7. Agent tools use approved schemas and policies, optionally exposed through MCP.
8. Human approval is required for outbound claims, writeback and high-risk actions.
9. Audit is sufficient to reconstruct every answer.
10. Security controls fail closed for high-risk flows.

## Detailed HTML Version

For the readable browser version, open:

- `quatta-node-implementation-catalog.html`

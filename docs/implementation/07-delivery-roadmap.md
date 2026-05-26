# 07 - Delivery Roadmap

## Recommended Build Order

### Sprint 1 - Platform Skeleton

- FastAPI app with `/health`, `/ready`, and `/version`
- Cloud Run deployment
- PostgreSQL connection
- OpenTelemetry instrumentation
- Entra ID token validation
- basic audit event writer

### Sprint 2 - Connector Foundation

- connector interface
- tenant connector registry
- Secret Manager integration
- sample SQL connector
- sample file connector
- connector health endpoint
- normalized output models

### Sprint 3 - Retrieval Foundation

- structured retrieval router
- semantic mapping layer
- Document AI OCR ingestion job
- chunking and embeddings pipeline
- pgvector schema and indexes
- Context Builder v1

### Sprint 4 - AI Gateway

- Vertex AI Gemini provider
- optional OpenAI/Azure OpenAI provider interface
- model routing config
- prompt policy versions
- structured JSON response validation
- safety checks and escalation rules

### Sprint 5 - Inventory Agent MVP

- LangGraph inventory workflow
- ERP/WMS transaction tools
- reconciliation logic
- root-cause summary
- evidence citations
- confidence and recommended actions

### Sprint 6 - Claims Agent MVP

- LangGraph claims workflow
- ticket/order/contract/evidence tools
- eligibility and liability rules
- draft claim email
- human review gate
- status tracking model

### Sprint 7 - Production Hardening

- automated security tests
- agent evaluation dataset
- dashboards and alerts
- backup and retention policy
- runbooks
- customer onboarding checklist

## Customer Onboarding Checklist

- Confirm tenant name, sites, business units, and roles.
- Register Entra ID application or configure federation.
- Identify read-only source access method per system.
- Agree on cache policy and data retention.
- Identify first use case: inventory variance or claims.
- Collect sample documents, contracts, SOPs, tickets, and transactions.
- Define success metrics and escalation owners.

## Definition Of Done For A Customer Pilot

- One tenant connected with read-only credentials.
- At least one structured source and one document source available.
- Inventory or claims agent answers with citations.
- Human users validate at least 20 known cases.
- No cross-tenant or cross-role access in tests.
- Audit trail can reconstruct every answer.

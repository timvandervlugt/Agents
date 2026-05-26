# Architecture Map

Use these step IDs in diagrams, implementation docs, tickets, and delivery plans.

## 01 Core Platform

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| HL-01 | User | Quatta App |
| HL-02 | Quatta App | FastAPI frontend/backend boundary |
| HL-03 | Auth / RBAC | Entra ID + FastAPI middleware |
| HL-04 | AI Gateway | FastAPI AI Gateway |
| HL-05 | Connector Layer | Connector services |
| HL-06 | Retrieval Layer | Retrieval service + PostgreSQL/pgvector |
| HL-07 | Context Builder | Context packaging and citations |
| HL-08 | AI / Agent Layer | LangGraph workflows behind AI Gateway policy |
| HL-09 | Grounded Response | AI Gateway + Quatta App |
| HL-10 | Customer Systems | ERP/WMS/SQL/files/API integrations |
| SEC-00 | Security / Monitoring Controls | Audit, OpenTelemetry, governance |

## 02 Data Access

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| CON-01 | Source Systems | Customer connector inventory |
| CON-02 | Authenticate | Entra ID + source credentials |
| CON-03 | Connector Modules | Python connector interface |
| CON-04 | Optional TTL Cache | PostgreSQL cache metadata |
| CON-05 | Normalize / Validate / Normalized Data | Canonical data contracts |
| CON-06 | Freshness + Health | Retry, backoff, partial results |
| CON-07 | Agent Consumers | Approved read-only tool consumers |
| CON-08 | Context Builder Input | Retrieval service |
| CON-09 | Connector Controls | Secrets, connector logs and audit records |

## 03 Retrieval + RAG

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| RAG-01 | Structured Retrieval | SQL/API retrieval service |
| RAG-02 | Fact Results | Structured records and metadata |
| RAG-03 | Retrieval Sources | ERP/WMS/SQL, SharePoint/docs, local upload/SFTP |
| RAG-04 | Document AI | Vertex AI Document AI |
| RAG-05 | Chunk | Document processing pipeline |
| RAG-06 | Embeddings | Embedding service |
| RAG-07 | pgvector | PostgreSQL vector index |
| RAG-08 | Context Builder | Context packaging and citations |
| RAG-09 | RAG Prompt | Grounded prompt assembled by AI Gateway |
| RAG-10 | Answer | AI Gateway response |
| RAG-11 | RAG Controls | Tenant/role filters, document versions, citation trace, storage lifecycle and quality |
| RAG-12 | Cloud Storage Staging | Google Cloud Storage raw document/upload staging |

## 04 Inventory Agent

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| INV-01 | Question | Quatta App |
| INV-02 | Intent Detection | AI Gateway / classifier |
| INV-03 | Permission Check | RBAC middleware |
| INV-04 | ERP Transactions | ERP connector |
| INV-05 | WMS Transactions | WMS connector |
| INV-06 | Tickets, SOPs and Contract Rules | Ticket + document retrieval |
| INV-07 | Reconcile + Context | Context Builder |
| INV-08 | Pattern Tool | Deterministic analysis tool |
| INV-09 | Financial Impact | Calculation tool |
| INV-10 | Root Cause Summary | LangGraph + Gemini |
| INV-11 | Recommended Actions | Quatta App approval workflow |
| INV-12 | Inventory Workflow Controls | RBAC, audit, tracing, confidence gates |

## 05 Claims Agent

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| CLM-01 | Claim Request | Quatta App |
| CLM-02 | Permission | RBAC middleware |
| CLM-03 | Ticket Data | Ticket connector |
| CLM-04 | Delivery / Order Data | ERP/WMS/API connectors |
| CLM-05 | Contract Rules | RAG + rule extraction |
| CLM-06 | Evidence Collection / Evidence Pack | Document/ticket retrieval |
| CLM-07 | Claim Case Context | Context Builder |
| CLM-08 | Eligibility | LangGraph + rules |
| CLM-09 | Liability | Calculation tool |
| CLM-10 | Evidence Summary | Gemini + citations |
| CLM-11 | Draft Claim Email | Gemini drafting |
| CLM-12 | Human Review | Quatta App approval workflow |
| CLM-13 | Approved Send | Outbound integration/status tracking |
| CLM-14 | Claims Workflow Controls | RBAC, audit, tracing, outbound approval |

# Architecture Map

Use these step IDs in diagrams, implementation docs, tickets, and delivery plans.

## 01 Core Platform

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| HL-01 | User Request | Quatta App |
| HL-02 | Quatta App | FastAPI frontend/backend boundary |
| HL-03 | Auth / RBAC | Entra ID + FastAPI middleware |
| HL-04 | AI Gateway | FastAPI AI Gateway |
| HL-05 | Connector | Connector services |
| HL-06 | Retrieval | Retrieval service + PostgreSQL/pgvector |
| HL-07 | Customer Systems | ERP/WMS/SQL/files/API integrations |
| HL-08 | LangGraph | Agent workflows |
| HL-09 | LLMs | Vertex AI Gemini, optional OpenAI/Azure OpenAI |
| HL-10 | Grounded Response | AI Gateway + Quatta App |
| HL-11 | Security / Monitoring | Audit, OpenTelemetry, governance |

## 02 Data Access

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| CON-01 | Source Systems | Customer connector inventory |
| CON-02 | Authenticate | Entra ID + source credentials |
| CON-03 | Connector Modules | Python connector interface |
| CON-04 | Optional TTL Cache | PostgreSQL cache metadata |
| CON-05 | Normalize Output | Canonical data contracts |
| CON-06 | Freshness + Health | Retry, backoff, partial results |
| CON-07 | Log | Audit and trace events |
| CON-08 | Context Builder Input | Retrieval service |

## 03 Retrieval + RAG

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| RAG-01 | Retrieval Router | FastAPI retrieval service |
| RAG-02 | Structured Path | SQL/API retrieval |
| RAG-03 | Semantic Map | Data mapping and canonical IDs |
| RAG-04 | Document AI | Vertex AI Document AI |
| RAG-05 | Chunk | Document processing pipeline |
| RAG-06 | Embeddings | Embedding service |
| RAG-07 | pgvector | PostgreSQL vector index |
| RAG-08 | Context Builder | Context packaging and citations |
| RAG-09 | LangGraph Agent | Agent workflow |
| RAG-10 | Grounded Answer | AI Gateway response |

## 04 Inventory Agent

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| INV-01 | Question | Quatta App |
| INV-02 | Intent | AI Gateway / classifier |
| INV-03 | Permission | RBAC middleware |
| INV-04 | ERP Transactions | ERP connector |
| INV-05 | WMS Movements | WMS connector |
| INV-06 | Tickets / SOPs | Ticket + document retrieval |
| INV-07 | Reconcile + Context | Context Builder |
| INV-08 | Pattern Analysis | LangGraph + Gemini |
| INV-09 | Financial Impact | Calculation tool |
| INV-10 | Root Cause | LangGraph + Gemini |
| INV-11 | Recommended Actions | Quatta App approval workflow |

## 05 Claims Agent

| Step ID | Node | Implementation owner |
| --- | --- | --- |
| CLM-01 | Claim Request | Quatta App |
| CLM-02 | Permission | RBAC middleware |
| CLM-03 | Ticket Data | Ticket connector |
| CLM-04 | Delivery Data | ERP/WMS/API connectors |
| CLM-05 | Contract Rules | RAG + rule extraction |
| CLM-06 | Evidence | Document/ticket retrieval |
| CLM-07 | Claim Case Context | Context Builder |
| CLM-08 | Eligibility | LangGraph + rules |
| CLM-09 | Liability | Calculation tool |
| CLM-10 | Evidence Summary | Gemini + citations |
| CLM-11 | Draft Claim | Gemini drafting |
| CLM-12 | Human Review | Quatta App approval workflow |
| CLM-13 | Approved Send | Outbound integration/status tracking |

# 03 Retrieval + RAG

Purpose: find the right structured facts and document evidence before asking the model to answer.

RAG means retrieval-augmented generation: Quatta retrieves relevant facts or document passages first, then passes that grounded context to the model.

## Structured Retrieval

Use structured retrieval for operational truth:
- Stock counts
- Transactions
- Orders
- Deliveries
- Claims/tickets
- Financial values

Do not use RAG as the source of truth for transaction data.

Setup checklist:
- Query ERP/WMS/SQL/API through read-only connectors.
- Apply RBAC and tenant filters before querying.
- Map source IDs, locations, units, status codes, and timestamps.
- Return structured facts with source record IDs.

Done criteria: Structured facts are deterministic and cite source records.

## Document RAG

Use RAG for unstructured or semi-structured knowledge:
- Contracts
- SOPs
- PDFs
- SharePoint documents
- Ticket notes
- Claim evidence

Setup checklist:
- Discover documents with source permissions.
- Accept customer uploads, local/SFTP drops and API-delivered documents only through governed ingestion.
- Stage raw files and extracted artifacts in tenant-scoped Google Cloud Storage with bucket IAM, KMS, lifecycle rules, object versioning where needed and malware/quarantine status.
- Extract text using Vertex AI Document AI.
- Chunk by document structure, headings, clauses, pages, or tables.
- Generate embeddings.
- Store vectors in pgvector with tenant, document ID, chunk ID, version, ACL, source timestamp, and retention metadata.
- Re-index when documents change.
- Remove or disable vectors when source documents are deleted or access is revoked.

Done criteria: Retrieval returns passages with document ID, chunk ID, version, storage object reference, timestamp, and permission proof.

## Context Builder

What it does: Combines structured facts and RAG passages into one context package for the AI Gateway and agents.

Output should include:
- Structured facts
- Relevant document passages
- Citations
- Retrieval timestamp
- Query trace ID
- Confidence signals
- Missing/conflicting evidence warnings

Done criteria: The model answer can be traced back to records and document chunks.

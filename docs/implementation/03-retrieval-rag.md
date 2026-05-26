# 03 - Retrieval + RAG Flow

## What This Flowchart Implements

Retrieval combines structured operational facts with unstructured document evidence. Structured retrieval uses SQL/API connectors. Unstructured retrieval remains live and deterministic. Unstructured retrieval stages documents in tenant-scoped Google Cloud Storage when files are uploaded, dropped by SFTP, exported locally, or copied from SharePoint/API sources, then uses Document AI OCR, chunking, embeddings, pgvector, metadata filters, and RAG. Both paths meet in the Context Builder.

## Structured Retrieval Path

Use structured retrieval for:

- inventory transactions
- warehouse movements
- orders
- deliveries
- claims/tickets
- invoices
- SLA metrics
- item, customer, carrier, and site master data

Setup:

1. Define canonical entities and metrics.
2. Map each customer source schema to canonical fields.
3. Create allowlisted SQL/API query templates.
4. Add tenant, role, site, customer, and item filters.
5. Return rows with source system, record ID, event time, and retrieval time.
6. Validate units, time zones, statuses, and IDs before context assembly.

## Document RAG Path

Use RAG for:

- contracts
- SOPs
- carrier terms
- claims attachments
- proofs of delivery
- photos and scans
- emails exported as documents
- customer-specific policies

Supported document entry paths:

- SharePoint or Microsoft Graph source documents
- customer upload through Quatta App
- SFTP or watched local folder drop
- API-delivered document payload
- exported email, attachment or scanned proof package

Setup:

1. Ingest documents from SharePoint, upload, SFTP, local/exported folder, or API.
2. Preserve document metadata:
   - tenant
   - source system
   - document ID
   - version ID
   - owner
   - ACL / permission groups
   - modified timestamp
   - storage bucket/object ID
   - malware scanning status
   - retention/lifecycle class
3. Stage raw files and extracted artifacts in Google Cloud Storage with tenant isolation, bucket IAM, KMS encryption, lifecycle policy and object versioning where required.
4. Keep a local file-drop connector only as an ingestion source; do not let local storage become an ungoverned retrieval index.
5. Use Vertex AI Document AI for OCR when the document is scanned, image-heavy, handwritten, or layout-sensitive.
6. Chunk text by semantic section, not only fixed length.
7. Create embeddings for each chunk.
8. Store embeddings in pgvector with tenant and ACL metadata.
9. On deletion or permission changes, remove or hide chunks accordingly.
10. Re-index changed documents based on version or modified timestamp.

## Context Builder

The Context Builder is the key bridge between retrieval and agents. It should produce a structured context object:

```json
{
  "question": "...",
  "tenant_id": "...",
  "user_permissions": ["..."],
  "structured_facts": [],
  "document_evidence": [],
  "conflicts": [],
  "missing_sources": [],
  "freshness": {},
  "provenance": [],
  "confidence_inputs": {}
}
```

It should not simply paste raw documents into the prompt. It should select, compress, cite, and label evidence.

## RAG Guardrails

- Apply metadata filters before vector similarity search.
- Never retrieve chunks from another tenant or from documents the user cannot access.
- Treat Google Cloud Storage as governed staging/object storage, not as an authorization bypass.
- Detect prompt injection inside documents and mark risky chunks.
- Prefer direct structured facts over vague document language when they conflict.
- Escalate when contract rules are missing or ambiguous.

## Acceptance Criteria

- Structured and RAG retrieval can be tested independently.
- Every answer cites source system, record/document ID, chunk ID, source timestamp, and retrieval timestamp.
- Deleted or permission-revoked SharePoint content is no longer retrievable.
- Deleted, quarantined or retention-expired GCS/local-ingested documents are no longer retrievable.
- RAG retrieval returns no cross-tenant chunks in automated tests.
- Context Builder flags stale, missing, or conflicting evidence.

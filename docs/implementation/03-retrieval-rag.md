# 03 Retrieval + RAG

Structured retrieval is for transaction truth: ERP, WMS, SQL, orders, stock, deliveries and claims.

RAG is for documents: contracts, SOPs, PDFs, SharePoint documents, claim evidence and ticket notes.

Pipeline:
1. Use Document AI for OCR and extraction.
2. Chunk documents by structure.
3. Generate embeddings.
4. Store vectors in pgvector with tenant, ACL, document ID, version and timestamp.
5. Apply metadata and RBAC filters before vector search.
6. Build a context package with citations.

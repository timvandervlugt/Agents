# 02 - Connector Layer Flow

## What This Flowchart Implements

The connector layer retrieves read-only data from ERP, WMS, SQL databases, Excel/CSV, SharePoint, APIs, and documents. It authenticates safely, normalizes source output, records freshness, and exposes context-ready data to retrieval and agents.

## Connector Types

| Source | Connector method | Notes |
| --- | --- | --- |
| ERP | API, database view, export table, or customer-provided endpoint | Prefer read-only API or read replica |
| WMS | API, event export, SQL view, or SFTP file drop | Capture movement timestamps, location, unit, status |
| SQL | Read-only database user with allowlisted queries | Use parameterized SQL and schema registry |
| Excel/CSV | SharePoint, SFTP, upload, or watched folder | Validate columns and freshness |
| SharePoint | Microsoft Graph API | Sync permissions and document metadata |
| APIs | OAuth2/API keys/service accounts | Store credentials in Secret Manager |
| Documents | SharePoint/file connector plus Document AI ingestion | Preserve document IDs, versions, ACL metadata |

## Setup Steps

1. Define a connector contract:
   - `test_connection()`
   - `get_schema()`
   - `query(params)`
   - `get_freshness()`
   - `normalize(records)`
   - `health()`
2. Create a per-tenant connector registry in PostgreSQL:
   - tenant ID
   - source type
   - enabled scopes
   - credential secret reference
   - allowed entities
   - cache TTL
   - last successful call
   - health status
   - connector owner and escalation contact
   - schema/data-contract version
   - rate-limit and retry policy
3. Create source-specific adapters for ERP, WMS, SQL, files, SharePoint, API, and documents.
4. Implement read-only safeguards:
   - allowlisted endpoints and queries
   - no mutation methods in default adapters
   - credential scopes restricted to read access
   - integration tests that fail if write methods exist
5. Add normalized output models:
   - `InventoryTransaction`
   - `WarehouseMovement`
   - `OrderDelivery`
   - `TicketClaim`
   - `ContractRule`
   - `DocumentEvidence`
6. Add optional caching:
   - tenant-scoped cache key
   - role-aware visibility
   - TTL per source
   - source timestamp
   - staleness warnings
7. Add connector health:
   - last success
   - last error
   - latency
   - retry count
   - partial-result eligibility
8. Add production ingestion controls:
   - idempotency key per source request or file
   - queue or job ID for scheduled sync/document ingestion
   - dead-letter queue for unrecoverable connector jobs
   - backpressure and rate-limit handling
   - credential rotation workflow
   - private connectivity option for customer networks

## MCP Guidance

Use MCP when connectors become agent-callable tools. Each connector tool should have:

- explicit input schema
- tenant and user context
- read-only permission policy
- clear output schema
- audit event emitted before and after execution

Example MCP-style tool names:

- `erp.get_inventory_transactions`
- `wms.get_stock_movements`
- `tickets.search_claims`
- `contracts.retrieve_rules`
- `documents.search_evidence`

Keep the underlying Python connector logic independent from MCP so it can also be called by batch jobs and API endpoints.

## Failure Handling

- Retry transient errors with backoff.
- Use idempotency keys so retries do not duplicate cached records, indexed documents, or outbound status updates.
- Send unrecoverable async jobs to a dead-letter queue with tenant, source, job ID, error class, and owner.
- Return partial results when at least one source is unavailable.
- Mark missing sources in the response.
- Escalate repeated failures to an integration owner.
- Never silently answer as if unavailable data was checked.

## Acceptance Criteria

- Every connector can run in test mode against sample data.
- Every connector returns normalized output with source IDs and timestamps.
- Connector failures are visible to users and monitoring.
- Cached results show freshness and source timestamp.
- Audit log shows source queried, parameters, row counts, latency, and result status.

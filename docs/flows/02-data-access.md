# 02 Data Access

Purpose: safely read customer data without replacing source systems.

## Connector Pattern

Every connector should implement this Python interface:

```python
class Connector:
    def authenticate(self, tenant_id: str) -> AuthContext: ...
    def fetch(self, request: ConnectorRequest) -> ConnectorResult: ...
    def normalize(self, raw: ConnectorResult) -> list[CanonicalRecord]: ...
    def health_check(self) -> ConnectorHealth: ...
    def emit_audit_event(self, event: ConnectorAuditEvent) -> None: ...
```

## CON-02 Authenticate

What it does: Combines user identity from Entra ID with source-specific credentials such as API keys, OAuth tokens, service accounts, database users, or SharePoint permissions.

Setup checklist:
- Store source credentials in Secret Manager.
- Scope credentials to read-only access.
- Rotate credentials.
- Validate tenant and source-system mapping before use.

Done criteria: Connector cannot fetch data without tenant, user, role, and source authorization.

## CON-03 Connector Modules

Use one module per source family:
- ERP connector: inventory transactions, orders, invoices, article master data.
- WMS connector: warehouse movements, picks, receipts, adjustments, locations.
- SQL connector: governed read-only queries or views.
- File connector: Excel/CSV parsing and schema validation.
- SharePoint connector: document and folder discovery with ACL awareness.
- API connector: delivery, carrier, customer, ticket, or claims systems.
- Document connector: PDFs, contracts, SOPs, PODs, invoices.

Done criteria: Each connector returns normalized objects, not raw vendor-specific payloads.

## CON-04 Optional TTL Cache

What it does: Improves performance without becoming a shadow data warehouse.

Rules:
- Cache is optional and tenant-scoped.
- Cache must carry TTL, source timestamp, retrieval timestamp, and permission scope.
- Cache must not bypass RBAC.
- Sensitive fields can be excluded or encrypted.

Done criteria: A stale or partial cache result is visible to the user and audit log.

## CON-05 Normalize Output

What it does: Converts source-specific fields into canonical records.

Recommended canonical objects:
- `InventoryTransaction`
- `WarehouseMovement`
- `OrderDelivery`
- `ClaimTicket`
- `ContractRule`
- `DocumentEvidence`

Done criteria: Context Builder receives predictable fields with provenance.

## CON-06 Freshness + Health

What it does: Makes connector reliability visible.

Setup checklist:
- Add health checks per connector.
- Add retry/backoff.
- Add partial-result mode.
- Add last successful sync/read timestamp.
- Add user-facing missing-source warnings.

Done criteria: Connector failures never silently remove evidence from an AI answer.

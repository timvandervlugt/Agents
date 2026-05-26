# 02 Connector Layer

Purpose: safely read customer data without replacing the source systems.

Connector interface:
- authenticate
- fetch
- normalize
- health_check
- emit_audit_event

Connectors should be read-only by default and use source-specific credentials from Secret Manager. Every result must include source system, record ID, tenant ID, retrieval timestamp and trace ID.

Use MCP only for approved agent-callable tools, not as the bulk ingestion layer.

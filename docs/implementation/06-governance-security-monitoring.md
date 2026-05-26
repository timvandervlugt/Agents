# 06 Governance, Security And Monitoring

Controls:
- Tenant isolation.
- RBAC before every connector or retrieval call.
- Prompt injection checks.
- PII and sensitive-data filtering where required.
- Tool-call allowlists.
- Response validation.
- Low-confidence escalation.
- No writeback without approval.

Monitoring:
- OpenTelemetry traces.
- Connector health.
- Retrieval latency and quality.
- Model cost and latency.
- Error rate.
- Audit completeness.

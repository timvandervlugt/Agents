# 06 - Governance, Security, And Monitoring

## Purpose

This document defines the cross-cutting controls that apply to every flowchart step.

## Governance Controls

- Tenant isolation in all tables, caches, vector indexes, object storage, logs, and audit events.
- Role-based access control mapped from Microsoft Entra ID groups or app roles.
- Tool-call policy per role, tenant, connector, and workflow.
- Prompt and document injection detection before tool calls and before model generation.
- PII and sensitive-data minimization before model calls.
- Data classification for source records, documents, prompts, outputs, caches, vectors, logs, and exports.
- KMS-backed encryption policy for Cloud SQL, Cloud Storage, backups, secrets, and exported artifacts.
- Data residency policy per tenant and model provider.
- Structured output validation before returning answers.
- Confidence thresholds and escalation rules.
- Human approval gates for outbound actions and any operational writeback.
- Break-glass admin access with explicit approval, short-lived elevation, and audit trail.
- Segregation of duties between connector administration, model policy administration, and reviewer approval.

## Audit Model

Every user request should create an audit chain:

1. user request
2. tenant and role context
3. permissions checked
4. sources queried
5. connector parameters
6. retrieval results and provenance
7. model provider and model name
8. prompt policy version
9. generated response
10. confidence and validation result
11. human reviewer action if any
12. outbound action if approved

Audit records should be append-only. Do not overwrite earlier drafts or decisions.
For regulated or high-risk customers, use immutable storage or WORM-style retention for audit exports and incident evidence.

## Monitoring Signals

| Signal | Why it matters |
| --- | --- |
| API latency | User experience and Cloud Run sizing |
| connector latency | Customer system bottlenecks |
| connector error rate | Integration health |
| stale-source count | Trustworthiness of answers |
| retrieval hit rate | RAG quality |
| no-evidence answer rate | Knowledge coverage |
| model latency and cost | Operational control |
| escalation rate | Agent reliability |
| audit completeness | Compliance readiness |
| storage lifecycle events | Retention and deletion proof |
| denied permission checks | Authorization drift |
| cost and quota budget | Provider outage and runaway spend |

## Security Tests

- Cross-tenant retrieval test.
- User without role cannot call restricted tools.
- Prompt injection in document chunks does not trigger unauthorized tools.
- Deleted SharePoint document is removed from retrieval.
- Deleted, quarantined, retention-expired, or permission-revoked Cloud Storage objects are removed from retrieval.
- Cached result is not visible to another role.
- Connector write methods are unavailable in default mode.
- Low confidence answer triggers escalation.
- Break-glass admin actions are logged, time-bound, and reviewed.

## Runbooks

Create runbooks for:

- connector outage
- stale cache or failed sync
- Document AI ingestion backlog
- vector index corruption or rebuild
- model provider outage
- unexpected model cost spike
- audit log write failure
- suspected cross-tenant access incident
- retention/legal hold request
- KMS/key rotation issue
- private connectivity outage

## Production Readiness Gate

Do not pilot with a live customer until:

- authentication, RBAC, and tenant filters pass automated tests
- audit records are complete for all agent runs
- connector failures produce clear partial-result warnings
- RAG retrieval respects ACL metadata
- human review gates are active for claims and operational actions
- rollback and incident procedures exist
- backup restore tests and retention/deletion tests have passed

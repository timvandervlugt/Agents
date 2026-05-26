# 01 Core Platform

Purpose: show the whole Quatta system in one flow. Keep this business-readable: user asks, Quatta authenticates, retrieves permitted context, agents reason, response returns with audit.

## HL-01 User Request

What it does: Captures a business question or action request from a planner, finance user, operations manager, or claims specialist.

Service used: Quatta App backed by Python FastAPI.

Input: Natural language request, tenant context, user identity, optional entity IDs such as article, order, shipment, site, or claim.

Output: Normalized request object with trace ID.

Security: User must be authenticated before the request reaches AI Gateway.

Done criteria: Request has user ID, tenant ID, role, trace ID, and intended workflow.

## HL-03 Auth / RBAC

What it does: Verifies login, tenant, role, and source-system permissions.

Service used: Microsoft Entra ID for identity; FastAPI middleware and PostgreSQL for role mapping.

Setup checklist:
- Register the Quatta app in Microsoft Entra ID.
- Configure OIDC/OAuth authorization code flow.
- Map Entra groups to Quatta roles.
- Add tenant ID and role claims to every request context.
- Block connector and retrieval calls before any source data is read.

Monitoring: Audit success/failure for every permission check.

Done criteria: Unauthorized users cannot call connector, retrieval, or agent tools.

## HL-04 AI Gateway

What it does: Central control point for model routing, prompt policy, tool permissions, safety checks, and response validation.

Service used: Python FastAPI; Vertex AI Gemini as the default model provider; optional OpenAI/Azure OpenAI.

Setup checklist:
- Define model-provider interface.
- Add model routing by tenant, workflow, cost, and data residency.
- Add prompt-injection checks.
- Add PII or sensitive-data filtering where required.
- Add tool-call allowlist.
- Add response schema validation.
- Add low-confidence escalation policy.

Done criteria: No agent can call arbitrary tools or models outside the gateway policy.

## HL-05 Connector

What it does: Reads permitted data from ERP, WMS, SQL, Excel/CSV, SharePoint, documents, and APIs.

Service used: Python connector modules; credentials in Secret Manager; optional MCP wrapper for agent-facing tools.

Security: Read-only by default. No writeback unless explicitly designed, approved, and audited.

Done criteria: Every read returns provenance: source system, record ID, retrieval timestamp, tenant ID, and trace ID.

## HL-08 LangGraph

What it does: Orchestrates multi-step workflows where order, state, fallback, and approval matter.

Use LangGraph when:
- The agent has multiple deterministic steps.
- Retrieval and calculations must happen before reasoning.
- Missing/conflicting evidence needs a branch.
- Human approval is part of the workflow.

Do not use LangGraph for simple one-shot summaries or basic CRUD APIs.

Done criteria: Each agent graph has typed state, retry/fallback behavior, and audit events per node.

## HL-11 Security / Monitoring

What it does: Keeps the system enterprise-safe and operable.

Services used: PostgreSQL audit log, OpenTelemetry, Cloud Logging/Monitoring or equivalent.

Track:
- Tenant, user, role, action, permissions checked.
- Connectors queried and source records used.
- Documents/chunks retrieved.
- Model provider, model name, latency, token/cost estimate.
- Generated answer and human approval/rejection.

Done criteria: Every AI answer can be reconstructed from evidence and logs.

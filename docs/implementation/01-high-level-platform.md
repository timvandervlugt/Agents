# 01 High-Level Platform

Build order:
1. Deploy Python FastAPI to Google Cloud Run.
2. Add Microsoft Entra ID authentication.
3. Add tenant and RBAC middleware.
4. Add AI Gateway for model routing, prompt policy and tool permissions.
5. Add PostgreSQL audit logging and OpenTelemetry tracing.

Default model provider: Gemini via Vertex AI. Optional providers: OpenAI or Azure OpenAI when required by a customer.

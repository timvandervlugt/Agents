# 05 Claims Agent

Purpose: prepare claim decisions and draft communication while keeping humans in control.

## Workflow

1. Receive claim request.
2. Check user permission for tenant, customer, carrier, order, and claim type.
3. Fetch ticket data.
4. Fetch delivery/order data.
5. Retrieve contract rules.
6. Collect evidence.
7. Build claim case context.
8. Check eligibility.
9. Calculate liability.
10. Summarize evidence.
11. Draft claim email.
12. Human review.
13. Approved send and status tracking.

## AI Boundary

AI may:
- Analyze evidence.
- Apply retrieved rules.
- Calculate suggested liability with tool support.
- Draft an email.

AI may not by default:
- Submit a claim externally.
- Update ERP/WMS records.
- Send outbound email without human approval.

## LangGraph Setup

Use LangGraph because the workflow has evidence gathering, rules, calculations, drafting, approval, and status tracking.

Graph nodes:
- `receive_claim_request`
- `check_permission`
- `fetch_ticket`
- `fetch_delivery_order`
- `retrieve_contract_rules`
- `collect_evidence`
- `build_case_context`
- `check_eligibility`
- `calculate_liability`
- `summarize_evidence`
- `draft_email`
- `human_review`
- `approved_send`
- `track_status`

## Output Contract

Return:
- Eligibility decision
- Liability amount and calculation basis
- Evidence package
- Draft email
- Missing evidence
- Approval status
- Audit ID

Done criteria: The final claim package is evidence-backed and human-approved before outbound action.

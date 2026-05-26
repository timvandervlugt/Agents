# 04 Inventory Agent

Purpose: answer “Why does article X have inventory differences?” with evidence, not guesses.

## Workflow

1. Detect inventory-variance intent.
2. Check user permission for tenant, site, article, and inventory data.
3. Fetch ERP transactions.
4. Fetch WMS movements.
5. Fetch tickets, claims, incidents, and relevant notes.
6. Retrieve SOPs and contract rules.
7. Reconcile ERP and WMS evidence.
8. Analyze patterns.
9. Calculate financial impact.
10. Summarize likely root cause with confidence and citations.
11. Recommend actions for an operations manager.

## Reconciliation Rules

Normalize before reasoning:
- Article IDs and aliases
- Units of measure
- Time zones and transaction dates
- Warehouse locations
- Status codes
- Transaction direction
- Cancellation/reversal records

## LangGraph Setup

Use LangGraph because this is a stateful workflow with required ordering, branching, retries, and escalation.

Graph nodes:
- `detect_intent`
- `check_permission`
- `fetch_erp_transactions`
- `fetch_wms_movements`
- `fetch_tickets_claims`
- `retrieve_sop_contracts`
- `reconcile_context`
- `analyze_patterns`
- `calculate_financial_impact`
- `summarize_root_cause`
- `recommend_actions`
- `escalate_if_low_confidence`

## Output Contract

Return:
- Likely root cause
- Supporting evidence
- Conflicting or missing evidence
- Confidence level
- Financial impact
- Recommended actions
- Sources and audit ID

Done criteria: The answer is operationally useful and clearly states whether a human must review before action.

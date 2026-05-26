# 05 - Claims Agent Flow

## What This Flowchart Implements

The Claims Agent helps prepare a claim from ticket, delivery/order data, contract rules, and evidence. It checks eligibility, calculates liability, drafts a claim email, and routes the result through human review before any outbound action.

## LangGraph Workflow

Recommended nodes:

1. `classify_claim_request`
2. `check_permissions`
3. `fetch_ticket_data`
4. `fetch_delivery_order_data`
5. `retrieve_contract_rules`
6. `collect_evidence`
7. `build_claim_case_context`
8. `eligibility_check`
9. `liability_calculation`
10. `evidence_summary`
11. `draft_claim_email`
12. `human_review`
13. `approved_send_or_export`
14. `status_tracking`
15. `audit_final_version`

## Implementation Steps

1. Define supported claim types:
   - late delivery
   - damaged goods
   - missing goods
   - shortage
   - SLA penalty
   - carrier charge dispute
   - invoice/chargeback dispute
2. Define required evidence per claim type:
   - ticket ID
   - order/delivery ID
   - customer/carrier
   - date/time stamps
   - POD or delivery proof
   - photos or scan evidence
   - relevant contract/SLA rule
   - limitation period or filing deadline
   - duplicate claim check result
3. Retrieve ticket and order data through read-only connectors.
4. Retrieve contract rules through RAG with metadata filters.
5. Calculate eligibility:
   - deadline met
   - contract rule exists
   - evidence complete
   - claim value above threshold
   - liability party identifiable
   - no duplicate active claim exists
6. Calculate liability:
   - penalty formula
   - cap
   - exclusions
   - currency
   - supporting records
   - Incoterms, carrier SLA, or customer-specific terms where applicable
7. Draft communication:
   - concise claim email
   - evidence table
   - attachments list
   - requested compensation
   - deadline for response
   - outbound channel and destination policy
8. Route to human review:
   - approve
   - edit
   - reject
   - request more evidence
9. Only after approval:
   - export email draft
   - send through approved email integration
   - update ticket status if writeback is separately approved
   - track claim status

## Agent Output Contract

```json
{
  "eligible": true,
  "eligibility_reason": "...",
  "liability_amount": 0,
  "currency": "EUR",
  "contract_rule_citations": [],
  "evidence": [],
  "missing_evidence": [],
  "draft_email": {
    "subject": "...",
    "body": "...",
    "attachments": []
  },
  "requires_human_review": true,
  "approved_send_completed": false
}
```

## Human Controls

- Claims are drafted, not automatically submitted.
- Any send/export action requires explicit human approval.
- Human edits become the final audited version.
- Rejected claims retain evidence and reason for rejection.

## Acceptance Criteria

- Agent never sends a claim without approval.
- Contract rule citations are included for every eligibility decision.
- Liability calculations are reproducible from cited facts.
- Missing evidence prevents confident claim submission.
- Audit log includes draft, review action, final version, and outbound status.

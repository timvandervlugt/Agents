# 04 - Inventory Agent Flow

## What This Flowchart Implements

The Inventory Agent answers: "Why does article X have inventory differences?"

It detects intent, checks permissions, retrieves ERP/WMS/ticket/SOP evidence, reconciles operational data, analyzes patterns, estimates financial impact, and recommends actions without automatic writeback.

## LangGraph Workflow

Recommended nodes:

1. `detect_intent`
2. `check_permissions`
3. `fetch_erp_transactions`
4. `fetch_wms_movements`
5. `fetch_tickets_claims`
6. `retrieve_sop_contracts`
7. `reconcile_evidence`
8. `analyze_patterns`
9. `calculate_financial_impact`
10. `build_root_cause_summary`
11. `generate_recommended_actions`
12. `quality_gate`
13. `human_escalation_if_needed`
14. `audit_response`

## Implementation Steps

1. Define the input contract:
   - item/SKU
   - site/warehouse
   - customer
   - time window
   - optional batch/lot/location
2. Implement permission checks:
   - user can access tenant
   - user can access site
   - user can access item/customer
   - user can access financial impact if requested
3. Retrieve evidence:
   - ERP stock transactions
   - WMS movements and adjustments
   - ticket/claim/incidence records
   - SOPs, contracts, and warehouse process rules
4. Reconcile evidence:
   - time zones
   - unit conversions
   - item aliases
   - batch/lot IDs
   - location aliases
   - movement/status code mapping
   - ERP posting time vs WMS event time
5. Analyze patterns:
   - missing inbound receipt
   - delayed ERP posting
   - WMS adjustment without ERP match
   - pick/pack/ship mismatch
   - counting correction
   - damaged or returned stock
   - master-data unit mismatch
6. Calculate financial impact:
   - quantity difference
   - unit cost or sales value
   - claim exposure
   - aging or service-level impact
7. Generate output:
   - root-cause hypothesis
   - confidence
   - cited evidence
   - missing data
   - recommended actions
   - approval requirements

## Agent Output Contract

```json
{
  "root_cause_summary": "...",
  "confidence": "high|medium|low",
  "financial_impact": {
    "quantity": 0,
    "estimated_value": 0,
    "currency": "EUR"
  },
  "evidence": [],
  "missing_or_conflicting_evidence": [],
  "recommended_actions": [],
  "requires_manager_approval": true,
  "writeback_performed": false
}
```

## Human Controls

- No automatic ERP or WMS corrections by default.
- Low confidence requires escalation.
- Conflicting ERP/WMS data requires escalation.
- Financially material recommendations require manager approval.

## Acceptance Criteria

- Agent explains the variance with cited ERP/WMS/ticket/document evidence.
- Agent flags stale or missing sources.
- Agent produces no writeback calls.
- Agent can be regression-tested with known variance scenarios.
- Audit log captures all evidence and the final response.

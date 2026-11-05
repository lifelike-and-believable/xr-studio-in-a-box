---
id: requirements-business
status: draft
derived-from:
  - concept#vision:
---

# Business of the performance requirements

<!-- Draft. Source: discovery sections 9, 14. Agents draft and a person approves. Ticketing is out of scope. -->

All the business tools below are in the first release. They are built into the pipeline and sized for a solo production (REQ-business-13).

## REQ-business-1: Project facts record

Each project has one record of its facts: description, technical plan, budget, credits, collaborators, schedule and work samples. Production tools and business documents both read from it.

## REQ-business-2: Funding applications

The workflow drafts funding applications from the project facts record in the format of a chosen funder. A person reviews and submits. Nothing is submitted by an agent.

## REQ-business-3: Program matching and deadlines

The workflow keeps a list of funding programs and their requirements, matches projects to those they may qualify for, and shows deadlines.

## REQ-business-4: Budgets and cost tracking

Budgets are built per project and per funder format. Actual cost is tracked against them, including generation, cloud and per-show running costs.

## REQ-business-5: Reports and claims

Interim and final reports and cost claims are drafted from the record and from tracked spend, with proof of spend attached. A person approves them.

## REQ-business-6: Tax credits and incentives

Spend and documents that may qualify for tax credits and production incentives are tracked and gathered.

## REQ-business-7: Contracts and licensing

Contracts, licences and AI-use terms are drafted and tracked. Accepting, signing or changing terms requires a person's approval (REQ-governance-1).

## REQ-business-8: Quotes, invoices and payroll

Quotes and invoices are drafted, and payroll and payment information is prepared. An agent never moves money or submits a payment.

## REQ-business-9: Scheduling

Crew and performer availability, rehearsals and shoots are scheduled, with call sheets drafted for approval.

## REQ-business-10: Venue and touring logistics

Equipment manifests, venue specifications, travel and set-up checklists are drafted and kept for each venue.

## REQ-business-11: Audience data and reporting

Attendance, feedback and analytics are collected where consent allows (REQ-governance-7) and used for funder and partner reports.

## REQ-business-12: Marketing and press

Promotional material, press kits and posts are drafted. Publishing needs a person's approval.

## REQ-business-13: Built in, open to other tools

The business tools work on their own for a solo production, with no other software needed. Each one can be replaced by or connected to a third-party tool for larger productions, such as accounting, payroll, calendars or e-signature, through an adapter (REQ-workflow-11).

## REQ-business-14: AI-use disclosure

A statement of how AI was used on a project is drafted from its provenance records, for funders, partners and credits that ask for one. A person approves it.

## REQ-business-15: Credits

Credits for shows and reports are built from the project facts and provenance records, so performers and collaborators are named correctly. A person approves them.

## REQ-business-16: Sensitive data limits

Agents never see bank details, tax numbers or similar identifiers. These are kept where only a person with the right role can reach them, and agents work only with hours and amounts.

## REQ-business-17: Records retention

Contracts, proof of spend and approvals are kept for as long as each funder, tax rule or contract requires, including after a project ends. Each record shows why it is kept and until when. Retention periods need checking per funder and jurisdiction (pending).

## Constraints

- External and financial actions need a person (discovery section 14).
- Funder formats and rules change and are checked against the funder's current documents.
- The first funder formats are Canada Media Fund, Creative BC, Epic MegaGrants and an arts council (which one is pending).
- Payroll and tax filing carry legal rules. Prepared figures are a draft for a person to check, not professional advice.
- Ticketing and capacity management are out of scope.

## Success measures

- Time to prepare a funding application, report or budget, compared with a past application chosen by the approver as the worked example (pending).

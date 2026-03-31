import { Template } from '@/types';

export const prdHealthTemplate: Template = {
  id: 'prd-health-feature-launch',
  name: 'Health Tech Feature Launch PRD (Comprehensive)',
  description: 'Complete product requirements document for Health Tech with HIPAA/FDA compliance, clinical workflows, and patient safety',
  industryId: 'health',
  scenarioId: 'feature-launch',
  frameworkIds: ['rice', 'jtbd', 'okrs'],
  outputFormat: 'markdown',
  estimatedCompletionTime: '4-5 hours',
  version: '1.0.0',
  sections: [
    {
      id: 'document-meta',
      title: 'Document Metadata',
      description: 'Track document ownership, version control, and regulatory approvals',
      fieldType: 'table',
      required: true,
      helpText: 'Include all clinical, compliance, and security stakeholders for audit trail',
      learnContentId: 'doc-versioning',
      tableSchema: {
        columns: ['Field', 'Value'],
        rows: [
          ['Document Owner', ''],
          ['Product Lead', ''],
          ['Clinical/Medical Lead', ''],
          ['Engineering Lead', ''],
          ['Compliance/Privacy Officer', ''],
          ['Security Lead', ''],
          ['Legal Counsel', ''],
          ['Status', 'Draft / In Review / Clinical Review / Compliance Review / Approved / Launched'],
          ['Last Updated', ''],
          ['Version', '1.0'],
          ['Target Launch Date', ''],
          ['FDA Classification', 'Class I / Class II / Class III / Not FDA-regulated'],
          ['HIPAA Impact Assessment', 'Required / Not Required'],
        ]
      }
    },
    {
      id: 'change-log',
      title: 'Change Log',
      description: 'Track all significant changes to this document for regulatory audit trails',
      fieldType: 'table',
      required: true,
      helpText: 'Critical for FDA 21 CFR Part 11 compliance and HIPAA audit requirements',
      learnContentId: 'change-management',
      tableSchema: {
        columns: ['Version', 'Date', 'Author', 'Changes Made', 'Reviewers', 'Approval Status', 'Regulatory Impact'],
        rows: [
          ['1.0', '', '', 'Initial draft', '', 'Pending', 'None'],
          ['1.1', '', '', '', '', 'Pending', 'None'],
        ]
      }
    },
    {
      id: 'approvers',
      title: 'Required Approvals',
      description: 'All stakeholders who must approve before launch (including clinical and regulatory)',
      fieldType: 'table',
      required: true,
      helpText: 'Clinical and compliance approval is mandatory for Health Tech products',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Department', 'Status', 'Date Approved', 'Comments', 'Signature (if required)'],
        rows: [
          ['Product', '', '', 'Pending', '', '', ''],
          ['Clinical/Medical', '', '', 'Pending', '', '', ''],
          ['Engineering', '', '', 'Pending', '', '', ''],
          ['Compliance/Privacy', '', '', 'Pending', '', '', ''],
          ['Security', '', '', 'Pending', '', '', ''],
          ['Legal', '', '', 'Pending', '', '', ''],
          ['Quality Assurance', '', '', 'Pending', '', '', ''],
          ['Executive Sponsor', '', '', 'Pending', '', '', ''],
        ]
      }
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'BLUF (Bottom Line Up Front) - One-paragraph overview with clinical context',
      fieldType: 'markdown',
      required: true,
      helpText: `**Include:**
- What we're building and the clinical problem it solves
- Target patient population and market size
- Key regulatory requirements (HIPAA, FDA, etc.)
- Expected clinical and business impact
- Critical success metrics (patient outcomes + operational)
- Major risks and mitigations

**TL;DR:** [1-2 sentence summary]

**30-Second Read:**
- Clinical Problem: [What patient/provider pain point]
- Solution: [What we're building]
- Patient Population: [Target demographic/condition]
- Regulatory Path: [FDA class, HIPAA requirements]
- Ask: [What approval/resources needed]`,
      learnContentId: 'executive-communication',
    },
    {
      id: 'clinical-need',
      title: 'Clinical Need & Problem Statement',
      description: 'What healthcare problem are we solving? Include evidence-based problem definition.',
      fieldType: 'markdown',
      required: true,
      helpText: `**Clinical Problem Definition:**
Describe the specific healthcare problem with clinical context:
- Current clinical workflow and pain points
- Impact on patient outcomes (if known)
- Impact on provider efficiency and burnout
- Cost implications for healthcare system
- Health equity considerations

**Evidence Table:**
| Evidence Type | Source | Finding | Clinical Significance | Confidence |
|--------------|--------|---------|----------------------|------------|
| Clinical Study | [Journal/PubMed ID] | [Key finding] | [Impact on outcomes] | High |
| Provider Interview | [X clinicians] | [Workflow pain point] | [Time burden] | High |
| Patient Interview | [X patients] | [Patient experience issue] | [Quality of life] | Medium |
| EHR Data | [Health system] | [Utilization pattern] | [Cost impact] | High |
| Guidelines | [Professional society] | [Recommendation] | [Standard of care] | High |

**Cost of Inaction:**
- Patient impact: [Worsened outcomes, delayed diagnosis, etc.]
- Provider impact: [Burnout, inefficiency, errors]
- Financial impact: $[X] annually in [waste/readmissions/penalties]
- Regulatory risk: [Quality measures, value-based penalties]

**Health Equity Considerations:**
- [ ] Does this affect disparate populations differently?
- [ ] Are there language/accessibility barriers?
- [ ] Will this widen or narrow health disparities?
- [ ] Have we included diverse patient voices in research?`,
      learnContentId: 'problem-definition',
    },
    {
      id: 'opportunity-assessment',
      title: 'Market Opportunity Assessment',
      description: 'Market size, competitive landscape, and strategic fit in healthcare context',
      fieldType: 'table',
      required: true,
      helpText: 'Quantify the opportunity in healthcare market terms',
      learnContentId: 'market-analysis',
      tableSchema: {
        columns: ['Metric', 'Value', 'Source', 'Notes'],
        rows: [
          ['TAM (Total Addressable Market)', '$ / Patients', '', ''],
          ['SAM (Serviceable Addressable Market)', '$ / Patients', '', ''],
          ['SOM (Serviceable Obtainable Market)', '$ / Patients', '', ''],
          ['Target Patient Population', '', '', 'Diagnosis codes, demographics'],
          ['Target Provider Specialty', '', '', ''],
          ['Competitive Advantage', '', '', 'Clinical differentiation'],
          ['Strategic Priority', 'P0/P1/P2', '', ''],
          ['Value-Based Care Alignment', 'Yes/No', '', 'Quality measure impact'],
        ]
      }
    },
    {
      id: 'stakeholders',
      title: 'Healthcare Stakeholders',
      description: 'All parties involved in care delivery with access levels and workflows',
      fieldType: 'table',
      required: true,
      helpText: 'Consider all roles in the patient care journey',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Role', 'Setting', 'Primary Needs', 'Access Level', 'Workflow Context', 'Pain Points'],
        rows: [
          ['Patient', 'Home/Clinic', 'Access to care, information', 'Self-data', 'Managing health', ''],
          ['Primary Care Provider', 'Clinic', 'Efficiency, decision support', 'Full patient record', 'Time-pressed visits', ''],
          ['Specialist Physician', 'Hospital/Clinic', 'Consult info, coordination', 'Relevant patient data', 'Care coordination', ''],
          ['Nurse/MA', 'Clinic', 'Workflow efficiency', 'Task-focused', 'Documentation burden', ''],
          ['Care Coordinator', 'Health System', 'Population management', 'Panel view', 'Tracking gaps', ''],
          ['Pharmacist', 'Pharmacy/Clinic', 'Medication safety', 'Med list, allergies', 'Drug interactions', ''],
          ['Billing/Coding', 'Back Office', 'Accurate coding', 'Clinical documentation', 'Claim denials', ''],
          ['Health Plan', 'Payer', 'Cost, quality metrics', 'Claims data', 'Population health', ''],
        ]
      }
    },
    {
      id: 'persona-deep-dive',
      title: 'Persona Deep Dive',
      description: 'Detailed stakeholder profiles with clinical context',
      fieldType: 'markdown',
      required: true,
      helpText: `**Primary Persona: [Provider Type]**

**Professional Demographics:**
- Specialty: [Primary care, cardiology, etc.]
- Practice Setting: [Private practice, academic, hospital-employed]
- Patient Panel Size: [Number]
- EHR System: [Epic, Cerner, etc.]
- Technology Comfort: [Low/Medium/High]

**Day in the Life:**
| Time | Activity | System Touchpoint | Pain Point | Opportunity |
|------|----------|-------------------|------------|-------------|
| 7:00 AM | Pre-round prep | EHR login, chart review | Too many clicks, slow load | Pre-loaded patient summaries |
| 9:00 AM | Patient visit | Documentation, ordering | Template hunting, alert fatigue | Smart phrases, relevant alerts |
| 12:00 PM | Inbox management | Results, refills, messages | Overwhelming volume | Triage, automation |
| 3:00 PM | Care coordination | Referrals, calls | Fax machine, phone tag | Digital workflows |

**Clinical Context:**
- Average visit length: [15-20 min PCP, 30-60 min specialist]
- Documentation burden: [Hours/day after clinic]
- Top 3 clinical priorities: [Quality, efficiency, satisfaction]
- Biggest frustrations: [EHR usability, administrative tasks]

**Validation Checklist:**
- [ ] Interviewed 5+ clinicians matching this persona
- [ ] Observed clinical workflow firsthand
- [ ] Reviewed EHR usage analytics
- [ ] Validated time burden assumptions`,
      learnContentId: 'persona-definition',
    },
    {
      id: 'patient-persona',
      title: 'Patient Persona',
      description: 'Target patient demographics, conditions, and health literacy considerations',
      fieldType: 'table',
      required: true,
      helpText: 'Consider health literacy, language, accessibility needs',
      learnContentId: 'persona-definition',
      tableSchema: {
        columns: ['Attribute', 'Description', 'Design Implication'],
        rows: [
          ['Age Range', '', 'Font size, UI complexity'],
          ['Conditions', '', 'Symptom presentation, comorbidities'],
          ['Health Literacy', 'Low/Medium/High', 'Language complexity, education materials'],
          ['Digital Literacy', 'Low/Medium/High', 'Onboarding, support needs'],
          ['Language Preferences', '', 'Translation requirements'],
          ['Accessibility Needs', '', 'WCAG compliance, screen readers'],
          ['Caregiver Involvement', 'Yes/No', 'Proxy access, shared decision-making'],
          ['Insurance Type', 'Commercial/Medicare/Medicaid/Uninsured', 'Coverage workflows'],
        ]
      }
    },
    {
      id: 'jtbd',
      title: 'Jobs To Be Done',
      description: 'Frame the clinical or patient need with outcome focus',
      fieldType: 'markdown',
      required: true,
      helpText: `**Primary Job Story (Provider):**
"When [clinical situation], I want to [clinical action], so I can [patient outcome/efficiency gain]."

**Example:** "When I'm seeing a patient with chest pain, I want to quickly access their cardiac history and risk factors, so I can make an accurate diagnosis in limited time."

**Primary Job Story (Patient):**
"When [health situation], I want to [health action], so I can [health outcome/peace of mind]."

**Example:** "When I receive a new diagnosis, I want to understand my treatment options in plain language, so I can participate in shared decision-making."

**Related Jobs:**
| Job Type | Job Statement | Importance (1-10) | Satisfaction (1-10) | Opportunity |
|----------|---------------|-------------------|--------------------|-------------|
| Functional (Provider) | [Clinical task] | | | |
| Emotional (Provider) | [Reduce anxiety, confidence] | | | |
| Functional (Patient) | [Health management] | | | |
| Emotional (Patient) | [Reduce fear, feel cared for] | | | |

**Alternatives Analysis:**
| Current Alternative | Why It Falls Short | Clinical Risk | Our Advantage |
|---------------------|--------------------|---------------|---------------|
| [Manual process] | [Time, error-prone] | [Patient safety] | [Automation, safety] |
| [Legacy system] | [Usability issues] | [Burnout] | [Modern UX] |
| [Do nothing] | [Status quo] | [Outcome gap] | [Improved outcomes] |`,
      learnContentId: 'jtbd-framework',
    },
    {
      id: 'regulatory-requirements',
      title: 'Regulatory & Compliance Requirements',
      description: 'HIPAA, FDA, and other healthcare compliance requirements',
      fieldType: 'table',
      required: true,
      helpText: 'Non-negotiable for Health Tech - consult regulatory affairs early',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Req ID', 'Regulation/Standard', 'Requirement Description', 'Applicability', 'Evidence Required', 'Testing Method', 'Owner', 'Status'],
        rows: [
          ['REG-001', 'HIPAA Privacy Rule', 'PHI use/disclosure restrictions', 'All features', 'Privacy assessment', 'Compliance audit', '', ''],
          ['REG-002', 'HIPAA Security Rule', 'Administrative, physical, technical safeguards', 'All features', 'Security assessment', 'Security audit', '', ''],
          ['REG-003', 'HIPAA Breach Notification', 'Breach detection and notification', 'All features', 'Incident response plan', 'Tabletop exercise', '', ''],
          ['REG-004', '21 CFR Part 11', 'Electronic records/signatures (if FDA)', 'If applicable', 'Validation documentation', 'FDA audit', '', ''],
          ['REG-005', 'FDA Classification', 'Device classification (if applicable)', 'Product-dependent', '510(k) or exemption', 'FDA submission', '', ''],
          ['REG-006', 'HIPAA Audit Trail', 'Access logging for PHI', 'All PHI access', 'Audit logs', 'Log review', '', ''],
          ['REG-007', 'HITECH Act', 'Meaningful use, breach penalties', 'All features', 'Documentation', 'Compliance audit', '', ''],
          ['REG-008', 'State Privacy Laws', 'State-specific requirements', 'Geography-dependent', 'Legal review', 'Compliance audit', '', ''],
          ['REG-009', 'GDPR (if EU patients)', 'Data protection, right to deletion', 'If applicable', 'DPIA, consent records', 'Privacy audit', '', ''],
          ['REG-010', 'CLIA (if lab tests)', 'Laboratory certification', 'If lab features', 'CLIA certificate', 'Lab audit', '', ''],
        ]
      }
    },
    {
      id: 'hipaa-compliance-checklist',
      title: 'HIPAA Compliance Checklist',
      description: 'Detailed HIPAA requirements and implementation status',
      fieldType: 'markdown',
      required: true,
      helpText: `**Administrative Safeguards:**
- [ ] Security Officer designated
- [ ] Risk assessment completed
- [ ] Risk management plan implemented
- [ ] Workforce training completed
- [ ] Sanction policy for violations
- [ ] Information system activity review
- [ ] Incident response procedures
- [ ] Contingency plan (backup, disaster recovery)
- [ ] Business Associate Agreements (BAAs) executed

**Physical Safeguards:**
- [ ] Facility access controls
- [ ] Workstation use policies
- [ ] Device and media controls
- [ ] Disposal procedures for PHI
- [ ] Media re-use procedures

**Technical Safeguards:**
- [ ] Access control (unique user IDs, emergency access)
- [ ] Audit controls (activity logging)
- [ ] Integrity controls (PHI not altered/destroyed)
- [ ] Transmission security (encryption in transit)
- [ ] Encryption at rest

**Privacy Rule Requirements:**
- [ ] Notice of Privacy Practices provided
- [ ] Patient access to records (within 30 days)
- [ ] Amendment process for records
- [ ] Accounting of disclosures
- [ ] Minimum necessary standard enforced
- [ ] Patient authorization for non-TPO uses

**Documentation:**
- [ ] Policies and procedures documented
- [ ] Documentation retained 6 years
- [ ] Privacy Impact Assessment completed`,
      learnContentId: 'non-functional-requirements',
    },
    {
      id: 'security-requirements',
      title: 'Security Requirements',
      description: 'PHI protection, access controls, and security safeguards',
      fieldType: 'table',
      required: true,
      helpText: 'PHI must be protected at rest and in transit - patient safety depends on it',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Control ID', 'Security Domain', 'Control Description', 'HIPAA Reference', 'Implementation Details', 'Verification Method', 'Owner'],
        rows: [
          ['SEC-001', 'Access Control', 'Unique user identification', '164.312(a)(1)', '', 'Security test', ''],
          ['SEC-002', 'Access Control', 'Role-based access control (RBAC)', '164.312(a)(1)', '', 'Code review', ''],
          ['SEC-003', 'Access Control', 'Emergency access procedure', '164.312(a)(2)', '', 'Tabletop test', ''],
          ['SEC-004', 'Authentication', 'Multi-factor for remote access', '164.312(d)', '', 'Penetration test', ''],
          ['SEC-005', 'Encryption', 'AES-256 encryption at rest', '164.312(e)(1)', '', 'Security audit', ''],
          ['SEC-006', 'Encryption', 'TLS 1.3+ for data in transit', '164.312(e)(1)', '', 'SSL Labs test', ''],
          ['SEC-007', 'Audit Controls', 'PHI access logging', '164.312(b)', '', 'Log review', ''],
          ['SEC-008', 'Audit Controls', 'Log retention 6 years minimum', '164.312(b)', '', 'Compliance audit', ''],
          ['SEC-009', 'Integrity', 'PHI not altered/destroyed improperly', '164.312(c)(1)', '', 'Integrity check', ''],
          ['SEC-010', 'Transmission', 'Secure messaging for PHI', '164.312(e)(1)', '', 'Security review', ''],
        ]
      }
    },
    {
      id: 'security-controls-detail',
      title: 'Security Controls Detail',
      description: 'Detailed security implementation for PHI protection',
      fieldType: 'markdown',
      required: true,
      helpText: `**Access Control:**
| Control | Implementation | HIPAA Ref | Verification |
|---------|---------------|-----------|--------------|
| User Authentication | Unique username + MFA | 164.312(a)(1) | Test all flows |
| Role-Based Access | Minimum necessary principle | 164.312(a)(1) | Access review |
| Session Timeout | Auto-logout 15 minutes | 164.312(a)(2) | Security test |
| Emergency Access | Break-glass procedure | 164.312(a)(2)(ii) | Tabletop test |

**Audit Logging:**
| Event Type | Data Logged | Retention | Alert Threshold |
|------------|-------------|-----------|-----------------|
| PHI Access | User, patient, timestamp, action | 6 years | Unusual pattern |
| Login/Logout | User, IP, device, result | 6 years | Failed attempts >5 |
| Data Export | User, records, destination | 6 years | Any bulk export |
| Permission Change | User, change, approver | 6 years | Any elevation |

**Data Protection:**
| Data Type | Encryption | Tokenization | Masking | Access Control |
|-----------|------------|--------------|---------|----------------|
| PHI | AES-256 | N/A | Yes (UI) | Role-based |
| PII | AES-256 | Yes (SSN) | Yes | Need-to-know |
| Audit Logs | AES-256 | No | No | Security only |
| Backups | AES-256 | N/A | N/A | Encrypted |

**Security Monitoring:**
- [ ] SIEM integration for real-time alerting
- [ ] PHI access anomaly detection
- [ ] Failed login monitoring
- [ ] Privileged access monitoring
- [ ] Data exfiltration detection
- [ ] Vulnerability scanning (monthly)
- [ ] Penetration testing (annual + pre-launch)`,
      learnContentId: 'non-functional-requirements',
    },
    {
      id: 'fda-requirements',
      title: 'FDA Requirements (If Applicable)',
      description: 'FDA regulatory pathway and requirements for medical devices',
      fieldType: 'table',
      required: false,
      helpText: 'Complete if product qualifies as medical device under FDA regulations',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Requirement', 'FDA Reference', 'Description', 'Evidence Required', 'Status'],
        rows: [
          ['Device Classification', '21 CFR 800', 'Class I/II/III determination', 'Classification request', ''],
          ['510(k) Submission', '21 CFR 807', 'Premarket notification (if Class II)', '510(k) number', ''],
          ['Quality System Regulation', '21 CFR 820', 'Design controls, documentation', 'QMS audit', ''],
          ['21 CFR Part 11', 'Electronic Records', 'Electronic signature compliance', 'Validation report', ''],
          ['Clinical Validation', '21 CFR 812', 'Clinical study data (if required)', 'Study protocol, results', ''],
          ['Labeling Requirements', '21 CFR 801', 'Instructions, warnings, indications', 'Label review', ''],
          ['MDR Reporting', '21 CFR 803', 'Medical device reporting', 'MDR procedures', ''],
          ['UDI Requirements', '21 CFR 830', 'Unique device identification', 'UDI assignment', ''],
        ]
      }
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics',
      description: 'Clinical outcomes, patient engagement, and operational efficiency metrics',
      fieldType: 'table',
      required: true,
      helpText: 'Balance patient outcomes with operational efficiency and satisfaction',
      learnContentId: 'success-metrics',
      tableSchema: {
        columns: ['Metric Category', 'Metric Name', 'Definition', 'Baseline', 'Target', 'Timeline', 'Owner', 'Current'],
        rows: [
          ['Clinical Outcome', '[Condition-specific metric]', '[Definition]', '', '', '6 months', '', ''],
          ['Clinical Outcome', 'Readmission Rate', '30-day readmissions %', '', '-10%', '6 months', '', ''],
          ['Patient Engagement', 'Activation Rate', '% completing onboarding', '', '70%', '3 months', '', ''],
          ['Patient Engagement', 'DAU/MAU', 'Daily/Monthly active users', '', '>40%', '3 months', '', ''],
          ['Patient Engagement', 'Adherence Rate', 'Medication/task completion %', '', '>80%', '6 months', '', ''],
          ['Patient Satisfaction', 'NPS', 'Net Promoter Score', '', '>50', '6 months', '', ''],
          ['Patient Satisfaction', 'CSAT', 'Customer Satisfaction Score', '', '>4.5/5', '3 months', '', ''],
          ['Provider Efficiency', 'Time Saved per Visit', 'Minutes reduced documentation', '', '5 min', '3 months', '', ''],
          ['Provider Efficiency', 'Click Reduction', 'Fewer clicks per task', '', '-30%', '3 months', '', ''],
          ['Provider Satisfaction', 'Burnout Score', 'Validated burnout assessment', '', '-15%', '6 months', '', ''],
          ['Operational', 'Care Gap Closure', 'Preventive care completion %', '', '+20%', '6 months', '', ''],
          ['Operational', 'No-Show Rate', 'Missed appointment %', '', '-15%', '3 months', '', ''],
        ]
      }
    },
    {
      id: 'okrs',
      title: 'OKRs (Objectives & Key Results)',
      description: 'Quarterly objectives with measurable clinical and business key results',
      fieldType: 'table',
      required: true,
      helpText: 'Align team on patient outcomes and operational excellence',
      learnContentId: 'okrs',
      tableSchema: {
        columns: ['Objective', 'Key Result', 'Baseline', 'Target', 'Progress', 'Owner'],
        rows: [
          ['Improve patient outcomes for [condition]', 'Reduce [clinical metric] by X%', 'Baseline', 'Target', '', ''],
          ['Launch [Feature] successfully', 'Complete clinical pilot with N providers', '0', 'N', '', ''],
          ['Drive patient engagement', 'Achieve 70% activation rate within 30 days', '0%', '70%', '', ''],
          ['Maintain patient safety', 'Zero patient safety incidents throughout launch', '0', '0', '', ''],
        ]
      }
    },
    {
      id: 'solution-overview',
      title: 'Solution Overview',
      description: 'High-level solution architecture with clinical workflow integration',
      fieldType: 'markdown',
      required: true,
      helpText: `**Solution Summary:**
[2-3 paragraph description of what we're building and clinical context]

**Clinical Workflow Diagram:**
\`\`\`
[Patient] → [Encounter] → [Documentation] → [Decision Support] → [Order/Prescription] → [Follow-up]
    ↓           ↓              ↓                  ↓                    ↓                    ↓
[Registration] [Vitals]   [SOAP Note]      [Guidelines]        [EHR Integration]    [Care Plan]
\`\`\`

**System Components:**
| Component | Purpose | HIPAA Impact | Owner | SLA |
|-----------|---------|--------------|-------|-----|
| [Service A] | [What it does] | PHI/Non-PHI | [Team] | 99.9% |
| [Service B] | [What it does] | PHI/Non-PHI | [Team] | 99.9% |
| [EHR Integration] | [Epic/Cerner/etc.] | PHI | [Team] | Per contract |
| [External Partner] | [What they provide] | BAA Required | [Vendor] | Per contract |

**Key Clinical Decisions:**
| Decision | Option A | Option B | Chosen | Clinical Rationale |
|----------|----------|----------|--------|-------------------|
| [Clinical workflow] | [Pros/Cons] | [Pros/Cons] | [A/B] | [Patient safety/outcome] |
| [Alert strategy] | [Pros/Cons] | [Pros/Cons] | [A/B] | [Alert fatigue consideration] |

**Dependencies:**
- [ ] [Team/Service] - [What they need to deliver] - Due: [Date]
- [ ] [EHR Vendor] - [Integration requirements] - Due: [Date]
- [ ] [Clinical Advisory Board] - [Clinical validation] - Due: [Date]`,
      learnContentId: 'solution-design',
    },
    {
      id: 'user-stories',
      title: 'User Stories',
      description: 'Detailed user stories with clinical acceptance criteria',
      fieldType: 'table',
      required: true,
      helpText: 'Include clinical scenarios, edge cases, and patient safety considerations',
      learnContentId: 'user-stories',
      tableSchema: {
        columns: ['Story ID', 'User Story', 'Acceptance Criteria', 'Patient Safety Notes', 'Priority', 'Estimate'],
        rows: [
          ['US-001', 'As a [provider type], I want to [clinical action], so I can [patient outcome]', 'Given/When/Then format', '[Safety considerations]', 'P0', ''],
          ['US-002', 'As a provider, I want to view patient history', '1. Display problem list, medications, allergies 2. Highlight critical values 3. Show timeline view', 'Critical results must be prominent', 'P0', ''],
          ['US-003', 'As a patient, I want to message my care team', '1. Secure messaging 2. Triage routing 3. Response time SLA', 'Urgent symptoms trigger escalation', 'P0', ''],
        ]
      }
    },
    {
      id: 'functional-requirements',
      title: 'Functional Requirements',
      description: 'Detailed requirements with clinical workflows and safety checks',
      fieldType: 'table',
      required: true,
      helpText: 'Include all clinical decision points, safety checks, and escalation paths',
      learnContentId: 'requirements-writing',
      tableSchema: {
        columns: ['Req ID', 'Requirement Description', 'Priority', 'Patient Safety Impact', 'User Story Ref', 'Acceptance Criteria', 'Clinical Validation'],
        rows: [
          ['FR-001', 'System shall display critical allergies prominently on patient banner', 'P0', 'High', 'US-002', 'Red banner, always visible', 'Clinician review'],
          ['FR-002', 'System shall flag drug-drug interactions', 'P0', 'High', 'US-002', 'Alert severity based on interaction level', 'Pharmacist review'],
          ['FR-003', 'System shall route urgent patient messages to on-call provider', 'P0', 'High', 'US-003', 'Keyword detection, escalation within 1 hour', 'Clinical protocol'],
          ['FR-004', 'System shall require acknowledgment of critical results', 'P0', 'High', '', 'Read receipt, escalation if unacknowledged', 'Patient safety'],
          ['FR-005', 'System shall support proxy access for caregivers', 'P1', 'Medium', '', 'Granular permissions, patient consent', 'HIPAA compliant'],
        ]
      }
    },
    {
      id: 'non-functional-requirements',
      title: 'Non-Functional Requirements',
      description: 'Performance, reliability, accessibility, and compliance standards',
      fieldType: 'table',
      required: true,
      helpText: 'Define measurable standards - clinical workflows cannot tolerate downtime',
      learnContentId: 'non-functional-requirements',
      tableSchema: {
        columns: ['Category', 'Requirement', 'Metric', 'Target', 'Measurement Method', 'Clinical Impact'],
        rows: [
          ['Performance', 'Page load time', 'p50 latency', '<2 seconds', 'APM monitoring', 'Provider workflow'],
          ['Performance', 'Page load time', 'p99 latency', '<5 seconds', 'APM monitoring', 'Urgent care scenarios'],
          ['Reliability', 'System uptime', 'Availability', '99.9%', 'Uptime monitoring', 'Patient care continuity'],
          ['Reliability', 'Message delivery', 'Delivery rate', '>99.9%', 'Message tracking', 'Care team communication'],
          ['Accessibility', 'WCAG Compliance', 'WCAG 2.1 Level', 'AA', 'Accessibility audit', 'Patient access'],
          ['Security', 'PHI access logging', 'Coverage', '100%', 'Log audit', 'HIPAA compliance'],
          ['Compliance', 'Audit log retention', 'Retention period', '6 years', 'Compliance audit', 'HIPAA requirement'],
        ]
      }
    },
    {
      id: 'integrations',
      title: 'Healthcare Integrations',
      description: 'EHR, HIE, pharmacy, lab, and other healthcare system integrations',
      fieldType: 'table',
      required: true,
      helpText: 'Map all healthcare touchpoints including BAA requirements',
      learnContentId: 'dependency-management',
      tableSchema: {
        columns: ['Integration', 'System/Provider', 'Purpose', 'Standard/Protocol', 'BAA Required', 'Owner', 'Status'],
        rows: [
          ['EHR Integration', 'Epic/Cerner/Meditech', 'Patient data, orders', 'FHIR/HL7', 'Yes', '', ''],
          ['Health Information Exchange', 'CommonWell/Carequality', 'Records sharing', 'FHIR/HL7', 'Yes', '', ''],
          ['Pharmacy', 'Surescripts', 'e-Prescribing', 'NCPDP', 'Yes', '', ''],
          ['Lab Integration', 'Quest/LabCorp', 'Lab orders/results', 'HL7 ORU', 'Yes', '', ''],
          ['Imaging', 'PACS/VNA', 'Radiology images', 'DICOM', 'Yes', '', ''],
          ['Patient Portal', 'EHR Portal', 'Patient access', 'FHIR', 'Yes', '', ''],
          ['Remote Monitoring', 'Device Vendor', 'Vitals, RPM data', 'FHIR/Proprietary', 'Yes', '', ''],
          ['Claims/Clearinghouse', 'Change/Avia', 'Billing submission', 'X12 837', 'Yes', '', ''],
        ]
      }
    },
    {
      id: 'clinical-decision-support',
      title: 'Clinical Decision Support (CDS)',
      description: 'Clinical rules, alerts, and decision support logic',
      fieldType: 'markdown',
      required: false,
      helpText: `**Clinical Rules:**

| Rule ID | Trigger | Action | Evidence Level | Override Allowed |
|---------|---------|--------|-----------------|------------------|
| CDS-001 | Drug-allergy interaction | Hard stop alert | High | No |
| CDS-002 | Drug-drug interaction (severe) | Hard stop alert | High | No |
| CDS-003 | Drug-drug interaction (moderate) | Soft alert | Medium | Yes, with reason |
| CDS-004 | Preventive care gap | Reminder | High | Yes |
| CDS-005 | Abnormal lab value | Flag result | High | N/A |

**Alert Strategy:**
- [ ] Alert fatigue assessment completed
- [ ] Hard stops reserved for patient safety only
- [ ] Soft alerts with easy override
- [ ] Alert effectiveness tracking
- [ ] Regular alert optimization review

**Clinical Guidelines Referenced:**
| Guideline | Source | URL/Reference | Last Updated |
|-----------|--------|---------------|--------------|
| [Condition] Guidelines | [Professional Society] | [Link] | [Date] |`,
      learnContentId: 'solution-design',
    },
    {
      id: 'ux-requirements',
      title: 'UX/UI Requirements',
      description: 'Design specifications for clinical and patient interfaces',
      fieldType: 'table',
      required: true,
      helpText: 'Clinical UX must support rapid decision-making; patient UX must support health literacy',
      learnContentId: 'ux-specification',
      tableSchema: {
        columns: ['Screen/Component', 'User Type', 'State', 'Description', 'Behavior', 'Accessibility', 'Design Link'],
        rows: [
          ['Patient Banner', 'Provider', 'Default', 'Critical info always visible', 'Sticky header', 'High contrast', ''],
          ['Patient Banner', 'Provider', 'Alert', 'Critical allergy/drug alert', 'Red, prominent', 'Color + icon', ''],
          ['Medication List', 'Provider', 'Default', 'Active medications', 'Sort by status', 'Readable font', ''],
          ['Medication List', 'Provider', 'Interaction', 'Drug interaction detected', 'Highlight, alert level', 'Color + text', ''],
          ['Patient Dashboard', 'Patient', 'Default', 'Health summary, actions', 'Clear CTAs', 'WCAG AA', ''],
          ['Symptom Checker', 'Patient', 'Input', 'Guided symptom entry', 'Progressive disclosure', 'Plain language', ''],
          ['Symptom Checker', 'Patient', 'Triage', 'Urgency recommendation', 'Clear disposition', 'Emergency disclaimer', ''],
        ]
      }
    },
    {
      id: 'edge-cases',
      title: 'Edge Cases & Patient Safety Scenarios',
      description: 'Anticipate and handle clinical edge cases and failure scenarios',
      fieldType: 'table',
      required: true,
      helpText: 'Patient safety is paramount - consider all failure modes',
      learnContentId: 'edge-case-thinking',
      tableSchema: {
        columns: ['Scenario', 'Category', 'Patient Safety Impact', 'Likelihood', 'Handling', 'Escalation'],
        rows: [
          ['System downtime during patient visit', 'Infrastructure', 'High - care delayed', 'Low', 'Offline mode, paper backup', 'IT emergency'],
          ['Critical result not acknowledged', 'Clinical', 'High - missed diagnosis', 'Medium', 'Escalation chain, phone call', 'On-call provider'],
          ['Incorrect patient data displayed', 'Data Integrity', 'Critical - wrong care', 'Low', 'Patient verification, audit', 'Immediate fix + RCA'],
          ['Drug interaction alert overridden', 'Clinical', 'Medium - adverse event risk', 'Medium', 'Require reason, pharmacist review', 'Medication safety'],
          ['Patient sends urgent symptom message', 'Clinical', 'High - emergency risk', 'Medium', 'Triage algorithm, immediate routing', 'On-call provider'],
          ['Allergy data mismatch', 'Data Integrity', 'Critical - anaphylaxis risk', 'Low', 'Source verification, merge protocol', 'Patient safety review'],
          ['Duplicate patient records', 'Data Integrity', 'High - wrong care', 'Medium', 'MPI matching, manual review', 'HIM team'],
        ]
      }
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Patient safety, privacy, operational, and regulatory risks',
      fieldType: 'table',
      required: true,
      helpText: 'Patient safety risks are highest priority - HIPAA violations have severe penalties',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Risk ID', 'Risk Description', 'Category', 'Severity (1-5)', 'Likelihood (1-5)', 'Patient Safety Impact', 'Mitigation Strategy', 'Owner'],
        rows: [
          ['RISK-001', 'Wrong patient data displayed leading to incorrect care', 'Patient Safety', '5', '2', 'Critical', 'Patient verification, audit trail, double-check protocols', ''],
          ['RISK-002', 'PHI breach exposing patient data', 'Privacy', '5', '2', 'High', 'Encryption, access controls, monitoring, training', ''],
          ['RISK-003', 'Clinical decision support failure', 'Patient Safety', '5', '2', 'Critical', 'Clinical validation, fallback to standard care', ''],
          ['RISK-004', 'System downtime during critical care', 'Operational', '4', '3', 'High', 'Redundancy, downtime procedures, backup systems', ''],
          ['RISK-005', 'Medication dosing error', 'Patient Safety', '5', '2', 'Critical', 'Clinical validation, pharmacist review, dose ranges', ''],
          ['RISK-006', 'Regulatory penalty (HIPAA/FDA)', 'Compliance', '5', '2', 'Medium', 'Compliance review, legal sign-off, ongoing monitoring', ''],
          ['RISK-007', 'Alert fatigue causing missed critical alerts', 'Patient Safety', '4', '3', 'High', 'Alert optimization, tiered alerting', ''],
        ]
      }
    },
    {
      id: 'irb-requirements',
      title: 'IRB Requirements (If Research)',
      description: 'Institutional Review Board requirements for clinical research',
      fieldType: 'table',
      required: false,
      helpText: 'Complete if feature involves clinical research or data collection',
      learnContentId: 'risk-management',
      tableSchema: {
        columns: ['Requirement', 'Status', 'IRB Protocol #', 'Timeline', 'Notes'],
        rows: [
          ['IRB Approval', 'Pending/Approved/Exempt', '', '', 'Required before enrollment'],
          ['Informed Consent', 'Template created', '', '', 'Patient-facing document'],
          ['Data Use Agreement', 'Executed', '', '', 'If sharing data externally'],
          ['ClinicalTrials.gov Registration', 'Registered', '', '', 'If applicable'],
          ['DSMB (Data Safety Monitoring)', 'Established', '', '', 'For interventional studies'],
        ]
      }
    },
    {
      id: 'rollout-plan',
      title: 'Clinical Rollout Plan',
      description: 'Phased launch with clinical oversight and patient safety monitoring',
      fieldType: 'table',
      required: true,
      helpText: 'Start with pilot sites - patient safety requires careful validation',
      learnContentId: 'rollout-strategy',
      tableSchema: {
        columns: ['Phase', 'Site Type', 'Provider Count', 'Patient Count', 'Duration', 'Success Criteria', 'Go/No-Go Owner'],
        rows: [
          ['Internal', 'Our clinical team', '<10', 'Staff only', '2 weeks', 'No patient safety issues, workflow validated', 'Clinical Lead'],
          ['Pilot', '1-2 partner sites', '10-25', '50-100', '4 weeks', 'Positive clinical feedback, no adverse events', 'Clinical Lead'],
          ['Expanded', '5-10 sites', '50-100', '500-1000', '8 weeks', 'Metrics stable, adoption >60%', 'Product Lead'],
          ['GA', 'All eligible sites', 'All providers', 'All eligible patients', 'Ongoing', 'Clinical sign-off, IRB/FDA approval if required', 'Executive Sponsor'],
        ]
      }
    },
    {
      id: 'rollout-checklist',
      title: 'Clinical Rollout Readiness Checklist',
      description: 'Pre-launch verification for clinical deployment',
      fieldType: 'markdown',
      required: true,
      helpText: `**Clinical Readiness:**
- [ ] Clinical workflow validated with end users
- [ ] Clinical decision support reviewed by subject matter experts
- [ ] Patient safety scenarios tested
- [ ] Clinical champions identified at each site
- [ ] Super user training completed
- [ ] Clinical support coverage arranged

**Regulatory Readiness:**
- [ ] HIPAA compliance review sign-off
- [ ] Security review sign-off
- [ ] IRB approval (if research)
- [ ] FDA clearance (if medical device)
- [ ] Legal review sign-off
- [ ] Business Associate Agreements executed

**Technical Readiness:**
- [ ] EHR integration tested end-to-end
- [ ] Downtime procedures documented
- [ ] Support escalation procedures defined
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery tested

**Training Readiness:**
- [ ] Provider training materials created
- [ ] Staff training completed
- [ ] Patient education materials available
- [ ] Quick reference guides distributed
- [ ] Video tutorials available`,
      learnContentId: 'rollout-strategy',
    },
    {
      id: 'gtm-alignment',
      title: 'Go-to-Market & Clinical Enablement',
      description: 'Clinical champion network, training, and communication plan',
      fieldType: 'table',
      required: true,
      helpText: 'Healthcare requires clinical champions and peer-to-peer education',
      learnContentId: 'gtm-basics',
      tableSchema: {
        columns: ['Activity', 'Audience', 'Channel', 'Owner', 'Timeline', 'Status'],
        rows: [
          ['Clinical Champion Training', 'Key opinion leaders', 'In-person/virtual', 'Clinical Lead', '', ''],
          ['Grand Rounds Presentation', 'Medical staff', 'Educational session', 'Clinical Lead', '', ''],
          ['Provider Training Sessions', 'End user providers', 'CME-accredited training', 'Training', '', ''],
          ['Staff Training', 'Nurses, MAs, support', 'Role-based training', 'Training', '', ''],
          ['Patient Education', 'Patients', 'Portal, handouts, videos', 'Marketing', '', ''],
          ['Executive Briefing', 'C-suite, department chairs', 'Executive summary', 'Executive Sponsor', '', ''],
        ]
      }
    },
    {
      id: 'timeline-resourcing',
      title: 'Timeline & Resourcing',
      description: 'Project milestones including clinical and regulatory reviews',
      fieldType: 'table',
      required: true,
      helpText: 'Include IRB and regulatory timelines - these cannot be rushed',
      learnContentId: 'estimation',
      tableSchema: {
        columns: ['Milestone', 'Target Date', 'Duration', 'Dependencies', 'Owner', 'Status', 'Notes'],
        rows: [
          ['PRD Approved', '', '1 week', 'None', 'Product', '', ''],
          ['Clinical Review Board', '', '2 weeks', 'PRD Approved', 'Clinical Lead', '', 'Required for patient safety'],
          ['Design Complete', '', '3 weeks', 'Clinical review', 'Design', '', ''],
          ['Engineering Start', '', 'Day 1', 'Design complete', 'Engineering', '', ''],
          ['HIPAA Assessment', '', '2 weeks', 'Feature complete', 'Compliance', '', ''],
          ['Security Review', '', '1 week', 'Feature complete', 'Security', '', ''],
          ['IRB Approval', '', '4-8 weeks', 'Protocol submission', 'Research', '', 'If research'],
          ['FDA Submission', '', '90 days', '510(k) complete', 'Regulatory', '', 'If Class II device'],
          ['Clinical Pilot', '', '4 weeks', 'All approvals', 'Clinical Lead', '', ''],
          ['GA Launch', '', '1 week', 'All sign-offs', 'Product', '', ''],
        ]
      }
    },
    {
      id: 'team-structure',
      title: 'Team Structure & Roles',
      description: 'Clinical, technical, and operational team members',
      fieldType: 'table',
      required: true,
      helpText: 'Clear clinical ownership is essential',
      learnContentId: 'stakeholder-management',
      tableSchema: {
        columns: ['Role', 'Name', 'Responsibility', 'Clinical/Technical', 'Time Allocation'],
        rows: [
          ['Product Lead', '', 'Overall product strategy', 'Both', '50%'],
          ['Clinical/Medical Lead', '', 'Clinical validation, safety', 'Clinical', '50%'],
          ['Engineering Lead', '', 'Technical architecture', 'Technical', '75%'],
          ['Design Lead', '', 'Clinical UX design', 'Both', '50%'],
          ['Compliance/Privacy', '', 'HIPAA compliance', 'Clinical', '25%'],
          ['Security Lead', '', 'Security architecture', 'Technical', '25%'],
          ['Clinical Champions', '', 'Site adoption, feedback', 'Clinical', '10%'],
          ['Quality Assurance', '', 'Testing, validation', 'Both', '50%'],
        ]
      }
    },
    {
      id: 'post-launch-plan',
      title: 'Post-Launch Plan',
      description: 'Patient safety monitoring, clinical outcomes tracking, and iteration',
      fieldType: 'table',
      required: true,
      helpText: 'Patient safety monitoring is paramount - adverse events require immediate attention',
      learnContentId: 'post-launch',
      tableSchema: {
        columns: ['Activity', 'Timeline', 'Owner', 'Alert Threshold', 'Response', 'Notes'],
        rows: [
          ['Patient safety monitoring', 'Real-time', 'Clinical Lead', 'Any adverse event', 'Immediate review, RCA', 'Highest priority'],
          ['System uptime monitoring', 'Real-time', 'Engineering', 'Downtime >5 min', 'Escalate to on-call', 'Clinical impact'],
          ['PHI access audit', 'Weekly', 'Compliance', 'Unauthorized access', 'Investigate, sanction if needed', 'HIPAA requirement'],
          ['Clinical outcomes review', 'Monthly', 'Clinical Lead', 'Outcome degradation', 'Clinical review, iterate', 'Quality measure'],
          ['Day 1 check', 'Day 1', 'Product', 'No patient safety issues', 'Go/No-Go decision', 'All teams'],
          ['Week 1 review', 'Week 1', 'Clinical Lead', 'No adverse events', 'Continue launch', 'Clinical team'],
          ['Month 1 outcomes', 'Month 1', 'Product', 'Hit clinical targets', 'Continue/iterate', 'Executive review'],
          ['Quarterly safety review', 'Quarterly', 'Clinical Lead', 'Safety trends', 'Safety committee review', 'Ongoing'],
        ]
      }
    },
    {
      id: 'adverse-event-reporting',
      title: 'Adverse Event Reporting',
      description: 'Process for tracking and reporting adverse events and near misses',
      fieldType: 'markdown',
      required: true,
      helpText: `**Adverse Event Classification:**

| Severity | Definition | Reporting Timeline | Example |
|----------|------------|-------------------|---------|
| Critical | Patient harm or death | Immediate (within 24 hours) | Wrong medication dose |
| Serious | Potential for harm | Within 48 hours | Near-miss medication error |
| Moderate | Process issue, no harm | Within 1 week | Delayed result notification |
| Minor | Minor inconvenience | Within 2 weeks | UI confusion |

**Reporting Process:**
1. Event detected (automated or manual report)
2. Triage by Clinical Lead within 4 hours
3. Investigation initiated
4. Root cause analysis completed
5. Corrective action implemented
6. FDA MDR filed (if reportable device event)

**MDR (Medical Device Reporting) Requirements:**
- [ ] Death: Report within 10 calendar days
- [ ] Serious injury: Report within 30 calendar days
- [ ] Malfunction: Report per FDA guidelines

**Contact Information:**
- Clinical Lead: [Name, Phone, Email]
- Quality Assurance: [Name, Phone, Email]
- Regulatory Affairs: [Name, Phone, Email]`,
      learnContentId: 'post-launch',
    },
    {
      id: 'appendices',
      title: 'Appendices',
      description: 'Supporting clinical documentation and references',
      fieldType: 'markdown',
      required: false,
      helpText: `**Appendix A: Clinical Glossary**
| Term | Definition |
|------|------------|
| [Medical term] | [Definition] |

**Appendix B: Clinical Research**
- Clinical study summary: [Link]
- Literature review: [Link]
- Competitive clinical analysis: [Link]

**Appendix C: Clinical Workflows**
- Current state workflow: [Link]
- Future state workflow: [Link]
- EHR integration diagram: [Link]

**Appendix D: Regulatory Documentation**
- HIPAA Privacy Impact Assessment: [Link]
- FDA submission (if applicable): [Link]
- IRB protocol (if research): [Link]

**Appendix E: Training Materials**
- Provider training deck: [Link]
- Staff training guide: [Link]
- Patient education materials: [Link]

**Appendix F: Clinical Guidelines Referenced**
| Guideline | Source | URL |
|-----------|--------|-----|
| [Guideline] | [Organization] | [Link] |`,
      learnContentId: 'documentation',
    },
  ],
};

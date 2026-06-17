export const CONTROLS = [
  {
    id: 'NIST-GOV-1.1',
    framework: 'NIST_AI_RMF',
    controlRef: 'GOVERN 1.1',
    description: 'Policies and procedures are in place to ensure AI systems do not discriminate against individuals based on protected characteristics including age, race, gender, disability, religion, national origin, or family status.'
  },
  {
    id: 'NIST-MAP-1.1',
    framework: 'NIST_AI_RMF',
    controlRef: 'MAP 1.1',
    description: 'Context is established for assessing AI risk. AI systems used in hiring and employment decisions are identified and their potential for discriminatory impact is documented.'
  },
  {
    id: 'NIST-MEA-2.2',
    framework: 'NIST_AI_RMF',
    controlRef: 'MEASURE 2.2',
    description: 'AI system outputs are evaluated for bias and fairness. Outputs referencing protected characteristics such as age, pregnancy, maternity leave, or family status in employment contexts are flagged for review. This includes coded or indirect phrasing that proxies for protected characteristics, such as preferring "energetic recent graduates," candidates who are "fully available" or have "no family obligations," or describing someone as a "digital native" — language that signals age or family-status discrimination without naming it explicitly.'
  },
  {
    id: 'NIST-MGT-2.2',
    framework: 'NIST_AI_RMF',
    controlRef: 'MANAGE 2.2',
    description: 'Mechanisms are in place to detect and remediate AI outputs that reference protected characteristics or make inferences about candidates based on age, gender, race, disability, or family obligations.'
  },
  {
    id: 'NIST-MGT-4.1',
    framework: 'NIST_AI_RMF',
    controlRef: 'MANAGE 4.1',
    description: 'Post-deployment monitoring of AI systems in employment contexts detects discriminatory patterns including references to pregnancy, maternity leave, parental status, or age-related inferences.'
  },
  {
    id: 'ISO-42001-6.1',
    framework: 'ISO_42001',
    controlRef: 'ISO 42001 § 6.1',
    description: 'The organization identifies and assesses risks of AI systems causing harm through biased outputs, including outputs that reference or infer protected characteristics in ways that could influence employment decisions unfairly.'
  },
  {
    id: 'ISO-42001-8.4',
    framework: 'ISO_42001',
    controlRef: 'ISO 42001 § 8.4',
    description: 'AI system outputs in human resources applications are monitored and reviewed to ensure they do not contain references to protected characteristics or unsupported inferences about candidate availability based on personal circumstances.'
  },
  {
    id: 'FAIRNESS-1',
    framework: 'FAIRNESS',
    controlRef: 'Anti-Discrimination § 1',
    description: 'AI hiring tools must not produce outputs that reference, infer, or score candidates based on age, race, gender, pregnancy, maternity or paternity leave, family status, disability, religion, or national origin. This prohibition extends to coded language used as a proxy for these characteristics, including phrases like "energetic young team," "recent graduates only," "without family obligations," "fully available outside work hours," or "culture fit for a fast-paced startup" when used to filter or score candidates.'
  },
  {
    id: 'FAIRNESS-2',
    framework: 'FAIRNESS',
    controlRef: 'Anti-Discrimination § 2',
    description: 'Employment AI systems must not make predictions about candidate availability, reliability, or performance based on protected characteristics including family obligations, pregnancy status, or parental leave history. This includes indirect framing such as questioning whether a candidate is "fully committed," "available for travel and overtime," or "without outside obligations" when used as a stand-in for family or caregiving status.'
  },
  {
    id: 'FAIRNESS-3',
    framework: 'FAIRNESS',
    controlRef: 'Anti-Discrimination § 3',
    description: 'AI-generated candidate assessments must be based solely on job-relevant qualifications. Any output connecting personal circumstances such as maternity leave or age to predicted job performance constitutes a discriminatory inference.'
  },
  {
    id: 'NIST-MEA-1.1',
    framework: 'NIST_AI_RMF',
    controlRef: 'MEASURE 1.1',
    description: 'Approaches for measuring AI risks are identified and assessed. Metrics for detecting protected characteristic references in AI hiring outputs are defined and applied consistently.'
  },
  {
    id: 'ISO-42001-9.1',
    framework: 'ISO_42001',
    controlRef: 'ISO 42001 § 9.1',
    description: 'The organization monitors and measures AI system performance against fairness criteria. Audit logs capture all AI hiring outputs and associated violation flags for compliance reporting.'
  }
]
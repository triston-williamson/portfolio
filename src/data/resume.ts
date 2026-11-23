export const profile = {
  name: 'Triston Williamson',
  title: 'AI Automation Engineer · Data Science & Finance',
  blurb:
    'I build AI agents, data pipelines and automation for banking and finance teams, with the controls and documentation regulated environments need.',
  email: 'trwil798@gmail.com',
  linkedin: 'https://www.linkedin.com/in/triston-williamson-b426231b7/',
};

export const stats = [
  { value: '6,000+', label: 'hours of manual work projected saved' },
  { value: '$5B+', label: 'daily funding positions supported' },
  { value: '52+', label: 'automation projects overseen' },
  { value: '99.9%', label: 'uptime on a production liquidity dashboard' },
];

export const skills: Record<string, string[]> = {
  'AI & Machine Learning': ['LLMs', 'RAG', 'AI Agents', 'Claude API', 'LangChain', 'OpenAI', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'OpenCV', 'NLTK'],
  'Data Engineering': ['Kafka', 'dbt', 'Spark', 'Databricks', 'Snowflake', 'PostgreSQL', 'BigQuery', 'Hadoop'],
  'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'GitHub Actions', 'Azure DevOps', 'CI/CD'],
  'Backend': ['Python', 'FastAPI', 'Flask', 'Pydantic', 'REST APIs', 'SQL', 'R', 'VBA'],
  'Analytics & BI': ['Tableau', 'Power BI', 'Alteryx', 'Xceptor', 'Plotly Dash','A/B Testing', 'Excel'],
  'Finance & Regulatory': ['Bloomberg', 'TRACE', 'Basel', 'FRTB', 'CRR', 'GAAP', 'Liquidity', 'Trade Control'],
};

export const experience = [
  {
    company: 'Wells Fargo', role: 'AI Automation Engineer (Contract)', dates: 'Jun 2026 – Present',
    points: [
      'Oversee 52+ data engineering and automation projects for Global Investment Banking, projected to save 6,000+ hours.',
      'Built an agentic RAG pipeline for treasury operations with pre-LLM validation, cutting analyst data-prep time by 60%.',
      'Deployed 10+ Flask/FastAPI services handling 10K+ API calls per month.',
    ],
  },
  {
    company: 'Bank of America', role: 'Senior Associate, Trade & Liquidity Business Analyst (Contract)', dates: 'Feb 2026 – Jun 2026',
    points: [
      'Engineered backend services and deployment pipelines for a production intraday liquidity dashboard supporting $5B+ daily.',
      'Cut reporting latency from hours to under 10 minutes with time-sensitive ETL pipelines.',
    ],
  },
  {
    company: 'Sonic Automotive', role: 'Senior Associate, Data Scientist & Business Analyst', dates: 'Jan 2025 – Feb 2026',
    points: [
      'Built 23 Kafka, dbt, Snowflake and Spark pipelines for transaction risk and control testing.',
      'Engineered a LangChain / OpenAI Agents SDK reporting agent, eliminating 60+ hours of manual work per week.',
    ],
  },
  {
    company: 'SCOR', role: 'Senior Data Scientist', dates: 'Nov 2023 – Jan 2025',
    points: [
      'Standardized CI/CD across 10+ automation projects, halving deployment time.',
      'Built dbt/Oracle pipelines over 500K+ monthly transactions, flagging about $2M in risk exposure.',
    ],
  },
  {
    company: 'Bank of America', role: 'Trade Control Analyst (Contract)', dates: 'Jul 2023 – Nov 2023',
    points: ['Ran trade confirmation across FX, derivatives and structured products, resolving 98%+ of breaks same-day.'],
  },
  {
    company: 'Cardinal Financial', role: 'Pricing Analyst', dates: 'Dec 2021 – Jul 2023',
    points: ['Built an internal pricing engine that cut pricing turnaround by 40%.'],
  },
];

export const education = [
  { school: 'UNC Charlotte', degree: 'M.S., Data Science and Business Analytics', date: '2024' },
  { school: 'UNC Charlotte', degree: 'B.S., Finance (Risk Management & Insurance), Minor in MIS', date: '2022' },
];
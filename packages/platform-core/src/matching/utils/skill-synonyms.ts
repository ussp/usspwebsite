// ── Skill Synonym Dictionary ─────────────────────────────────────────
// Maps raw skill strings (lowercase) to a canonical form.
// When adding new entries, always use lowercase keys.

const SYNONYM_MAP: Record<string, string> = {
  // JavaScript ecosystem
  js: "javascript",
  javascript: "javascript",
  ecmascript: "javascript",
  es6: "javascript",
  es2015: "javascript",
  ts: "typescript",
  typescript: "typescript",
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "react native": "react-native",
  reactnative: "react-native",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vue",
  vuejs: "vue",
  vue: "vue",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  angular: "angular",
  angularjs: "angular",
  "angular.js": "angular",
  svelte: "svelte",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  express: "express",
  "express.js": "express",
  expressjs: "express",
  deno: "deno",
  bun: "bun",
  jquery: "jquery",

  // Python
  python: "python",
  python3: "python",
  py: "python",
  django: "django",
  flask: "flask",
  fastapi: "fastapi",
  pandas: "pandas",
  numpy: "numpy",
  scipy: "scipy",
  pytorch: "pytorch",
  tensorflow: "tensorflow",
  tf: "tensorflow",
  keras: "keras",
  scikit: "scikit-learn",
  "scikit-learn": "scikit-learn",
  sklearn: "scikit-learn",

  // Java ecosystem
  java: "java",
  "spring boot": "spring-boot",
  springboot: "spring-boot",
  spring: "spring",
  "spring framework": "spring",
  hibernate: "hibernate",
  maven: "maven",
  gradle: "gradle",
  kotlin: "kotlin",
  scala: "scala",

  // .NET / C#
  ".net": "dotnet",
  dotnet: "dotnet",
  ".net core": "dotnet-core",
  "dotnet core": "dotnet-core",
  ".net framework": "dotnet-framework",
  "c#": "csharp",
  csharp: "csharp",
  "c sharp": "csharp",
  "asp.net": "aspnet",
  aspnet: "aspnet",
  "asp.net core": "aspnet-core",
  blazor: "blazor",

  // C / C++
  c: "c",
  "c++": "cpp",
  cpp: "cpp",
  "objective-c": "objective-c",
  objc: "objective-c",

  // Go / Rust
  go: "go",
  golang: "go",
  rust: "rust",
  "rust lang": "rust",

  // Ruby / PHP
  ruby: "ruby",
  "ruby on rails": "rails",
  rails: "rails",
  ror: "rails",
  php: "php",
  laravel: "laravel",
  symfony: "symfony",
  wordpress: "wordpress",
  wp: "wordpress",

  // Databases
  sql: "sql",
  mysql: "mysql",
  postgresql: "postgresql",
  postgres: "postgresql",
  psql: "postgresql",
  sqlite: "sqlite",
  "ms sql": "mssql",
  mssql: "mssql",
  "sql server": "mssql",
  "microsoft sql server": "mssql",
  oracle: "oracle-db",
  "oracle db": "oracle-db",
  plsql: "plsql",
  "pl/sql": "plsql",
  mongodb: "mongodb",
  mongo: "mongodb",
  redis: "redis",
  cassandra: "cassandra",
  dynamodb: "dynamodb",
  couchdb: "couchdb",
  elasticsearch: "elasticsearch",
  elastic: "elasticsearch",
  neo4j: "neo4j",
  mariadb: "mariadb",
  cockroachdb: "cockroachdb",
  supabase: "supabase",
  firebase: "firebase",

  // Cloud providers
  aws: "aws",
  "amazon web services": "aws",
  "amazon aws": "aws",
  azure: "azure",
  "microsoft azure": "azure",
  "ms azure": "azure",
  gcp: "gcp",
  "google cloud": "gcp",
  "google cloud platform": "gcp",

  // Cloud services
  s3: "aws-s3",
  "aws s3": "aws-s3",
  ec2: "aws-ec2",
  "aws ec2": "aws-ec2",
  lambda: "aws-lambda",
  "aws lambda": "aws-lambda",
  cloudfront: "aws-cloudfront",
  rds: "aws-rds",
  ecs: "aws-ecs",
  eks: "aws-eks",
  fargate: "aws-fargate",
  "azure devops": "azure-devops",
  "azure functions": "azure-functions",

  // DevOps / Infrastructure
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  terraform: "terraform",
  ansible: "ansible",
  puppet: "puppet",
  chef: "chef",
  vagrant: "vagrant",
  helm: "helm",
  istio: "istio",
  "ci/cd": "cicd",
  cicd: "cicd",
  jenkins: "jenkins",
  "github actions": "github-actions",
  "gitlab ci": "gitlab-ci",
  "circle ci": "circleci",
  circleci: "circleci",
  "travis ci": "travis-ci",
  "argo cd": "argocd",
  argocd: "argocd",
  nginx: "nginx",
  apache: "apache",
  linux: "linux",
  ubuntu: "linux",
  centos: "linux",
  rhel: "linux",
  unix: "unix",
  bash: "bash",
  "shell scripting": "bash",
  powershell: "powershell",

  // Version control
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  svn: "svn",
  subversion: "svn",

  // Testing
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  cypress: "cypress",
  playwright: "playwright",
  selenium: "selenium",
  junit: "junit",
  pytest: "pytest",
  rspec: "rspec",
  vitest: "vitest",
  "testing library": "testing-library",
  "react testing library": "testing-library",

  // Data & ML
  "machine learning": "machine-learning",
  ml: "machine-learning",
  "deep learning": "deep-learning",
  dl: "deep-learning",
  ai: "ai",
  "artificial intelligence": "ai",
  nlp: "nlp",
  "natural language processing": "nlp",
  "computer vision": "computer-vision",
  cv: "computer-vision",
  "data science": "data-science",
  "data engineering": "data-engineering",
  "data analysis": "data-analysis",
  "data analytics": "data-analysis",
  "big data": "big-data",
  hadoop: "hadoop",
  spark: "spark",
  "apache spark": "spark",
  kafka: "kafka",
  "apache kafka": "kafka",
  airflow: "airflow",
  "apache airflow": "airflow",
  tableau: "tableau",
  "power bi": "power-bi",
  powerbi: "power-bi",
  looker: "looker",
  etl: "etl",
  dbt: "dbt",
  snowflake: "snowflake",
  databricks: "databricks",
  redshift: "redshift",
  bigquery: "bigquery",

  // API / Protocols
  rest: "rest",
  "rest api": "rest",
  restful: "rest",
  graphql: "graphql",
  grpc: "grpc",
  soap: "soap",
  websocket: "websocket",
  websockets: "websocket",

  // Mobile
  ios: "ios",
  android: "android",
  swift: "swift",
  "objective c": "objective-c",
  flutter: "flutter",
  dart: "dart",
  "react native": "react-native",
  xamarin: "xamarin",

  // Blockchain
  blockchain: "blockchain",
  solidity: "solidity",
  ethereum: "ethereum",
  "web3": "web3",
  "web3.js": "web3",
  solana: "solana",
  "smart contracts": "smart-contracts",

  // Design / Frontend tools
  html: "html",
  html5: "html",
  css: "css",
  css3: "css",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  "tailwind css": "tailwindcss",
  bootstrap: "bootstrap",
  "material ui": "material-ui",
  mui: "material-ui",
  figma: "figma",
  sketch: "sketch",
  "adobe xd": "adobe-xd",
  webpack: "webpack",
  vite: "vite",
  rollup: "rollup",
  esbuild: "esbuild",
  storybook: "storybook",

  // Security
  oauth: "oauth",
  oauth2: "oauth",
  jwt: "jwt",
  saml: "saml",
  sso: "sso",
  "single sign-on": "sso",
  cybersecurity: "cybersecurity",
  "information security": "infosec",
  infosec: "infosec",
  penetration: "penetration-testing",
  "pen testing": "penetration-testing",
  "penetration testing": "penetration-testing",

  // Methodologies
  agile: "agile",
  scrum: "scrum",
  kanban: "kanban",
  "safe agile": "safe",
  safe: "safe",
  devops: "devops",
  sre: "sre",
  "site reliability": "sre",
  microservices: "microservices",
  "micro services": "microservices",
  serverless: "serverless",
  "event driven": "event-driven",
  "event-driven": "event-driven",
  soa: "soa",
  "service oriented": "soa",

  // Project management / tools
  jira: "jira",
  confluence: "confluence",
  trello: "trello",
  asana: "asana",
  "project management": "project-management",
  pmp: "pmp",

  // Messaging / Queues
  rabbitmq: "rabbitmq",
  "rabbit mq": "rabbitmq",
  activemq: "activemq",
  sqs: "aws-sqs",
  "aws sqs": "aws-sqs",
  sns: "aws-sns",
  "aws sns": "aws-sns",

  // Monitoring
  prometheus: "prometheus",
  grafana: "grafana",
  datadog: "datadog",
  "new relic": "new-relic",
  splunk: "splunk",
  elk: "elk",
  kibana: "kibana",
  logstash: "logstash",
};

/**
 * Normalize a raw skill string to its canonical form.
 * Returns the canonical form if a mapping exists, otherwise returns a
 * cleaned-up lowercase version of the input.
 */
export function normalizeSkill(raw: string): string {
  const cleaned = raw.trim().toLowerCase();
  if (cleaned.length === 0) return cleaned;

  // Direct lookup
  if (SYNONYM_MAP[cleaned] !== undefined) {
    return SYNONYM_MAP[cleaned];
  }

  // Try removing trailing/leading dots and common punctuation
  const stripped = cleaned
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (SYNONYM_MAP[stripped] !== undefined) {
    return SYNONYM_MAP[stripped];
  }

  // Fallback: return cleaned version with spaces replaced by hyphens
  return stripped.replace(/\s+/g, "-");
}

/**
 * Check whether two skill strings refer to the same canonical skill.
 */
export function areSkillsSimilar(a: string, b: string): boolean {
  return normalizeSkill(a) === normalizeSkill(b);
}

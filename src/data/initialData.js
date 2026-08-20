export const INITIAL_USERS = [
  {
    id: 'usr_1',
    name: 'Alex Vance',
    email: 'alex@freewheel.io',
    role: 'admin', // Agency Lead / Architect
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Architect & Agency Founder'
  },
  {
    id: 'usr_2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@freewheel.io',
    role: 'dev', // Developer / Team Member
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Fullstack Engineer'
  },
  {
    id: 'usr_3',
    name: 'Apex Corp',
    email: 'contact@apexcorp.com',
    role: 'client', // Client User
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    company: 'Apex Corporation',
    title: 'VP of Product'
  }
];

export const INITIAL_SHOWCASE = [
  {
    id: 'show_1',
    title: 'FinTech Mobile Banking SuperApp',
    client: 'Apex Corporation',
    category: 'Mobile & Cloud Architecture',
    year: '2025',
    budget: '$120,000',
    duration: '14 Weeks',
    summary: 'Built a high-frequency banking application handling over 40,000 active daily transactions with instant micro-investing, biometric authentication, and multi-currency ledgers.',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Transaction Latency', value: '< 80ms' },
      { label: 'User Adoption Rate', value: '+310%' },
      { label: 'Security Score', value: '99.9%' }
    ],
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'AWS KMS'],
    testimonial: {
      quote: "Freewheel delivered our core financial app 2 weeks ahead of schedule. The client portal transparency and real-time task board kept our stakeholders aligned every single day.",
      author: "Marcus Thorne, CTO at Apex Corp"
    },
    deliverables: [
      'Zero-Trust Security & Biometric Encryption',
      'Real-time WebSocket Transaction Stream',
      'Automated PCI-DSS Compliance Ledger'
    ]
  },
  {
    id: 'show_2',
    title: 'AI Automated Supply Chain Operations',
    client: 'LogiGlobal Freight Systems',
    category: 'AI & Enterprise Automation',
    year: '2025',
    budget: '$85,000',
    duration: '8 Weeks',
    summary: 'Engineered an AI-powered fleet dispatch algorithm reducing route fuel waste by 24% and providing real-time telemetry analytics to 500+ distribution hubs worldwide.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Fuel Cost Savings', value: '$450K/yr' },
      { label: 'Route Optimization Speed', value: '12x Faster' },
      { label: 'Dispatch Errors', value: '-94%' }
    ],
    techStack: ['Python', 'FastAPI', 'PyTorch', 'React', 'Docker'],
    testimonial: {
      quote: "The solution transformed our logistics throughput. The Freewheel team showed master-level engineering and complete transparency from contract to launch.",
      author: "Elena Rostova, VP Operations at LogiGlobal"
    },
    deliverables: [
      'Predictive Traffic & Weather AI Engine',
      'Driver Mobile Companion Portal',
      'Executive Analytics Telemetry Dashboard'
    ]
  },
  {
    id: 'show_3',
    title: 'NextGen SaaS Analytics Engine',
    client: 'Vanguard Metrics Inc.',
    category: 'Full-Stack Web App',
    year: '2024',
    budget: '$65,000',
    duration: '6 Weeks',
    summary: 'Developed a real-time event analytics dashboard processing over 10M daily events with interactive funnel visualizers and custom cohort reports.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Events / Sec', value: '15,000+' },
      { label: 'Query Response', value: '45ms' },
      { label: 'MRR Growth Impact', value: '+45%' }
    ],
    techStack: ['Next.js', 'ClickHouse', 'TailwindCSS', 'TypeScript', 'GraphQL'],
    testimonial: {
      quote: "Freewheel\'s billing precision and invoice breakdown made tracking our software development budget effortless.",
      author: "David Vance, CEO Vanguard Metrics"
    },
    deliverables: [
      'Custom ClickHouse Columnar Data Store',
      'Real-time Cohort Retention Matrix',
      'Exportable Executive PDF Reports'
    ]
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    name: 'E-Commerce Mobile App',
    clientId: 'usr_3',
    clientName: 'Apex Corporation',
    description: 'Cross-platform mobile commerce experience with native Apple/Google Pay, wishlist sync, and AI product recommendations.',
    status: 'In Progress', // Planning, In Progress, Review, Completed
    budget: 45000,
    hourlyRate: 125,
    startDate: '2026-07-01',
    deadline: '2026-09-30',
    completionPercentage: 65,
    color: 'from-indigo-500 to-purple-600',
    tags: ['React Native', 'Node.js', 'Stripe']
  },
  {
    id: 'proj_2',
    name: 'Cloud Infrastructure Migration',
    clientId: 'usr_3',
    clientName: 'Apex Corporation',
    description: 'Migrating legacy monolith servers to containerized Kubernetes clusters on AWS with zero-downtime CI/CD pipelines.',
    status: 'In Progress',
    budget: 30000,
    hourlyRate: 150,
    startDate: '2026-08-01',
    deadline: '2026-10-15',
    completionPercentage: 40,
    color: 'from-cyan-500 to-blue-600',
    tags: ['Kubernetes', 'AWS', 'Terraform']
  },
  {
    id: 'proj_3',
    name: 'Brand Identity & Web Redesign',
    clientId: 'usr_3',
    clientName: 'Apex Corporation',
    description: 'Complete visual identity overhaul, design system creation, and high-performance marketing site deployment.',
    status: 'Completed',
    budget: 18000,
    hourlyRate: 110,
    startDate: '2026-05-15',
    deadline: '2026-07-31',
    completionPercentage: 100,
    color: 'from-emerald-500 to-teal-600',
    tags: ['Figma', 'Next.js', 'TailwindCSS']
  }
];

export const INITIAL_TASKS = [
  {
    id: 'tsk_101',
    projectId: 'proj_1',
    title: 'Integrate Stripe SDK for Apple Pay & Google Pay',
    description: 'Implement secure checkout session tokens and handle webhook callbacks for payment confirmation.',
    status: 'In Progress', // Backlog, To Do, In Progress, In Review, Done
    priority: 'High', // Low, Medium, High, Urgent
    assigneeId: 'usr_2',
    assigneeName: 'Sarah Jenkins',
    estimatedHours: 16,
    loggedHours: 10.5,
    dueDate: '2026-08-25'
  },
  {
    id: 'tsk_102',
    projectId: 'proj_1',
    title: 'Product Catalog Filtering & Search Optimization',
    description: 'Add fuzzy client-side filtering and Redis cached backend search endpoints.',
    status: 'In Review',
    priority: 'Medium',
    assigneeId: 'usr_1',
    assigneeName: 'Alex Vance',
    estimatedHours: 12,
    loggedHours: 12,
    dueDate: '2026-08-22'
  },
  {
    id: 'tsk_103',
    projectId: 'proj_1',
    title: 'User Push Notifications for Order Status',
    description: 'Configure Firebase Cloud Messaging (FCM) handlers for background delivery.',
    status: 'To Do',
    priority: 'Medium',
    assigneeId: 'usr_2',
    assigneeName: 'Sarah Jenkins',
    estimatedHours: 8,
    loggedHours: 0,
    dueDate: '2026-08-30'
  },
  {
    id: 'tsk_201',
    projectId: 'proj_2',
    title: 'Setup EKS Kubernetes Cluster with Helm Charts',
    description: 'Deploy auto-scaling nodes in dual-availability zones with VPC peering.',
    status: 'In Progress',
    priority: 'Urgent',
    assigneeId: 'usr_1',
    assigneeName: 'Alex Vance',
    estimatedHours: 24,
    loggedHours: 14.0,
    dueDate: '2026-08-28'
  },
  {
    id: 'tsk_202',
    projectId: 'proj_2',
    title: 'Configure PostgreSQL Database Replication',
    description: 'Set up read-replica failovers and automated snapshot strategy on AWS RDS.',
    status: 'Backlog',
    priority: 'High',
    assigneeId: 'usr_2',
    assigneeName: 'Sarah Jenkins',
    estimatedHours: 16,
    loggedHours: 0,
    dueDate: '2026-09-05'
  },
  {
    id: 'tsk_301',
    projectId: 'proj_3',
    title: 'Figma UI Component Design System Sign-off',
    description: 'Finalize design tokens, color typography scales, and dark theme states.',
    status: 'Done',
    priority: 'Medium',
    assigneeId: 'usr_1',
    assigneeName: 'Alex Vance',
    estimatedHours: 30,
    loggedHours: 28.5,
    dueDate: '2026-07-20'
  }
];

export const INITIAL_TIME_LOGS = [
  {
    id: 'log_1',
    projectId: 'proj_1',
    projectName: 'E-Commerce Mobile App',
    taskId: 'tsk_101',
    taskTitle: 'Integrate Stripe SDK for Apple Pay & Google Pay',
    userId: 'usr_2',
    userName: 'Sarah Jenkins',
    durationMinutes: 240, // 4 hours
    hourlyRate: 125,
    billable: true,
    invoiced: false,
    date: '2026-08-19',
    notes: 'Configured payment intent endpoints and iOS PKPaymentAuthorizationController setup.'
  },
  {
    id: 'log_2',
    projectId: 'proj_1',
    projectName: 'E-Commerce Mobile App',
    taskId: 'tsk_102',
    taskTitle: 'Product Catalog Filtering & Search Optimization',
    userId: 'usr_1',
    userName: 'Alex Vance',
    durationMinutes: 390, // 6.5 hours
    hourlyRate: 125,
    billable: true,
    invoiced: false,
    date: '2026-08-18',
    notes: 'Benchmarked Elasticsearch query response under 45ms and wired frontend search input.'
  },
  {
    id: 'log_3',
    projectId: 'proj_2',
    projectName: 'Cloud Infrastructure Migration',
    taskId: 'tsk_201',
    taskTitle: 'Setup EKS Kubernetes Cluster with Helm Charts',
    userId: 'usr_1',
    userName: 'Alex Vance',
    durationMinutes: 300, // 5 hours
    hourlyRate: 150,
    billable: true,
    invoiced: false,
    date: '2026-08-20',
    notes: 'Provisioned Terraform EKS module with ALB Ingress Controller.'
  },
  {
    id: 'log_4',
    projectId: 'proj_3',
    projectName: 'Brand Identity & Web Redesign',
    taskId: 'tsk_301',
    taskTitle: 'Figma UI Component Design System Sign-off',
    userId: 'usr_1',
    userName: 'Alex Vance',
    durationMinutes: 480, // 8 hours
    hourlyRate: 110,
    billable: true,
    invoiced: true,
    invoiceId: 'inv_1001',
    date: '2026-07-15',
    notes: 'Completed client presentation and handed off full asset exports.'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'inv_1001',
    invoiceNumber: 'INV-2026-001',
    clientId: 'usr_3',
    clientName: 'Apex Corporation',
    clientEmail: 'contact@apexcorp.com',
    projectId: 'proj_3',
    projectName: 'Brand Identity & Web Redesign',
    status: 'Paid', // Draft, Sent, Paid, Overdue
    issueDate: '2026-07-31',
    dueDate: '2026-08-15',
    paidDate: '2026-08-10',
    subtotal: 18000.00,
    taxRate: 10,
    taxAmount: 1800.00,
    totalAmount: 19800.00,
    items: [
      { description: 'Figma UI Component System & Tokens Handover', hours: 30, rate: 110, amount: 3300 },
      { description: 'Next.js Custom Landing Page & Performance Tuning', hours: 80, rate: 110, amount: 8800 },
      { description: '3D Asset Renderings & Video Background Exports', hours: 53.6, rate: 110, amount: 5900 }
    ],
    notes: 'Thank you for your business! Payment received via Wire Transfer.'
  },
  {
    id: 'inv_1002',
    invoiceNumber: 'INV-2026-002',
    clientId: 'usr_3',
    clientName: 'Apex Corporation',
    clientEmail: 'contact@apexcorp.com',
    projectId: 'proj_1',
    projectName: 'E-Commerce Mobile App',
    status: 'Sent',
    issueDate: '2026-08-15',
    dueDate: '2026-08-30',
    paidDate: null,
    subtotal: 12500.00,
    taxRate: 10,
    taxAmount: 1250.00,
    totalAmount: 13750.00,
    items: [
      { description: 'Phase 1 Sprint Deliverables - Mobile Architecture & Authentication', hours: 60, rate: 125, amount: 7500 },
      { description: 'Product Catalog & Cart Management APIs', hours: 40, rate: 125, amount: 5000 }
    ],
    notes: 'Please remit payment within 15 days via Stripe Direct or ACH.'
  }
];

export const INITIAL_ACTIVITIES = [
  { id: 'act_1', user: 'Alex Vance', action: 'started timer on', target: 'Setup EKS Kubernetes Cluster', time: '10 mins ago' },
  { id: 'act_2', user: 'Sarah Jenkins', action: 'moved task to In Review:', target: 'Product Catalog Filtering', time: '1 hour ago' },
  { id: 'act_3', user: 'Apex Corp', action: 'approved invoice', target: 'INV-2026-001 ($19,800.00)', time: 'Yesterday' },
  { id: 'act_4', user: 'Alex Vance', action: 'created new project milestone', target: 'E-Commerce Mobile App', time: '2 days ago' }
];

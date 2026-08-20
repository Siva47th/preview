export const INITIAL_CATEGORIES = [
  'Web Development',
  'Automation',
  'App Development'
];

export const INITIAL_USERS = [
  {
    id: 'usr_1',
    name: 'Alex Vance',
    email: 'alex@freewheel.io',
    role: 'admin', // Agency Lead / Admin
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Agency Founder & Lead Architect',
    specialization: 'Web Development',
    hourlyRate: 150
  },
  {
    id: 'usr_2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@freewheel.io',
    role: 'dev', // Senior Developer
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Frontend Engineer',
    specialization: 'App Development',
    hourlyRate: 125
  },
  {
    id: 'usr_3',
    name: 'Marcus Reed',
    email: 'marcus@freewheel.io',
    role: 'dev', // Developer
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Automation & AI Engineer',
    specialization: 'Automation',
    hourlyRate: 135
  }
];

export const INITIAL_SHOWCASE = [
  {
    id: 'show_1',
    title: 'FinTech Mobile Banking SuperApp',
    client: 'Apex Corporation',
    category: 'App Development',
    year: '2025',
    budget: '$120,000',
    duration: '14 Weeks',
    summary: 'Built a high-frequency banking application handling over 40,000 active daily transactions with instant micro-investing and biometric authentication.',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Transaction Latency', value: '< 80ms' },
      { label: 'User Adoption Rate', value: '+310%' },
      { label: 'Security Score', value: '99.9%' }
    ],
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Redis'],
    testimonial: {
      quote: "Freewheel delivered our core financial app ahead of schedule with complete transparency.",
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
    category: 'Automation',
    year: '2025',
    budget: '$85,000',
    duration: '8 Weeks',
    summary: 'Engineered an AI-powered fleet dispatch algorithm reducing route fuel waste by 24% and providing real-time telemetry analytics.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Fuel Cost Savings', value: '$450K/yr' },
      { label: 'Route Optimization', value: '12x Faster' },
      { label: 'Dispatch Errors', value: '-94%' }
    ],
    techStack: ['Python', 'FastAPI', 'PyTorch', 'Docker'],
    testimonial: {
      quote: "The solution transformed our logistics throughput with master-level engineering.",
      author: "Elena Rostova, VP Operations"
    },
    deliverables: [
      'Predictive Traffic & Weather AI Engine',
      'Driver Mobile Companion Portal',
      'Executive Telemetry Dashboard'
    ]
  },
  {
    id: 'show_3',
    title: 'Enterprise Portal & Web Redesign',
    client: 'Vanguard Metrics Inc.',
    category: 'Web Development',
    year: '2024',
    budget: '$65,000',
    duration: '6 Weeks',
    summary: 'Developed a real-time event analytics dashboard processing over 10M daily events with interactive funnel visualizers.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Events / Sec', value: '15,000+' },
      { label: 'Query Response', value: '45ms' },
      { label: 'MRR Growth Impact', value: '+45%' }
    ],
    techStack: ['Next.js', 'ClickHouse', 'TailwindCSS', 'TypeScript'],
    testimonial: {
      quote: "Precise execution and billing transparency throughout the web redesign project.",
      author: "David Vance, CEO Vanguard Metrics"
    },
    deliverables: [
      'Custom Columnar Data Store',
      'Real-time Cohort Retention Matrix',
      'Exportable Executive PDF Reports'
    ]
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    name: 'E-Commerce Mobile App',
    category: 'App Development',
    clientName: 'Apex Corporation',
    description: 'Cross-platform mobile commerce experience with native Apple/Google Pay and AI recommendations.',
    status: 'In Progress',
    budget: 45000,
    hourlyRate: 125,
    startDate: '2026-07-01',
    deadline: '2026-09-30',
    completionPercentage: 65,
    assignedDevIds: ['usr_2'],
    tags: ['React Native', 'Node.js', 'Stripe']
  },
  {
    id: 'proj_2',
    name: 'Cloud Automation Pipeline',
    category: 'Automation',
    clientName: 'LogiGlobal Freight',
    description: 'Automating legacy monolith deployments to containerized Kubernetes clusters on AWS.',
    status: 'In Progress',
    budget: 30000,
    hourlyRate: 135,
    startDate: '2026-08-01',
    deadline: '2026-10-15',
    completionPercentage: 40,
    assignedDevIds: ['usr_3'],
    tags: ['Python', 'Kubernetes', 'AWS']
  },
  {
    id: 'proj_3',
    name: 'Brand Portal & Web App',
    category: 'Web Development',
    clientName: 'Vanguard Metrics',
    description: 'Complete web application redesign, component library creation, and marketing site deployment.',
    status: 'Completed',
    budget: 18000,
    hourlyRate: 150,
    startDate: '2026-05-15',
    deadline: '2026-07-31',
    completionPercentage: 100,
    assignedDevIds: ['usr_1', 'usr_2'],
    tags: ['Next.js', 'TailwindCSS']
  }
];

export const INITIAL_TASKS = [
  {
    id: 'tsk_101',
    projectId: 'proj_1',
    category: 'App Development',
    title: 'Integrate Stripe SDK for Apple Pay & Google Pay',
    description: 'Implement secure checkout session tokens and handle webhook callbacks.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'usr_2',
    assigneeName: 'Sarah Jenkins',
    estimatedHours: 16,
    loggedHours: 10.5,
    dueDate: '2026-08-25'
  },
  {
    id: 'tsk_102',
    projectId: 'proj_2',
    category: 'Automation',
    title: 'Configure Auto-scaling CI/CD Bot Runner',
    description: 'Set up automated Kubernetes build triggers and GitHub webhook handlers.',
    status: 'In Progress',
    priority: 'Urgent',
    assigneeId: 'usr_3',
    assigneeName: 'Marcus Reed',
    estimatedHours: 20,
    loggedHours: 14.0,
    dueDate: '2026-08-28'
  },
  {
    id: 'tsk_103',
    projectId: 'proj_3',
    category: 'Web Development',
    title: 'Web Component Design Tokens Sign-off',
    description: 'Finalize design tokens, color scales, and responsive layout components.',
    status: 'Done',
    priority: 'Medium',
    assigneeId: 'usr_2',
    assigneeName: 'Sarah Jenkins',
    estimatedHours: 30,
    loggedHours: 28.5,
    dueDate: '2026-07-20'
  }
];

export const INITIAL_TIME_LOGS = [
  {
    id: 'log_1',
    projectId: 'proj_1',
    category: 'App Development',
    projectName: 'E-Commerce Mobile App',
    taskId: 'tsk_101',
    taskTitle: 'Integrate Stripe SDK for Apple Pay & Google Pay',
    userId: 'usr_2',
    userName: 'Sarah Jenkins',
    durationMinutes: 240,
    hourlyRate: 125,
    billable: true,
    invoiced: false,
    date: '2026-08-19',
    notes: 'Configured payment intent endpoints and iOS authorizations.'
  },
  {
    id: 'log_2',
    projectId: 'proj_2',
    category: 'Automation',
    projectName: 'Cloud Automation Pipeline',
    taskId: 'tsk_102',
    taskTitle: 'Configure Auto-scaling CI/CD Bot Runner',
    userId: 'usr_3',
    userName: 'Marcus Reed',
    durationMinutes: 300,
    hourlyRate: 135,
    billable: true,
    invoiced: false,
    date: '2026-08-20',
    notes: 'Provisioned automated build runners.'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'inv_1001',
    invoiceNumber: 'INV-2026-001',
    clientName: 'Vanguard Metrics Inc.',
    clientEmail: 'contact@vanguard.com',
    projectId: 'proj_3',
    projectName: 'Brand Portal & Web App',
    status: 'Paid',
    issueDate: '2026-07-31',
    dueDate: '2026-08-15',
    paidDate: '2026-08-10',
    subtotal: 18000.00,
    taxRate: 10,
    taxAmount: 1800.00,
    totalAmount: 19800.00,
    items: [
      { description: 'Next.js Custom Portal & Tuning', hours: 80, rate: 150, amount: 12000 },
      { description: 'Asset Renderings & Component Handover', hours: 40, rate: 150, amount: 6000 }
    ],
    notes: 'Thank you for your business! Paid via Wire Transfer.'
  }
];

export const INITIAL_ACTIVITIES = [
  { id: 'act_1', user: 'Alex Vance (Admin)', action: 'started stopwatch timer on', target: 'Auto-scaling CI/CD Bot', time: '10 mins ago' },
  { id: 'act_2', user: 'Alex Vance (Admin)', action: 'assigned task to Marcus Reed:', target: 'Cloud Automation Pipeline', time: '1 hour ago' },
  { id: 'act_3', user: 'Alex Vance (Admin)', action: 'created job in Web Development:', target: 'Brand Portal & Web App', time: 'Yesterday' }
];

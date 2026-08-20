export const INITIAL_CATEGORIES = [
  'Full-Stack Web App',
  'Web Development',
  'Automation',
  'App Development'
];

export const INITIAL_SUB_ROLES = [
  'Frontend',
  'Backend',
  'Database & DevOps',
  'QA & Automation'
];

export const INITIAL_USERS = [
  {
    id: 'usr_1',
    name: 'Alex Vance',
    email: 'alex@freewheel.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Architect & Agency Founder',
    specialization: 'Full-Stack Architecture',
    subRole: 'Backend',
    hourlyRate: 150
  },
  {
    id: 'usr_2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Frontend Engineer',
    specialization: 'Web Development',
    subRole: 'Frontend',
    hourlyRate: 125
  },
  {
    id: 'usr_3',
    name: 'Marcus Reed',
    email: 'marcus@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Automation & AI Specialist',
    specialization: 'Automation',
    subRole: 'Backend',
    hourlyRate: 135
  },
  {
    id: 'usr_4',
    name: 'David Chen',
    email: 'david.c@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Backend Engineer',
    specialization: 'Full-Stack Web App',
    subRole: 'Backend',
    hourlyRate: 130
  },
  {
    id: 'usr_5',
    name: 'Priya Sharma',
    email: 'priya.s@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Database Architect & DevOps',
    specialization: 'Full-Stack Web App',
    subRole: 'Database & DevOps',
    hourlyRate: 140
  },
  {
    id: 'usr_6',
    name: 'James Wilson',
    email: 'james.w@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    title: 'React Native & Mobile Dev',
    specialization: 'App Development',
    subRole: 'Frontend',
    hourlyRate: 120
  },
  {
    id: 'usr_7',
    name: 'Elena Rostova',
    email: 'elena.r@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'API & Security Engineer',
    specialization: 'Full-Stack Web App',
    subRole: 'Backend',
    hourlyRate: 135
  },
  {
    id: 'usr_8',
    name: 'Carlos Mendez',
    email: 'carlos.m@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    title: 'UI/UX & Frontend Developer',
    specialization: 'Web Development',
    subRole: 'Frontend',
    hourlyRate: 115
  },
  {
    id: 'usr_9',
    name: 'Ananya Gupta',
    email: 'ananya.g@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    title: 'QA & Test Automation Engineer',
    specialization: 'Automation',
    subRole: 'QA & Automation',
    hourlyRate: 110
  }
];

export const INITIAL_SHOWCASE = [
  {
    id: 'show_1',
    title: 'Full-Stack FinTech Mobile Banking Platform',
    client: 'Apex Corporation',
    category: 'Full-Stack Web App',
    year: '2025',
    budget: '$120,000',
    duration: '14 Weeks',
    summary: 'Delivered an end-to-end full-stack banking suite with React Native mobile frontend, Node.js microservices backend, PostgreSQL database, and automated Playwright QA.',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Transaction Latency', value: '< 80ms' },
      { label: 'User Adoption Rate', value: '+310%' },
      { label: 'Security Score', value: '99.9%' }
    ],
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    testimonial: {
      quote: "Freewheel's 9-member dev team assigned roles across frontend, backend, and database flawlessly with individual stopwatch tracking.",
      author: "Marcus Thorne, CTO at Apex Corp"
    },
    deliverables: [
      'Frontend Mobile Apple/Google Pay Native Integration',
      'Backend Microservices & OAuth JWT Tokens',
      'Database AWS RDS Failover & Read Replicas',
      'Automated E2E Playwright Security Suite'
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
    summary: 'Engineered an AI-powered fleet dispatch algorithm reducing route fuel waste by 24% with real-time telemetry analytics.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Fuel Cost Savings', value: '$450K/yr' },
      { label: 'Route Optimization', value: '12x Faster' },
      { label: 'Dispatch Errors', value: '-94%' }
    ],
    techStack: ['Python', 'FastAPI', 'PyTorch', 'Docker'],
    testimonial: {
      quote: "Precise sub-role assignments and per-task timing gave our team unprecedented clarity.",
      author: "Elena Rostova, VP Operations"
    },
    deliverables: [
      'Predictive Traffic & Weather AI Engine',
      'Driver Mobile Companion Portal',
      'Executive Telemetry Dashboard'
    ]
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    name: 'Full-Stack E-Commerce Platform',
    category: 'Full-Stack Web App',
    clientName: 'Apex Corporation',
    description: 'Complete full-stack platform covering React frontend UI, Node.js API backend, PostgreSQL database, and QA automation suite.',
    status: 'In Progress',
    budget: 65000,
    hourlyRate: 135,
    startDate: '2026-07-01',
    deadline: '2026-09-30',
    completionPercentage: 65,
    assignedDevs: {
      'Frontend': ['usr_2', 'usr_8'],
      'Backend': ['usr_4', 'usr_7'],
      'Database & DevOps': ['usr_5'],
      'QA & Automation': ['usr_9']
    },
    tags: ['React', 'Node.js', 'PostgreSQL', 'Playwright']
  },
  {
    id: 'proj_2',
    name: 'Cloud Automation & AI Engine',
    category: 'Automation',
    clientName: 'LogiGlobal Freight',
    description: 'Automating multi-cloud Kubernetes clusters with Python FastAPI and AI predictive dispatching.',
    status: 'In Progress',
    budget: 40000,
    hourlyRate: 140,
    startDate: '2026-08-01',
    deadline: '2026-10-15',
    completionPercentage: 40,
    assignedDevs: {
      'Backend': ['usr_3'],
      'Database & DevOps': ['usr_5'],
      'QA & Automation': ['usr_9']
    },
    tags: ['Python', 'Kubernetes', 'AWS', 'Docker']
  }
];

export const INITIAL_TASKS = [
  // Full-Stack E-Commerce Tasks by Sub-Role
  {
    id: 'tsk_101',
    projectId: 'proj_1',
    category: 'Full-Stack Web App',
    subRole: 'Frontend',
    title: 'React Checkout UI & Stripe SDK Integration',
    description: 'Build responsive checkout drawer with native payment gateway hooks.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'usr_2',
    assigneeName: 'Sarah Jenkins',
    estimatedHours: 24,
    loggedHours: 12.0,
    dueDate: '2026-08-25'
  },
  {
    id: 'tsk_102',
    projectId: 'proj_1',
    category: 'Full-Stack Web App',
    subRole: 'Backend',
    title: 'OAuth JWT Authentication & Session Endpoints',
    description: 'Develop secure refresh token rotation and RBAC middleware.',
    status: 'In Progress',
    priority: 'Urgent',
    assigneeId: 'usr_4',
    assigneeName: 'David Chen',
    estimatedHours: 20,
    loggedHours: 14.5,
    dueDate: '2026-08-26'
  },
  {
    id: 'tsk_103',
    projectId: 'proj_1',
    category: 'Full-Stack Web App',
    subRole: 'Database & DevOps',
    title: 'PostgreSQL Schema ERD & RDS Failover Replica',
    description: 'Provision automated snapshot backups and dual-zone VPC peering.',
    status: 'In Review',
    priority: 'High',
    assigneeId: 'usr_5',
    assigneeName: 'Priya Sharma',
    estimatedHours: 16,
    loggedHours: 16.0,
    dueDate: '2026-08-27'
  },
  {
    id: 'tsk_104',
    projectId: 'proj_1',
    category: 'Full-Stack Web App',
    subRole: 'QA & Automation',
    title: 'Playwright E2E Checkout Flow & Security Suite',
    description: 'Script automated cross-browser test suite for signup to invoice checkout.',
    status: 'To Do',
    priority: 'Medium',
    assigneeId: 'usr_9',
    assigneeName: 'Ananya Gupta',
    estimatedHours: 18,
    loggedHours: 4.0,
    dueDate: '2026-08-30'
  },
  // Cloud Automation Tasks
  {
    id: 'tsk_201',
    projectId: 'proj_2',
    category: 'Automation',
    subRole: 'Backend',
    title: 'FastAPI Telemetry Stream & Bot Dispatcher',
    description: 'Construct async Python endpoints for real-time fleet telemetry.',
    status: 'In Progress',
    priority: 'Urgent',
    assigneeId: 'usr_3',
    assigneeName: 'Marcus Reed',
    estimatedHours: 30,
    loggedHours: 18.0,
    dueDate: '2026-09-02'
  }
];

export const INITIAL_TIME_LOGS = [
  {
    id: 'log_1',
    projectId: 'proj_1',
    category: 'Full-Stack Web App',
    subRole: 'Frontend',
    projectName: 'Full-Stack E-Commerce Platform',
    taskId: 'tsk_101',
    taskTitle: 'React Checkout UI & Stripe SDK Integration',
    userId: 'usr_2',
    userName: 'Sarah Jenkins',
    durationMinutes: 720, // 12 hrs
    hourlyRate: 125,
    billable: true,
    invoiced: false,
    date: '2026-08-19',
    notes: 'Configured checkout components and Stripe payment intents.'
  },
  {
    id: 'log_2',
    projectId: 'proj_1',
    category: 'Full-Stack Web App',
    subRole: 'Backend',
    projectName: 'Full-Stack E-Commerce Platform',
    taskId: 'tsk_102',
    taskTitle: 'OAuth JWT Authentication & Session Endpoints',
    userId: 'usr_4',
    userName: 'David Chen',
    durationMinutes: 870, // 14.5 hrs
    hourlyRate: 130,
    billable: true,
    invoiced: false,
    date: '2026-08-20',
    notes: 'Implemented JWT token refresh rotation and route guards.'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'inv_1001',
    invoiceNumber: 'INV-2026-001',
    clientName: 'Apex Corporation',
    clientEmail: 'contact@apexcorp.com',
    projectId: 'proj_1',
    projectName: 'Full-Stack E-Commerce Platform',
    status: 'Sent',
    issueDate: '2026-08-15',
    dueDate: '2026-08-30',
    paidDate: null,
    subtotal: 15000.00,
    taxRate: 10,
    taxAmount: 1500.00,
    totalAmount: 16500.00,
    items: [
      { description: 'Frontend Checkout UI & State Architecture', hours: 60, rate: 125, amount: 7500 },
      { description: 'Backend Microservices & JWT Session Security', hours: 57.6, rate: 130, amount: 7500 }
    ],
    notes: 'Payment due within 15 days via ACH or Direct Wire.'
  }
];

export const INITIAL_ACTIVITIES = [
  { id: 'act_1', user: 'Alex Vance (Admin)', action: 'started individual stopwatch on task:', target: 'React Checkout UI (Frontend)', time: '5 mins ago' },
  { id: 'act_2', user: 'Alex Vance (Admin)', action: 'assigned sub-role Database & DevOps to:', target: 'Priya Sharma', time: '1 hour ago' },
  { id: 'act_3', user: 'Alex Vance (Admin)', action: 'created Full-Stack project:', target: 'Full-Stack E-Commerce Platform', time: 'Yesterday' }
];

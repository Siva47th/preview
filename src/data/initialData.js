export const SERVICES_CATALOG = [
  {
    id: 'srv_fullstack',
    name: 'Full-Stack Web Development',
    description: 'End-to-end web software covering UI frontend, API backend, database, and test automation.',
    layers: ['Frontend Engineering', 'Backend Architecture', 'Database & DevOps', 'QA & Automation']
  },
  {
    id: 'srv_app',
    name: 'App Development',
    description: 'Cross-platform mobile apps for iOS and Android with native payment SDKs and cloud syncing.',
    layers: ['iOS & Android UI', 'Mobile API Services', 'App Store & Deployment']
  },
  {
    id: 'srv_automation',
    name: 'AI & Cloud Automation',
    description: 'Enterprise AI bot pipelines, automated telemetry, and Kubernetes cloud infrastructure.',
    layers: ['AI Bot Pipeline', 'Cloud Orchestration', 'CI/CD Test Automation']
  }
];

export const INITIAL_USERS = [
  {
    id: 'usr_1',
    name: 'Alex Vance',
    email: 'alex@freewheel.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Architect & Agency Founder',
    specialization: 'Full-Stack Web Development',
    subRole: 'Backend Architecture',
    hourlyRate: 12500
  },
  {
    id: 'usr_2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Frontend Engineer',
    specialization: 'Full-Stack Web Development',
    subRole: 'Frontend Engineering',
    hourlyRate: 10500
  },
  {
    id: 'usr_3',
    name: 'Marcus Reed',
    email: 'marcus@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Automation & AI Specialist',
    specialization: 'AI & Cloud Automation',
    subRole: 'AI Bot Pipeline',
    hourlyRate: 11300
  },
  {
    id: 'usr_4',
    name: 'David Chen',
    email: 'david.c@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Backend Engineer',
    specialization: 'Full-Stack Web Development',
    subRole: 'Backend Architecture',
    hourlyRate: 10900
  },
  {
    id: 'usr_5',
    name: 'Priya Sharma',
    email: 'priya.s@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Database Architect & DevOps',
    specialization: 'Full-Stack Web Development',
    subRole: 'Database & DevOps',
    hourlyRate: 11700
  },
  {
    id: 'usr_6',
    name: 'James Wilson',
    email: 'james.w@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    title: 'React Native & Mobile Specialist',
    specialization: 'App Development',
    subRole: 'iOS & Android UI',
    hourlyRate: 10000
  },
  {
    id: 'usr_7',
    name: 'Elena Rostova',
    email: 'elena.r@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'API & Security Engineer',
    specialization: 'Full-Stack Web Development',
    subRole: 'Backend Architecture',
    hourlyRate: 11300
  },
  {
    id: 'usr_8',
    name: 'Carlos Mendez',
    email: 'carlos.m@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    title: 'UI/UX & Frontend Developer',
    specialization: 'Full-Stack Web Development',
    subRole: 'Frontend Engineering',
    hourlyRate: 9600
  },
  {
    id: 'usr_9',
    name: 'Ananya Gupta',
    email: 'ananya.g@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    title: 'QA & Test Automation Specialist',
    specialization: 'Full-Stack Web Development',
    subRole: 'QA & Automation',
    hourlyRate: 9200
  }
];

export const INITIAL_SHOWCASE = [
  {
    id: 'show_1',
    title: 'Full-Stack FinTech Mobile Banking Suite',
    client: 'Apex Corporation',
    category: 'Full-Stack Web Development',
    year: '2025',
    budget: '₹1,00,80,000',
    duration: '14 Weeks',
    summary: 'Delivered a full-stack banking suite with React Native mobile frontend, Node.js microservices backend, PostgreSQL database, and automated Playwright QA.',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Transaction Latency', value: '< 80ms' },
      { label: 'User Adoption Rate', value: '+310%' },
      { label: 'Security Score', value: '99.9%' }
    ],
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Redis'],
    testimonial: {
      quote: "Freewheel's layer-by-layer task assignment across frontend, backend, and database gave our stakeholders 100% clarity.",
      author: "Marcus Thorne, CTO at Apex Corp"
    },
    deliverables: [
      'Frontend Mobile Apple/Google Pay Integration',
      'Backend Microservices & OAuth JWT Tokens',
      'Database AWS RDS Failover & Read Replicas',
      'Automated E2E Playwright Security Suite'
    ]
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    name: 'Full-Stack E-Commerce Platform',
    service: 'Full-Stack Web Development',
    clientName: 'Apex Corporation',
    description: 'Complete full-stack platform covering Frontend UI, Backend APIs, Database RDS, and Playwright QA automation.',
    status: 'In Progress',
    budget: 5460000,
    hourlyRate: 11300,
    startDate: '2026-07-01',
    deadline: '2026-09-30',
    completionPercentage: 65,
    assignedDevs: {
      'Frontend Engineering': ['usr_2', 'usr_8'],
      'Backend Architecture': ['usr_4', 'usr_7'],
      'Database & DevOps': ['usr_5'],
      'QA & Automation': ['usr_9']
    },
    tags: ['Full-Stack', 'React', 'Node.js', 'PostgreSQL']
  },
  {
    id: 'proj_2',
    name: 'Cloud AI Telemetry & Bot Pipeline',
    service: 'AI & Cloud Automation',
    clientName: 'LogiGlobal Freight',
    description: 'Automating multi-cloud Kubernetes clusters with Python FastAPI and AI predictive dispatching.',
    status: 'In Progress',
    budget: 3360000,
    hourlyRate: 11700,
    startDate: '2026-08-01',
    deadline: '2026-10-15',
    completionPercentage: 40,
    assignedDevs: {
      'AI Bot Pipeline': ['usr_3'],
      'Cloud Orchestration': ['usr_5'],
      'CI/CD Test Automation': ['usr_9']
    },
    tags: ['Python', 'Kubernetes', 'AWS', 'Docker']
  }
];

export const INITIAL_TASKS = [
  // Full-Stack Web Development Service Tasks (Layered)
  {
    id: 'tsk_101',
    projectId: 'proj_1',
    service: 'Full-Stack Web Development',
    layer: 'Frontend Engineering',
    title: 'Develop Responsive Web Shopping Cart & Stripe Payment SDK',
    description: 'Construct modular React checkout components with Stripe payment intent hooks.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'usr_2',
    assigneeName: 'Sarah Jenkins',
    estimatedHours: 24,
    loggedHours: 12.0,
    progress: 50,
    pendingProgress: 75,
    pendingApproval: true,
    dueDate: '2026-08-25'
  },
  {
    id: 'tsk_102',
    projectId: 'proj_1',
    service: 'Full-Stack Web Development',
    layer: 'Backend Architecture',
    title: 'Build OAuth JWT Session Authentication & RBAC Middleware',
    description: 'Develop secure refresh token rotation and endpoint authorization guards.',
    status: 'In Progress',
    priority: 'Urgent',
    assigneeId: 'usr_4',
    assigneeName: 'David Chen',
    estimatedHours: 20,
    loggedHours: 14.5,
    progress: 75,
    pendingProgress: 75,
    pendingApproval: false,
    dueDate: '2026-08-26'
  },
  {
    id: 'tsk_103',
    projectId: 'proj_1',
    service: 'Full-Stack Web Development',
    layer: 'Database & DevOps',
    title: 'Provision PostgreSQL Schema ERD & AWS RDS Read Replicas',
    description: 'Set up automated snapshot strategy and multi-AZ failover cluster.',
    status: 'In Review',
    priority: 'High',
    assigneeId: 'usr_5',
    assigneeName: 'Priya Sharma',
    estimatedHours: 16,
    loggedHours: 16.0,
    progress: 85,
    pendingProgress: 100,
    pendingApproval: true,
    dueDate: '2026-08-27'
  },
  {
    id: 'tsk_104',
    projectId: 'proj_1',
    service: 'Full-Stack Web Development',
    layer: 'QA & Automation',
    title: 'Script Playwright E2E Test Suite for Signup to Payment Checkout',
    description: 'Automate cross-browser regression testing and security audit assertions.',
    status: 'To Do',
    priority: 'Medium',
    assigneeId: 'usr_9',
    assigneeName: 'Ananya Gupta',
    estimatedHours: 18,
    loggedHours: 4.0,
    progress: 20,
    pendingProgress: 20,
    pendingApproval: false,
    dueDate: '2026-08-30'
  },
  // App Development Service Tasks (Layered)
  {
    id: 'tsk_301',
    projectId: 'proj_1',
    service: 'App Development',
    layer: 'iOS & Android UI',
    title: 'React Native Cross-Platform Navigation & Dark Theme Views',
    description: 'Configure bottom tab navigation and smooth screen transitions.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'usr_6',
    assigneeName: 'James Wilson',
    estimatedHours: 25,
    loggedHours: 10.0,
    progress: 40,
    pendingProgress: 40,
    pendingApproval: false,
    dueDate: '2026-09-01'
  },
  // AI & Cloud Automation Service Tasks (Layered)
  {
    id: 'tsk_201',
    projectId: 'proj_2',
    service: 'AI & Cloud Automation',
    layer: 'AI Bot Pipeline',
    title: 'FastAPI Async Telemetry Stream & AI Predictive Bot Dispatcher',
    description: 'Construct async Python endpoints for real-time fleet telemetry.',
    status: 'In Progress',
    priority: 'Urgent',
    assigneeId: 'usr_3',
    assigneeName: 'Marcus Reed',
    estimatedHours: 30,
    loggedHours: 18.0,
    progress: 40,
    pendingProgress: 65,
    pendingApproval: true,
    dueDate: '2026-09-02'
  }
];

export const INITIAL_TIME_LOGS = [
  {
    id: 'log_1',
    projectId: 'proj_1',
    service: 'Full-Stack Web Development',
    layer: 'Frontend Engineering',
    projectName: 'Full-Stack E-Commerce Platform',
    taskId: 'tsk_101',
    taskTitle: 'Develop Responsive Web Shopping Cart & Stripe Payment SDK',
    userId: 'usr_2',
    userName: 'Sarah Jenkins',
    durationMinutes: 720,
    hourlyRate: 10500,
    billable: true,
    invoiced: false,
    date: '2026-08-19',
    notes: 'Built shopping cart state and Stripe payment intent hooks.'
  },
  {
    id: 'log_2',
    projectId: 'proj_1',
    service: 'Full-Stack Web Development',
    layer: 'Backend Architecture',
    projectName: 'Full-Stack E-Commerce Platform',
    taskId: 'tsk_102',
    taskTitle: 'Build OAuth JWT Session Authentication & RBAC Middleware',
    userId: 'usr_4',
    userName: 'David Chen',
    durationMinutes: 870,
    hourlyRate: 10900,
    billable: true,
    invoiced: false,
    date: '2026-08-20',
    notes: 'Implemented JWT token refresh rotation and middleware authorization.'
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
    subtotal: 1260000,
    taxRate: 10,
    taxAmount: 126000,
    totalAmount: 1386000,
    items: [
      { description: '[Frontend Engineering] Responsive Cart & Payment Integration', hours: 60, rate: 10500, amount: 630000 },
      { description: '[Backend Architecture] OAuth JWT Session Security Endpoints', hours: 57.6, rate: 10900, amount: 627840 }
    ],
    notes: 'Payment due within 15 days via UPI, NEFT, or RTGS.'
  }
];

export const INITIAL_ACTIVITIES = [
  { id: 'act_1', user: 'Alex Vance (Admin)', action: 'started task stopwatch on:', target: 'React Shopping Cart (Frontend Engineering)', time: '5 mins ago' },
  { id: 'act_2', user: 'Alex Vance (Admin)', action: 'assigned task in Database & DevOps to:', target: 'Priya Sharma', time: '1 hour ago' },
  { id: 'act_3', user: 'Alex Vance (Admin)', action: 'created Full-Stack Service Job:', target: 'Full-Stack E-Commerce Platform', time: 'Yesterday' }
];

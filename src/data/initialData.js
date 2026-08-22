export const SERVICES_CATALOG = [
  {
    id: 'srv_web',
    name: 'Web Development',
    description: 'End-to-end web architecture covering UI/UX design, frontend, backend, database, and DevOps/Deployment.',
    layers: ['UI/UX Design', 'Frontend', 'Backend', 'Database', 'DevOps/Deployment']
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
    specialization: 'Web Development',
    subRole: 'Backend',
    hourlyRate: 12500
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
    specialization: 'Web Development',
    subRole: 'Backend',
    hourlyRate: 10900
  },
  {
    id: 'usr_5',
    name: 'Priya Sharma',
    email: 'priya.s@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Database Architect & DevOps',
    specialization: 'Web Development',
    subRole: 'Database',
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
    specialization: 'Web Development',
    subRole: 'Backend',
    hourlyRate: 11300
  },
  {
    id: 'usr_8',
    name: 'Carlos Mendez',
    email: 'carlos.m@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    title: 'UI/UX & Design Specialist',
    specialization: 'Web Development',
    subRole: 'UI/UX Design',
    hourlyRate: 9600
  },
  {
    id: 'usr_9',
    name: 'Ananya Gupta',
    email: 'ananya.g@freewheel.io',
    role: 'dev',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    title: 'DevOps & Test Automation Specialist',
    specialization: 'Web Development',
    subRole: 'DevOps/Deployment',
    hourlyRate: 9200
  }
];

export const INITIAL_PROJECT_HISTORY = [
  {
    id: 'hist_1',
    title: 'FinTech Banking & Payment Suite',
    client: 'Apex Corporation',
    service: 'Web Development',
    completionDate: 'Q4 2025 (Dec 2025)',
    finalBilled: 10080000,
    totalLoggedHours: 580,
    hourlyRate: 12500,
    summary: 'Delivered web banking suite covering UI/UX design, React frontend, Node.js microservices backend, PostgreSQL database, and automated DevOps deployment.',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Latency SLA', value: '< 80ms' },
      { label: 'Hours Audited', value: '580 hrs' },
      { label: 'Security Score', value: '100% Pass' }
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    layerBreakdown: [
      { layer: 'UI/UX Design', hours: 80, dev: 'Carlos Mendez' },
      { layer: 'Frontend', hours: 180, dev: 'Sarah Jenkins' },
      { layer: 'Backend', hours: 210, dev: 'David Chen' },
      { layer: 'Database', hours: 110, dev: 'Priya Sharma' },
      { layer: 'DevOps/Deployment', hours: 80, dev: 'Ananya Gupta' }
    ],
    deliverables: [
      'Figma Web App Design Tokens & Wireframes',
      'Frontend Mobile & Web Stripe Payment SDK',
      'OAuth JWT Session Security & Microservices',
      'PostgreSQL AWS RDS Multi-AZ Failover',
      'Automated E2E Docker CI/CD Deployment'
    ]
  },
  {
    id: 'hist_2',
    title: 'Enterprise Logistics Telemetry & AI Dispatcher',
    client: 'LogiGlobal Freight',
    service: 'AI & Cloud Automation',
    completionDate: 'Q3 2025 (Sep 2025)',
    finalBilled: 4850000,
    totalLoggedHours: 390,
    hourlyRate: 11700,
    summary: 'Automated fleet predictive dispatching and telemetry stream processing using Python FastAPI and Kubernetes cloud clusters.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'Route Efficiency', value: '+28%' },
      { label: 'Hours Audited', value: '390 hrs' },
      { label: 'Cluster Uptime', value: '99.99%' }
    ],
    techStack: ['Python FastAPI', 'Kubernetes', 'AWS', 'Docker'],
    layerBreakdown: [
      { layer: 'AI Bot Pipeline', hours: 160, dev: 'Marcus Reed' },
      { layer: 'Cloud Orchestration', hours: 140, dev: 'Priya Sharma' },
      { layer: 'CI/CD Test Automation', hours: 90, dev: 'Ananya Gupta' }
    ],
    deliverables: [
      'FastAPI Async Telemetry Stream Endpoints',
      'Kubernetes Multi-AZ Cloud Cluster Orchestration',
      'Predictive Fleet Dispatch AI Model',
      'Automated CI/CD Deployment Pipeline'
    ]
  },
  {
    id: 'hist_3',
    title: 'Cross-Platform Telehealth & Patient Portal App',
    client: 'CarePulse Health',
    service: 'App Development',
    completionDate: 'Q2 2025 (Jun 2025)',
    finalBilled: 3500000,
    totalLoggedHours: 320,
    hourlyRate: 10000,
    summary: 'Constructed HIPAA-compliant cross-platform mobile video consultation app for iOS and Android with WebRTC video calling.',
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { label: 'HIPAA Compliance', value: 'Verified' },
      { label: 'Hours Audited', value: '320 hrs' },
      { label: 'App Store Rating', value: '4.9 ★' }
    ],
    techStack: ['React Native', 'WebRTC', 'Node.js', 'AWS Health'],
    layerBreakdown: [
      { layer: 'iOS & Android UI', hours: 150, dev: 'James Wilson' },
      { layer: 'Mobile API Services', hours: 110, dev: 'Elena Rostova' },
      { layer: 'App Store & Deployment', hours: 60, dev: 'Alex Vance' }
    ],
    deliverables: [
      'Encrypted WebRTC Video Consultation Module',
      'Patient Appointment Booking & Reminders',
      'HIPAA Compliant Health Record Integration',
      'Apple App Store & Google Play Store Publishing'
    ]
  }
];

export const INITIAL_SHOWCASE = INITIAL_PROJECT_HISTORY;

export const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    name: 'Web Development E-Commerce Platform',
    service: 'Web Development',
    clientName: 'Apex Corporation',
    description: 'Complete web development platform covering UI/UX Design, Frontend, Backend, Database, and DevOps/Deployment.',
    status: 'Completed',
    budget: 5460000,
    hourlyRate: 11300,
    startDate: '2026-07-01',
    deadline: '2026-09-30',
    completionPercentage: 100,
    assignedDevs: {
      'UI/UX Design': ['usr_8'],
      'Frontend': ['usr_2'],
      'Backend': ['usr_4', 'usr_7'],
      'Database': ['usr_5'],
      'DevOps/Deployment': ['usr_9']
    },
    tags: ['Web Dev', 'React', 'Node.js', 'PostgreSQL']
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
  },
  {
    id: 'proj_3',
    name: 'Cross-Platform Mobile App Suite',
    service: 'App Development',
    clientName: 'CarePulse Health',
    description: 'Native cross-platform mobile application for iOS and Android with WebRTC calling.',
    status: 'In Progress',
    budget: 2800000,
    hourlyRate: 10000,
    startDate: '2026-08-15',
    deadline: '2026-11-01',
    completionPercentage: 40,
    assignedDevs: {
      'iOS & Android UI': ['usr_6'],
      'Mobile API Services': ['usr_7'],
      'App Store & Deployment': ['usr_1']
    },
    tags: ['React Native', 'iOS', 'Android', 'Mobile']
  }
];

export const INITIAL_TASKS = [
  // Web Development Service Tasks (5 Architectural Layers)
  {
    id: 'tsk_100',
    projectId: 'proj_1',
    service: 'Web Development',
    layer: 'UI/UX Design',
    title: 'Figma Web App Design Tokens & Wireframe System',
    description: 'Design responsive layout prototypes, color palettes, and component design tokens.',
    status: 'Done',
    priority: 'High',
    assigneeId: 'usr_8',
    assigneeName: 'Carlos Mendez',
    estimatedHours: 16,
    loggedHours: 16.0,
    progress: 100,
    pendingProgress: 100,
    pendingApproval: false,
    dueDate: '2026-08-20'
  },
  {
    id: 'tsk_101',
    projectId: 'proj_1',
    service: 'Web Development',
    layer: 'Frontend',
    title: 'Develop Responsive Web Shopping Cart & Stripe Payment SDK',
    description: 'Construct modular React checkout components with Stripe payment intent hooks.',
    status: 'Done',
    priority: 'High',
    assigneeId: 'usr_2',
    assigneeName: 'Sarah Jenkins',
    estimatedHours: 24,
    loggedHours: 12.0,
    progress: 100,
    pendingProgress: 100,
    pendingApproval: false,
    dueDate: '2026-08-25'
  },
  {
    id: 'tsk_102',
    projectId: 'proj_1',
    service: 'Web Development',
    layer: 'Backend',
    title: 'Build OAuth JWT Session Authentication & RBAC Middleware',
    description: 'Develop secure refresh token rotation and endpoint authorization guards.',
    status: 'Done',
    priority: 'Urgent',
    assigneeId: 'usr_4',
    assigneeName: 'David Chen',
    estimatedHours: 20,
    loggedHours: 14.5,
    progress: 100,
    pendingProgress: 100,
    pendingApproval: false,
    dueDate: '2026-08-26'
  },
  {
    id: 'tsk_103',
    projectId: 'proj_1',
    service: 'Web Development',
    layer: 'Database',
    title: 'Provision PostgreSQL Schema ERD & Relational Data Models',
    description: 'Set up automated snapshot strategy and database migration scripts.',
    status: 'Done',
    priority: 'High',
    assigneeId: 'usr_5',
    assigneeName: 'Priya Sharma',
    estimatedHours: 16,
    loggedHours: 16.0,
    progress: 100,
    pendingProgress: 100,
    pendingApproval: false,
    dueDate: '2026-08-27'
  },
  {
    id: 'tsk_104',
    projectId: 'proj_1',
    service: 'Web Development',
    layer: 'DevOps/Deployment',
    title: 'Configure AWS RDS Read Replicas & Docker CI/CD Pipeline',
    description: 'Automate containerized build deployments and Playwright security audits.',
    status: 'Done',
    priority: 'Medium',
    assigneeId: 'usr_9',
    assigneeName: 'Ananya Gupta',
    estimatedHours: 18,
    loggedHours: 4.0,
    progress: 100,
    pendingProgress: 100,
    pendingApproval: false,
    dueDate: '2026-08-30'
  },
  // App Development Service Tasks (Layered)
  {
    id: 'tsk_301',
    projectId: 'proj_3',
    service: 'App Development',
    layer: 'iOS & Android UI',
    title: 'React Native iOS & Android Consultation App UI',
    description: 'Construct native mobile navigation, dark theme UI, and WebRTC calling views.',
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
    service: 'Web Development',
    layer: 'Frontend',
    projectName: 'Web Development E-Commerce Platform',
    taskId: 'tsk_101',
    taskTitle: 'Develop Responsive Web Shopping Cart & Stripe Payment SDK',
    userId: 'usr_2',
    userName: 'Sarah Jenkins',
    durationMinutes: 720,
    hourlyRate: 10500,
    billable: true,
    invoiced: true,
    date: '2026-08-19',
    notes: 'Built shopping cart state and Stripe payment intent hooks.'
  },
  {
    id: 'log_2',
    projectId: 'proj_1',
    service: 'Web Development',
    layer: 'Backend',
    projectName: 'Web Development E-Commerce Platform',
    taskId: 'tsk_102',
    taskTitle: 'Build OAuth JWT Session Authentication & RBAC Middleware',
    userId: 'usr_4',
    userName: 'David Chen',
    durationMinutes: 870,
    hourlyRate: 10900,
    billable: true,
    invoiced: true,
    date: '2026-08-20',
    notes: 'Implemented JWT token refresh rotation and middleware authorization.'
  },
  {
    id: 'log_3',
    projectId: 'proj_2',
    service: 'AI & Cloud Automation',
    layer: 'AI Bot Pipeline',
    projectName: 'Cloud AI Telemetry & Bot Pipeline',
    taskId: 'tsk_201',
    taskTitle: 'FastAPI Async Telemetry Stream & AI Predictive Bot Dispatcher',
    userId: 'usr_3',
    userName: 'Marcus Reed',
    durationMinutes: 1080,
    hourlyRate: 11300,
    billable: true,
    invoiced: false,
    date: '2026-08-21',
    notes: 'Configured async Python telemetry endpoint stream for fleet tracking.'
  },
  {
    id: 'log_4',
    projectId: 'proj_3',
    service: 'App Development',
    layer: 'iOS & Android UI',
    projectName: 'Cross-Platform Mobile App Suite',
    taskId: 'tsk_301',
    taskTitle: 'React Native iOS & Android Consultation App UI',
    userId: 'usr_6',
    userName: 'James Wilson',
    durationMinutes: 600,
    hourlyRate: 10000,
    billable: true,
    invoiced: false,
    date: '2026-08-21',
    notes: 'Constructed native tab bar navigation and consultation appointment view.'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'inv_1001',
    invoiceNumber: 'INV-2026-001',
    clientName: 'Apex Corporation',
    clientEmail: 'contact@apexcorp.com',
    projectId: 'proj_1',
    projectName: 'Web Development E-Commerce Platform',
    status: 'Paid',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    paidDate: '2026-08-14',
    subtotal: 1260000,
    taxRate: 10,
    taxAmount: 126000,
    totalAmount: 1386000,
    items: [
      { description: '[Frontend] Responsive Web Shopping Cart & Stripe Payment SDK', hours: 60, rate: 10500, amount: 630000 },
      { description: '[Backend] OAuth JWT Session Security & RBAC Middleware', hours: 57.6, rate: 10900, amount: 627840 }
    ],
    notes: 'Payment received via Bank Wire Transfer. Account settled.'
  },
  {
    id: 'inv_1002',
    invoiceNumber: 'INV-2026-002',
    clientName: 'LogiGlobal Freight',
    clientEmail: 'billing@logiglobal.com',
    projectId: 'proj_2',
    projectName: 'Cloud AI Telemetry & Bot Pipeline',
    status: 'Sent',
    issueDate: '2026-08-18',
    dueDate: '2026-09-02',
    paidDate: null,
    subtotal: 1800000,
    taxRate: 10,
    taxAmount: 180000,
    totalAmount: 1980000,
    items: [
      { description: '[AI Bot Pipeline] FastAPI Async Telemetry Stream & AI Predictive Bot Dispatcher', hours: 100, rate: 11300, amount: 1130000 },
      { description: '[Cloud Orchestration] Kubernetes Multi-AZ Cloud Cluster Setup', hours: 57.2, rate: 11700, amount: 670000 }
    ],
    notes: 'Payment pending approval. Standard 15-day billing term via NEFT / RTGS.'
  },
  {
    id: 'inv_1003',
    invoiceNumber: 'INV-2026-003',
    clientName: 'CarePulse Health',
    clientEmail: 'accounts@carepulse.com',
    projectId: 'proj_3',
    projectName: 'Cross-Platform Mobile App Suite',
    status: 'Sent',
    issueDate: '2026-08-15',
    dueDate: '2026-08-30',
    paidDate: null,
    subtotal: 1200000,
    taxRate: 10,
    taxAmount: 120000,
    totalAmount: 1320000,
    items: [
      { description: '[iOS & Android UI] React Native Consultation App UI & Navigation', hours: 120, rate: 10000, amount: 1200000 }
    ],
    notes: 'Payment pending. Due within 15 days via NEFT, RTGS, or Corporate UPI.'
  }
];

export const INITIAL_ACTIVITIES = [
  { id: 'act_1', user: 'Alex Vance (Admin)', action: 'started task stopwatch on:', target: 'React Shopping Cart (Frontend Engineering)', time: '5 mins ago' },
  { id: 'act_2', user: 'Alex Vance (Admin)', action: 'assigned task in Database & DevOps to:', target: 'Priya Sharma', time: '1 hour ago' },
  { id: 'act_3', user: 'Alex Vance (Admin)', action: 'created Full-Stack Service Job:', target: 'Full-Stack E-Commerce Platform', time: 'Yesterday' }
];

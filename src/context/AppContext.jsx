import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  SERVICES_CATALOG,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_TIME_LOGS,
  INITIAL_INVOICES,
  INITIAL_SHOWCASE,
  INITIAL_ACTIVITIES
} from '../data/initialData';
import storageService, { FW_STORAGE_KEYS } from '../services/storageService';
import dbService from '../services/dbService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Active User State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return storageService.getItem(FW_STORAGE_KEYS.AUTHED, false) === true;
  });

  const [users, setUsers] = useState(() => {
    const loaded = storageService.getItem(FW_STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!loaded || !Array.isArray(loaded) || loaded.length === 0) {
      return INITIAL_USERS;
    }
    return INITIAL_USERS.map(initU => {
      const existing = loaded.find(u => u.id === initU.id || u.email.toLowerCase() === initU.email.toLowerCase());
      return existing ? { ...existing, ...initU, avatar: existing.avatar || initU.avatar } : initU;
    });
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const loaded = storageService.getItem(FW_STORAGE_KEYS.CURRENT_USER, null);
    if (!loaded || !loaded.id || !loaded.email) {
      return INITIAL_USERS[0];
    }
    const matching = INITIAL_USERS.find(u => u.id === loaded.id || u.email.toLowerCase() === loaded.email.toLowerCase());
    return matching ? { ...loaded, title: matching.title, subRole: matching.subRole, role: matching.role } : loaded;
  });

  const login = async (email, password) => {
    const authResult = await dbService.authenticateUser(email, password, users);

    if (authResult.success && authResult.user) {
      const user = authResult.user;
      setCurrentUser(user);
      setIsAuthenticated(true);
      storageService.setItem(FW_STORAGE_KEYS.AUTHED, true);
      storageService.setItem(FW_STORAGE_KEYS.CURRENT_USER, user);
      setActivities(prev => [{
        id: `act_${Date.now()}`,
        user: user.name,
        action: 'logged into agency workspace session',
        target: `${user.role.toUpperCase()} Portal`,
        time: 'Just now'
      }, ...prev]);
      return { success: true, user };
    }
    return { success: false, error: authResult.error || 'Invalid email address or password' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    storageService.removeItem(FW_STORAGE_KEYS.AUTHED);
    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: currentUser ? currentUser.name : 'User',
      action: 'logged out of agency workspace',
      target: 'Login Portal',
      time: 'Just now'
    }, ...prev]);
  };

  const switchAccount = (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      setIsAuthenticated(true);
      storageService.setItem(FW_STORAGE_KEYS.AUTHED, true);
      storageService.setItem(FW_STORAGE_KEYS.CURRENT_USER, targetUser);
    }
  };

  // Services Catalog & Active Service State
  const [servicesCatalog] = useState(SERVICES_CATALOG);
  const [selectedServiceId, setSelectedServiceId] = useState('All');

  // Active View Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data Stores
  const [projects, setProjects] = useState(() => {
    return storageService.getItem(FW_STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  });

  const [tasks, setTasks] = useState(() => {
    return storageService.getItem(FW_STORAGE_KEYS.TASKS, INITIAL_TASKS);
  });

  const [timeLogs, setTimeLogs] = useState(() => {
    return storageService.getItem(FW_STORAGE_KEYS.TIME_LOGS, INITIAL_TIME_LOGS);
  });

  const [invoices, setInvoices] = useState(() => {
    return storageService.getItem(FW_STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  });

  const [showcase, setShowcase] = useState(() => {
    return storageService.getItem(FW_STORAGE_KEYS.SHOWCASE, INITIAL_SHOWCASE);
  });

  const [activities, setActivities] = useState(() => {
    return storageService.getItem(FW_STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  });

  // INDIVIDUAL PER-TASK STOPWATCHES MAP
  // Key: taskId -> { isRunning: boolean, elapsedSeconds: number, startTime: number }
  const [taskTimers, setTaskTimers] = useState(() => {
    const defaultTimers = {
      'tsk_100': { isRunning: false, elapsedSeconds: 960, startTime: null },
      'tsk_101': { isRunning: false, elapsedSeconds: 2450, startTime: null },
      'tsk_102': { isRunning: false, elapsedSeconds: 1820, startTime: null },
      'tsk_103': { isRunning: false, elapsedSeconds: 900, startTime: null },
      'tsk_104': { isRunning: false, elapsedSeconds: 0, startTime: null },
      'tsk_301': { isRunning: false, elapsedSeconds: 600, startTime: null },
      'tsk_201': { isRunning: false, elapsedSeconds: 3100, startTime: null }
    };
    return storageService.getItem(FW_STORAGE_KEYS.TASK_TIMERS, defaultTimers);
  });

  // Storage Metrics Diagnostics
  const [storageMetrics, setStorageMetrics] = useState(() => storageService.getStorageMetrics());

  const updateMetrics = () => {
    setStorageMetrics(storageService.getStorageMetrics());
  };

  // AI Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg_1',
      sender: 'bot',
      text: "Hello! I'm Freewheel AI. Admin manages hierarchical tasks layer-by-layer (Service -> Layer -> Specific Task), assigns 9 dev team members, and controls individual task stopwatches.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Persistence Effects
  useEffect(() => {
    dbService.persistEntityToDb('users', users);
    updateMetrics();
  }, [users]);

  useEffect(() => {
    dbService.persistEntityToDb('currentUser', currentUser);
    updateMetrics();
  }, [currentUser]);

  useEffect(() => {
    dbService.persistEntityToDb('projects', projects);
    updateMetrics();
  }, [projects]);

  useEffect(() => {
    dbService.persistEntityToDb('tasks', tasks);
    updateMetrics();
  }, [tasks]);

  useEffect(() => {
    dbService.persistEntityToDb('timeLogs', timeLogs);
    updateMetrics();
  }, [timeLogs]);

  useEffect(() => {
    dbService.persistEntityToDb('invoices', invoices);
    updateMetrics();
  }, [invoices]);

  useEffect(() => {
    dbService.persistEntityToDb('showcase', showcase);
    updateMetrics();
  }, [showcase]);

  useEffect(() => {
    dbService.persistEntityToDb('activities', activities);
    updateMetrics();
  }, [activities]);

  useEffect(() => {
    dbService.persistEntityToDb('taskTimers', taskTimers);
    updateMetrics();
  }, [taskTimers]);

  // Workspace Backup & Storage Management Handlers
  const exportWorkspace = () => {
    return storageService.exportWorkspaceData({
      users,
      projects,
      tasks,
      timeLogs,
      invoices,
      showcase,
      taskTimers,
      activities
    });
  };

  const importWorkspace = (jsonString) => {
    const res = storageService.importWorkspaceData(jsonString);
    if (res.success && res.importedData) {
      const data = res.importedData;
      if (data.users) setUsers(data.users);
      if (data.projects) setProjects(data.projects);
      if (data.tasks) setTasks(data.tasks);
      if (data.timeLogs) setTimeLogs(data.timeLogs);
      if (data.invoices) setInvoices(data.invoices);
      if (data.showcase) setShowcase(data.showcase);
      if (data.taskTimers) setTaskTimers(data.taskTimers);
      if (data.activities) setActivities(data.activities);
      updateMetrics();
    }
    return res;
  };

  const resetWorkspace = () => {
    storageService.resetStorage();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setTimeLogs(INITIAL_TIME_LOGS);
    setInvoices(INITIAL_INVOICES);
    setShowcase(INITIAL_SHOWCASE);
    setActivities(INITIAL_ACTIVITIES);
    setTaskTimers({
      'tsk_100': { isRunning: false, elapsedSeconds: 960, startTime: null },
      'tsk_101': { isRunning: false, elapsedSeconds: 2450, startTime: null },
      'tsk_102': { isRunning: false, elapsedSeconds: 1820, startTime: null },
      'tsk_103': { isRunning: false, elapsedSeconds: 900, startTime: null },
      'tsk_104': { isRunning: false, elapsedSeconds: 0, startTime: null },
      'tsk_301': { isRunning: false, elapsedSeconds: 600, startTime: null },
      'tsk_201': { isRunning: false, elapsedSeconds: 3100, startTime: null }
    });
    updateMetrics();
  };

  // INDIVIDUAL TASK TIMERS TICKER EFFECT
  useEffect(() => {
    const activeTaskIds = Object.keys(taskTimers).filter(id => taskTimers[id]?.isRunning);

    if (activeTaskIds.length === 0) return;

    const interval = setInterval(() => {
      setTaskTimers(prev => {
        const next = { ...prev };
        activeTaskIds.forEach(taskId => {
          if (next[taskId] && next[taskId].isRunning) {
            next[taskId] = {
              ...next[taskId],
              elapsedSeconds: (next[taskId].elapsedSeconds || 0) + 1
            };
          }
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [taskTimers]);

  // INDIVIDUAL STOPWATCH HANDLERS (ADMIN ONLY GUARD)
  const startTaskTimer = (taskId) => {
    if (currentUser.role !== 'admin') {
      alert("Only Agency Admin can start or control individual task stopwatches!");
      return;
    }

    setTaskTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        isRunning: true,
        startTime: prev[taskId]?.startTime || Date.now(),
        elapsedSeconds: prev[taskId]?.elapsedSeconds || 0
      }
    }));
  };

  const pauseTaskTimer = (taskId) => {
    if (currentUser.role !== 'admin') {
      alert("Only Agency Admin can pause individual task stopwatches!");
      return;
    }

    setTaskTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        isRunning: false
      }
    }));
  };

  const saveTaskTimerLog = (taskId, customNotes = '') => {
    if (currentUser.role !== 'admin') {
      alert("Only Agency Admin can save timer logs!");
      return;
    }

    const timer = taskTimers[taskId];
    if (!timer || timer.elapsedSeconds < 5) return;

    const task = tasks.find(t => t.id === taskId);
    const proj = projects.find(p => p.id === task?.projectId);
    const assignee = users.find(u => u.id === task?.assigneeId);
    const durationMins = Math.max(1, Math.round(timer.elapsedSeconds / 60));

    const newLog = {
      id: `log_${Date.now()}`,
      projectId: task?.projectId || 'proj_1',
      service: task?.service || 'Full-Stack Web Development',
      layer: task?.layer || 'Frontend Engineering',
      projectName: proj ? proj.name : 'Project',
      taskId: taskId,
      taskTitle: task ? task.title : 'Task',
      userId: assignee ? assignee.id : currentUser.id,
      userName: assignee ? assignee.name : currentUser.name,
      durationMinutes: durationMins,
      hourlyRate: proj ? proj.hourlyRate : 125,
      billable: true,
      invoiced: false,
      date: new Date().toISOString().split('T')[0],
      notes: customNotes || `Admin logged ${(durationMins / 60).toFixed(1)} hrs on [${task?.layer}] ${task ? task.title : 'Task'}`
    };

    setTimeLogs(prev => [newLog, ...prev]);

    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      loggedHours: +(t.loggedHours + (durationMins / 60)).toFixed(1)
    } : t));

    setTaskTimers(prev => ({
      ...prev,
      [taskId]: { isRunning: false, elapsedSeconds: 0, startTime: null }
    }));

    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: `logged ${(durationMins / 60).toFixed(1)} hrs on task:`,
      target: task ? task.title : 'Task',
      time: 'Just now'
    }, ...prev]);
  };

  // User Management & Custom Profile Handlers (Devs & Admin)
  const addUser = async (userData) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      role: 'dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      hourlyRate: 10500,
      specialization: 'Web Development',
      subRole: 'Frontend',
      password: 'dev123',
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
    await dbService.createUser(newUser);
    return newUser;
  };

  const updateUser = (userId, updatedFields) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    
    // If updating currently logged in user, synchronize currentUser state
    if (currentUser && currentUser.id === userId) {
      const updatedCurrent = { ...currentUser, ...updatedFields };
      setCurrentUser(updatedCurrent);
      storageService.setItem(FW_STORAGE_KEYS.CURRENT_USER, updatedCurrent);
    }

    // Sync password updates with DB backend
    if (updatedFields.password || updatedFields.password_hash) {
      const newPass = updatedFields.password || updatedFields.password_hash;
      dbService.changePassword(userId, newPass);
    }
  };

  const deleteUser = async (userId) => {
    if (users.length <= 1) return;
    setUsers(prev => prev.filter(u => u.id !== userId));
    await dbService.deleteUser(userId);
  };

  // Job & Project Creation Handlers
  const addProject = (projectData) => {
    const newProj = {
      id: `proj_${Date.now()}`,
      completionPercentage: 0,
      service: projectData.service || 'Full-Stack Web Development',
      assignedDevs: projectData.assignedDevs || {},
      ...projectData
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const updateProject = (id, updatedFields) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const addTask = (taskData) => {
    const newTaskId = `tsk_${Date.now()}`;
    const newTask = {
      id: newTaskId,
      loggedHours: 0,
      status: 'Backlog',
      service: taskData.service || 'Full-Stack Web Development',
      layer: taskData.layer || 'Frontend Engineering',
      ...taskData
    };

    setTasks(prev => [newTask, ...prev]);

    setTaskTimers(prev => ({
      ...prev,
      [newTaskId]: { isRunning: false, elapsedSeconds: 0, startTime: null }
    }));
  };

  // Dynamic Project Completion Calculation Helper
  const recalculateProjects = (currentTasks, currentProjects) => {
    return currentProjects.map(proj => {
      const projTasks = currentTasks.filter(t => t.projectId === proj.id);
      if (!projTasks.length) return proj;
      const avgProgress = Math.round(
        projTasks.reduce((sum, t) => sum + (t.progress !== undefined ? t.progress : 0), 0) / projTasks.length
      );
      const isAllDone = avgProgress === 100;
      return {
        ...proj,
        completionPercentage: avgProgress,
        status: isAllDone ? 'Completed' : (avgProgress > 0 ? 'In Progress' : proj.status)
      };
    });
  };

  // Admin marks all tasks for a specific project as 100% and approves
  const approveAllTasksForProject = (projectId) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(t => {
        if (t.projectId === projectId) {
          return {
            ...t,
            progress: 100,
            pendingProgress: 100,
            pendingApproval: false,
            status: 'Done'
          };
        }
        return t;
      });
      setProjects(prevProjects => recalculateProjects(newTasks, prevProjects));
      return newTasks;
    });

    const proj = projects.find(p => p.id === projectId);
    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: 'marked all sub-tasks as 100% completed & approved for project:',
      target: proj ? proj.name : 'Project',
      time: 'Just now'
    }, ...prev]);
  };

  // Admin closes & archives completed project
  const closeAndArchiveProject = (projectId) => {
    const targetProject = projects.find(p => p.id === projectId);
    const projectTasks = tasks.filter(t => t.projectId === projectId);

    if (targetProject) {
      const historyItem = {
        id: `hist_${Date.now()}`,
        title: targetProject.name,
        client: targetProject.clientName,
        service: targetProject.service,
        completionDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        finalBilled: targetProject.budget,
        totalLoggedHours: projectTasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0) || 72,
        hourlyRate: targetProject.hourlyRate,
        summary: targetProject.description || 'Completed project deliverables fully audited and archived.',
        metrics: [
          { label: 'Completion', value: '100% Verified' },
          { label: 'Tasks Audited', value: `${projectTasks.length} Deliverables` },
          { label: 'SLA Status', value: 'On-Time Handover' }
        ],
        techStack: targetProject.tags || ['Engineering', 'Architecture'],
        layerBreakdown: projectTasks.map(t => ({
          layer: t.layer,
          hours: t.loggedHours || 12,
          dev: t.assigneeName
        })),
        deliverables: projectTasks.map(t => t.title)
      };

      // 1. Add pure information record to History
      setShowcase(prev => [historyItem, ...prev]);

      // 2. Mark project status as Completed and Archived
      setProjects(prevProjects => prevProjects.map(p => p.id === projectId ? { ...p, status: 'Completed', archived: true, completionPercentage: 100 } : p));

      // 3. PERMANENTLY REMOVE TASKS FROM ACTIVE TASKS BOARD (NOT JUST HIDE)
      setTasks(prevTasks => prevTasks.filter(t => t.projectId !== projectId));

      setActivities(prev => [{
        id: `act_${Date.now()}`,
        user: `${currentUser.name} (Admin)`,
        action: 'permanently closed project, removed tasks from board, and archived audit data to history:',
        target: targetProject.name,
        time: 'Just now'
      }, ...prev]);
    }
  };

  // Sync project completion percentages with tasks on initial load & task changes
  useEffect(() => {
    setProjects(prevProjects => recalculateProjects(tasks, prevProjects));
  }, [tasks]);

  const updateTaskAssignee = (taskId, newAssigneeId) => {
    const assignee = users.find(u => u.id === newAssigneeId);
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      assigneeId: newAssigneeId,
      assigneeName: assignee ? assignee.name : 'Unassigned'
    } : t));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(t => {
        if (t.id === taskId) {
          const newProg = newStatus === 'Done' ? 100 : (newStatus === 'In Review' ? 85 : (newStatus === 'In Progress' ? Math.max(t.progress || 0, 30) : 0));
          return { ...t, status: newStatus, progress: newProg, pendingProgress: newProg, pendingApproval: false };
        }
        return t;
      });
      setProjects(prevProjects => recalculateProjects(newTasks, prevProjects));
      return newTasks;
    });
  };

  // Developer progress update request (Dev changes slider / status)
  const updateTaskProgressRequest = (taskId, newProgress) => {
    const progressVal = Number(newProgress);
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(t => {
        if (t.id === taskId) {
          if (currentUser.role === 'admin') {
            // Admin directly approves & saves
            const newStatus = progressVal === 100 ? 'Done' : (progressVal > 0 ? 'In Progress' : 'To Do');
            return {
              ...t,
              progress: progressVal,
              pendingProgress: progressVal,
              pendingApproval: false,
              status: newStatus
            };
          } else {
            // Dev requests progress update (Pending Admin Approval)
            return {
              ...t,
              pendingProgress: progressVal,
              pendingApproval: true
            };
          }
        }
        return t;
      });
      setProjects(prevProjects => recalculateProjects(newTasks, prevProjects));
      return newTasks;
    });

    const targetTask = tasks.find(t => t.id === taskId);
    if (currentUser.role !== 'admin') {
      setActivities(prev => [{
        id: `act_${Date.now()}`,
        user: currentUser.name,
        action: `requested ${progressVal}% progress update on task:`,
        target: targetTask ? targetTask.title : 'Task',
        time: 'Just now'
      }, ...prev]);
    }
  };

  // Admin saves and approves task progress
  const approveTaskProgress = (taskId, customApprovedProgress) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(t => {
        if (t.id === taskId) {
          const approvedVal = customApprovedProgress !== undefined ? Number(customApprovedProgress) : t.pendingProgress;
          const newStatus = approvedVal === 100 ? 'Done' : (approvedVal > 0 ? 'In Progress' : 'To Do');
          return {
            ...t,
            progress: approvedVal,
            pendingProgress: approvedVal,
            pendingApproval: false,
            status: newStatus
          };
        }
        return t;
      });
      setProjects(prevProjects => recalculateProjects(newTasks, prevProjects));
      return newTasks;
    });

    const targetTask = tasks.find(t => t.id === taskId);
    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: `saved & approved task progress update:`,
      target: targetTask ? `${targetTask.title} (${customApprovedProgress !== undefined ? customApprovedProgress : targetTask.pendingProgress}%)` : 'Task',
      time: 'Just now'
    }, ...prev]);
  };

  // Admin batch saves and approves all pending progress requests
  const approveAllPendingProgress = () => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(t => {
        if (t.pendingApproval) {
          const approvedVal = t.pendingProgress;
          const newStatus = approvedVal === 100 ? 'Done' : (approvedVal > 0 ? 'In Progress' : 'To Do');
          return {
            ...t,
            progress: approvedVal,
            pendingProgress: approvedVal,
            pendingApproval: false,
            status: newStatus
          };
        }
        return t;
      });
      setProjects(prevProjects => recalculateProjects(newTasks, prevProjects));
      return newTasks;
    });

    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: 'saved & approved all pending developer progress updates',
      target: 'Project Tasks Board',
      time: 'Just now'
    }, ...prev]);
  };

  const addTimeLog = (logData) => {
    const proj = projects.find(p => p.id === logData.projectId);
    const newLog = {
      id: `log_${Date.now()}`,
      projectName: proj ? proj.name : 'Project',
      service: proj ? proj.service : 'Full-Stack Web Development',
      hourlyRate: proj ? proj.hourlyRate : 125,
      billable: true,
      invoiced: false,
      date: new Date().toISOString().split('T')[0],
      ...logData
    };
    setTimeLogs(prev => [newLog, ...prev]);
  };

  const createInvoiceFromTimeLogs = (projectId) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return null;

    const unbilledLogs = timeLogs.filter(l => l.projectId === projectId && l.billable && !l.invoiced);

    let items = [];

    if (unbilledLogs.length > 0) {
      // MODE 1: Generate from actual time logs
      items = unbilledLogs.map(l => {
        const hours = +(l.durationMinutes / 60).toFixed(2);
        const amount = hours * l.hourlyRate;
        return {
          description: `[${l.layer || 'Dev'}] ${l.taskTitle || 'Deliverable'} - ${l.notes || 'Engineering work'}`,
          hours,
          rate: l.hourlyRate,
          amount
        };
      });
    } else {
      // MODE 2: Generate direct project-based invoice from budget & assigned tasks
      const projectTasks = tasks.filter(t => t.projectId === projectId);

      if (projectTasks.length > 0) {
        // Generate line items from project tasks
        items = projectTasks.map(t => {
          const hours = t.estimatedHours || 10;
          const rate = proj.hourlyRate || 11300;
          return {
            description: `[${t.layer || 'Development'}] ${t.title}`,
            hours,
            rate,
            amount: hours * rate
          };
        });
      } else {
        // No tasks either — generate a single line item from project budget
        const budget = proj.budget || 500000;
        items = [{
          description: `${proj.service || 'Development'} — ${proj.name} (Project Scope)`,
          hours: Math.round(budget / (proj.hourlyRate || 11300)),
          rate: proj.hourlyRate || 11300,
          amount: budget
        }];
      }
    }

    const subtotal = items.reduce((acc, i) => acc + i.amount, 0);
    const taxRate = 10;
    const taxAmount = +(subtotal * 0.10).toFixed(2);
    const totalAmount = +(subtotal + taxAmount).toFixed(2);

    const invoiceId = `inv_${Date.now()}`;
    const newInvoice = {
      id: invoiceId,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: proj.clientName || 'Client Partner',
      clientEmail: `billing@${(proj.clientName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      projectId: projectId,
      projectName: proj.name || 'Project',
      status: 'Sent',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paidDate: null,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      items,
      notes: 'Payment due within 14 days of invoice issue via NEFT, RTGS, or Corporate UPI.'
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Mark time logs as invoiced if they were used
    if (unbilledLogs.length > 0) {
      const logIdsToMark = unbilledLogs.map(l => l.id);
      setTimeLogs(prev => prev.map(l => logIdsToMark.includes(l.id) ? { ...l, invoiced: true, invoiceId } : l));
    }

    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: `generated invoice ${newInvoice.invoiceNumber} (₹${totalAmount.toLocaleString('en-IN')}) for:`,
      target: proj.name,
      time: 'Just now'
    }, ...prev]);

    return newInvoice;
  };

  const updateInvoiceStatus = (id, newStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? {
      ...inv,
      status: newStatus,
      paidDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : inv.paidDate
    } : inv));
  };

  // Admin fully updates invoice fields
  const updateInvoice = (id, updatedFields) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const updated = { ...inv, ...updatedFields };
        // Recalculate totals if items changed
        if (updatedFields.items) {
          updated.subtotal = updatedFields.items.reduce((acc, i) => acc + (i.amount || 0), 0);
          updated.taxAmount = +(updated.subtotal * (updated.taxRate || 10) / 100).toFixed(2);
          updated.totalAmount = +(updated.subtotal + updated.taxAmount).toFixed(2);
        }
        return updated;
      }
      return inv;
    }));

    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: 'edited and updated invoice:',
      target: invoices.find(i => i.id === id)?.invoiceNumber || 'Invoice',
      time: 'Just now'
    }, ...prev]);
  };

  // Admin deletes an invoice
  const deleteInvoice = (id) => {
    const target = invoices.find(i => i.id === id);
    setInvoices(prev => prev.filter(inv => inv.id !== id));

    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: 'permanently deleted invoice:',
      target: target?.invoiceNumber || 'Invoice',
      time: 'Just now'
    }, ...prev]);
  };

  const sendChatMessage = (userText) => {
    const userMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let botResponse = "I've analyzed your query. ";
      const textLower = userText.toLowerCase();

      if (textLower.includes('service') || textLower.includes('hierarch')) {
        botResponse += `Freewheel provides 3 primary services: Full-Stack Web Development, App Development, and AI & Cloud Automation. Each service expands into sub-service layers (e.g. Frontend, Backend, Database, QA) with layer-by-layer task stopwatches.`;
      } else if (textLower.includes('admin') || textLower.includes('stopwatch')) {
        botResponse += `The Agency Admin has exclusive access controls to assign tasks layer-by-layer across the 9 dev team members and manage individual task stopwatches.`;
      } else {
        botResponse += `As your Freewheel agentic assistant, I can help you navigate hierarchical service layers, review dev role assignments, or inspect active task stopwatches.`;
      }

      const botMsg = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      switchAccount,
      users,
      addUser,
      updateUser,
      deleteUser,
      currentUser,
      setCurrentUser,
      servicesCatalog,
      selectedServiceId,
      setSelectedServiceId,
      activeTab,
      setActiveTab,
      projects,
      addProject,
      updateProject,
      closeAndArchiveProject,
      tasks,
      addTask,
      updateTaskAssignee,
      updateTaskStatus,
      updateTaskProgressRequest,
      approveTaskProgress,
      approveAllPendingProgress,
      timeLogs,
      addTimeLog,
      taskTimers,
      startTaskTimer,
      pauseTaskTimer,
      saveTaskTimerLog,
      invoices,
      createInvoiceFromTimeLogs,
      updateInvoiceStatus,
      updateInvoice,
      deleteInvoice,
      showcase,
      activities,
      chatMessages,
      sendChatMessage,
      storageMetrics,
      exportWorkspace,
      importWorkspace,
      resetWorkspace
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_SUB_ROLES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_TIME_LOGS,
  INITIAL_INVOICES,
  INITIAL_SHOWCASE,
  INITIAL_ACTIVITIES
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 9-Member Dev Team & Active User State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('fw_users_v3');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fw_user_v3');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default: Alex Vance (Admin)
  });

  // Job Categories & Sub-Role Layers
  const [categories] = useState(INITIAL_CATEGORIES);
  const [subRoles] = useState(INITIAL_SUB_ROLES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubRole, setSelectedSubRole] = useState('All');

  // Active View Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data Stores
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('fw_projects_v3');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('fw_tasks_v3');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [timeLogs, setTimeLogs] = useState(() => {
    const saved = localStorage.getItem('fw_timelogs_v3');
    return saved ? JSON.parse(saved) : INITIAL_TIME_LOGS;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('fw_invoices_v3');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [showcase] = useState(INITIAL_SHOWCASE);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // INDIVIDUAL PER-TASK / PER-PROJECT STOPWATCHES MAP
  // Key: taskId -> { isRunning: boolean, elapsedSeconds: number, startTime: number }
  const [taskTimers, setTaskTimers] = useState(() => {
    const saved = localStorage.getItem('fw_task_timers_v3');
    if (saved) return JSON.parse(saved);
    // Initialize default timer states for sample tasks
    return {
      'tsk_101': { isRunning: false, elapsedSeconds: 2450, startTime: null },
      'tsk_102': { isRunning: false, elapsedSeconds: 1820, startTime: null },
      'tsk_103': { isRunning: false, elapsedSeconds: 900, startTime: null },
      'tsk_104': { isRunning: false, elapsedSeconds: 0, startTime: null },
      'tsk_201': { isRunning: false, elapsedSeconds: 3100, startTime: null }
    };
  });

  // AI Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg_1',
      sender: 'bot',
      text: "Hello! I'm Freewheel AI. Each project and task has its own individual stopwatch. Admin can manage stopwatches and assign 9 team devs across Frontend, Backend, Database, and QA roles.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('fw_users_v3', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('fw_user_v3', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fw_projects_v3', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('fw_tasks_v3', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('fw_timelogs_v3', JSON.stringify(timeLogs));
  }, [timeLogs]);

  useEffect(() => {
    localStorage.setItem('fw_invoices_v3', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('fw_task_timers_v3', JSON.stringify(taskTimers));
  }, [taskTimers]);

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
      category: proj ? proj.category : 'Full-Stack Web App',
      subRole: task ? task.subRole : 'Frontend',
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
      notes: customNotes || `Admin logged ${(durationMins / 60).toFixed(1)} hrs on ${task ? task.title : 'Task'}`
    };

    setTimeLogs(prev => [newLog, ...prev]);

    // Update logged hours on task
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      loggedHours: +(t.loggedHours + (durationMins / 60)).toFixed(1)
    } : t));

    // Reset individual task timer
    setTaskTimers(prev => ({
      ...prev,
      [taskId]: { isRunning: false, elapsedSeconds: 0, startTime: null }
    }));

    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: `logged ${(durationMins / 60).toFixed(1)} hrs on individual task:`,
      target: task ? task.title : 'Task',
      time: 'Just now'
    }, ...prev]);
  };

  // User Management Handlers (Admin Only)
  const addUser = (userData) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      role: 'dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      hourlyRate: 120,
      specialization: 'Full-Stack Web App',
      subRole: 'Frontend',
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (userId, updatedFields) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
  };

  const deleteUser = (userId) => {
    if (users.length <= 1) return;
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Job & Project Creation Handlers
  const addProject = (projectData) => {
    const newProj = {
      id: `proj_${Date.now()}`,
      completionPercentage: 0,
      category: projectData.category || 'Full-Stack Web App',
      assignedDevs: projectData.assignedDevs || {
        'Frontend': [],
        'Backend': [],
        'Database & DevOps': [],
        'QA & Automation': []
      },
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
      category: taskData.category || 'Full-Stack Web App',
      subRole: taskData.subRole || 'Frontend',
      ...taskData
    };

    setTasks(prev => [newTask, ...prev]);

    // Initialize individual stopwatch state for new task
    setTaskTimers(prev => ({
      ...prev,
      [newTaskId]: { isRunning: false, elapsedSeconds: 0, startTime: null }
    }));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const addTimeLog = (logData) => {
    const proj = projects.find(p => p.id === logData.projectId);
    const newLog = {
      id: `log_${Date.now()}`,
      projectName: proj ? proj.name : 'Project',
      category: proj ? proj.category : 'Full-Stack Web App',
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
    const unbilledLogs = timeLogs.filter(l => l.projectId === projectId && l.billable && !l.invoiced);

    if (unbilledLogs.length === 0) return null;

    const items = unbilledLogs.map(l => {
      const hours = +(l.durationMinutes / 60).toFixed(2);
      const amount = hours * l.hourlyRate;
      return {
        description: `[${l.subRole || 'Dev'}] ${l.taskTitle || 'Deliverable'} - ${l.notes || 'Engineering work'}`,
        hours,
        rate: l.hourlyRate,
        amount
      };
    });

    const subtotal = items.reduce((acc, i) => acc + i.amount, 0);
    const taxRate = 10;
    const taxAmount = +(subtotal * 0.10).toFixed(2);
    const totalAmount = +(subtotal + taxAmount).toFixed(2);

    const invoiceId = `inv_${Date.now()}`;
    const newInvoice = {
      id: invoiceId,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: proj ? proj.clientName : 'Client Partner',
      clientEmail: 'contact@partner.com',
      projectId: projectId,
      projectName: proj ? proj.name : 'Project',
      status: 'Sent',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paidDate: null,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      items,
      notes: 'Payment due within 14 days of invoice issue.'
    };

    setInvoices(prev => [newInvoice, ...prev]);

    const logIdsToMark = unbilledLogs.map(l => l.id);
    setTimeLogs(prev => prev.map(l => logIdsToMark.includes(l.id) ? { ...l, invoiced: true, invoiceId } : l));

    return newInvoice;
  };

  const updateInvoiceStatus = (id, newStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? {
      ...inv,
      status: newStatus,
      paidDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : inv.paidDate
    } : inv));
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

      if (textLower.includes('timer') || textLower.includes('stopwatch')) {
        const activeTimersCount = Object.keys(taskTimers).filter(id => taskTimers[id]?.isRunning).length;
        botResponse += `Every project and task has its own individual stopwatch. Currently ${activeTimersCount} task stopwatch(es) are actively recording time under Admin control.`;
      } else if (textLower.includes('team') || textLower.includes('dev') || textLower.includes('role')) {
        botResponse += `Your 9-member dev team (Sarah, Marcus, David, Priya, James, Elena, Carlos, Ananya, and Alex) can be assigned to Frontend, Backend, Database & DevOps, or QA roles for every full-stack project.`;
      } else {
        botResponse += `As your Freewheel AI copilot, I can help summarize individual project stopwatches, check sub-role dev assignments, or review unbilled time logs.`;
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
      users,
      addUser,
      updateUser,
      deleteUser,
      currentUser,
      setCurrentUser,
      categories,
      subRoles,
      selectedCategory,
      setSelectedCategory,
      selectedSubRole,
      setSelectedSubRole,
      activeTab,
      setActiveTab,
      projects,
      addProject,
      updateProject,
      tasks,
      addTask,
      updateTaskStatus,
      timeLogs,
      addTimeLog,
      taskTimers,
      startTaskTimer,
      pauseTaskTimer,
      saveTaskTimerLog,
      invoices,
      createInvoiceFromTimeLogs,
      updateInvoiceStatus,
      showcase,
      activities,
      chatMessages,
      sendChatMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

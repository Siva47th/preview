import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_TIME_LOGS,
  INITIAL_INVOICES,
  INITIAL_SHOWCASE,
  INITIAL_ACTIVITIES
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Users List & Current User State (Admin & Devs only)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('fw_users_v2');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fw_user_v2');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default: Alex Vance (Admin)
  });

  // Categories Menu State
  const [categories] = useState(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data Stores
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('fw_projects_v2');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('fw_tasks_v2');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [timeLogs, setTimeLogs] = useState(() => {
    const saved = localStorage.getItem('fw_timelogs_v2');
    return saved ? JSON.parse(saved) : INITIAL_TIME_LOGS;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('fw_invoices_v2');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [showcase] = useState(INITIAL_SHOWCASE);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Active Stopwatch State
  const [activeTimer, setActiveTimer] = useState(() => {
    const saved = localStorage.getItem('fw_active_timer_v2');
    return saved ? JSON.parse(saved) : {
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      projectId: 'proj_1',
      taskId: 'tsk_101',
      notes: ''
    };
  });

  // AI Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg_1',
      sender: 'bot',
      text: "Hello! I'm Freewheel AI. Admin controls stopwatch timing, job creation, and dev role assignments across Web Development, Automation, and App Development fields.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('fw_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('fw_user_v2', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fw_projects_v2', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('fw_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('fw_timelogs_v2', JSON.stringify(timeLogs));
  }, [timeLogs]);

  useEffect(() => {
    localStorage.setItem('fw_invoices_v2', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('fw_active_timer_v2', JSON.stringify(activeTimer));
  }, [activeTimer]);

  // Live Timer Ticker Effect
  useEffect(() => {
    let interval = null;
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer.isRunning]);

  // Timer Control Handlers (ADMIN ONLY GUARD)
  const startTimer = (projectId, taskId, notes = '') => {
    if (currentUser.role !== 'admin') {
      alert("Only Agency Admin can start or control the stopwatch facilities!");
      return;
    }

    setActiveTimer({
      isRunning: true,
      startTime: Date.now(),
      elapsedSeconds: activeTimer.elapsedSeconds || 0,
      projectId: projectId || activeTimer.projectId,
      taskId: taskId || activeTimer.taskId,
      notes
    });
  };

  const pauseTimer = () => {
    if (currentUser.role !== 'admin') {
      alert("Only Agency Admin can pause or control the stopwatch facilities!");
      return;
    }
    setActiveTimer(prev => ({ ...prev, isRunning: false }));
  };

  const stopAndSaveTimer = () => {
    if (currentUser.role !== 'admin') {
      alert("Only Agency Admin can save or stop the stopwatch facilities!");
      return;
    }

    if (activeTimer.elapsedSeconds < 10) {
      setActiveTimer({ isRunning: false, startTime: null, elapsedSeconds: 0, projectId: 'proj_1', taskId: 'tsk_101', notes: '' });
      return;
    }

    const proj = projects.find(p => p.id === activeTimer.projectId);
    const task = tasks.find(t => t.id === activeTimer.taskId);
    const durationMins = Math.max(1, Math.round(activeTimer.elapsedSeconds / 60));

    const newLog = {
      id: `log_${Date.now()}`,
      projectId: activeTimer.projectId,
      category: proj ? proj.category : 'Web Development',
      projectName: proj ? proj.name : 'Unassigned Project',
      taskId: activeTimer.taskId,
      taskTitle: task ? task.title : 'General Work',
      userId: currentUser.id,
      userName: currentUser.name,
      durationMinutes: durationMins,
      hourlyRate: proj ? proj.hourlyRate : 125,
      billable: true,
      invoiced: false,
      date: new Date().toISOString().split('T')[0],
      notes: activeTimer.notes || 'Admin tracked stopwatch entry'
    };

    setTimeLogs(prev => [newLog, ...prev]);

    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: `logged ${(durationMins / 60).toFixed(1)} hrs on`,
      target: proj ? proj.name : 'Project',
      time: 'Just now'
    }, ...prev]);

    setActiveTimer({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      projectId: 'proj_1',
      taskId: 'tsk_101',
      notes: ''
    });
  };

  // User Management Handlers (Admin Only)
  const addUser = (userData) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      role: 'dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      hourlyRate: 120,
      specialization: 'Web Development',
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

  // Project & Job Handlers (Admin Creates & Assigns Devs)
  const addProject = (projectData) => {
    const newProj = {
      id: `proj_${Date.now()}`,
      completionPercentage: 0,
      category: projectData.category || 'Web Development',
      assignedDevIds: projectData.assignedDevIds || [],
      ...projectData
    };
    setProjects(prev => [newProj, ...prev]);

    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: `${currentUser.name} (Admin)`,
      action: `created job in ${newProj.category}:`,
      target: newProj.name,
      time: 'Just now'
    }, ...prev]);
  };

  const updateProject = (id, updatedFields) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const addTask = (taskData) => {
    const newTask = {
      id: `tsk_${Date.now()}`,
      loggedHours: 0,
      status: 'Backlog',
      category: taskData.category || 'Web Development',
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const addTimeLog = (logData) => {
    const proj = projects.find(p => p.id === logData.projectId);
    const newLog = {
      id: `log_${Date.now()}`,
      projectName: proj ? proj.name : 'Project',
      category: proj ? proj.category : 'Web Development',
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
        description: `${l.taskTitle || 'Deliverable'} - ${l.notes || 'Engineering work'}`,
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

  // AI Assistant Chatbot
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

      if (textLower.includes('unbilled') || textLower.includes('hours')) {
        const unbilled = timeLogs.filter(l => l.billable && !l.invoiced);
        const totalUnbilledHrs = unbilled.reduce((acc, l) => acc + (l.durationMinutes / 60), 0);
        const totalUnbilledVal = unbilled.reduce((acc, l) => acc + ((l.durationMinutes / 60) * l.hourlyRate), 0);
        botResponse += `You currently have ${totalUnbilledHrs.toFixed(1)} unbilled hours worth $${totalUnbilledVal.toLocaleString()} across Web Development, Automation, and App Development fields.`;
      } else if (textLower.includes('admin') || textLower.includes('role')) {
        botResponse += `Admin (Alex Vance) has exclusive control over stopwatch timing, job creation, and developer role assignments across all three fields.`;
      } else if (textLower.includes('category') || textLower.includes('field')) {
        botResponse += `Available job categories: Web Development, Automation, and App Development. Developers can be assigned specifically by the Admin to each field.`;
      } else {
        botResponse += `As your Freewheel agentic assistant, I can help you summarize billable hours, review project categories, check developer assignments, or inspect invoice ledgers.`;
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
      selectedCategory,
      setSelectedCategory,
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
      activeTimer,
      startTimer,
      pauseTimer,
      stopAndSaveTimer,
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

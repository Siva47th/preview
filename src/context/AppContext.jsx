import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_TIME_LOGS,
  INITIAL_INVOICES,
  INITIAL_SHOWCASE,
  INITIAL_ACTIVITIES
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User & Auth Role
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fw_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  // Current Navigation View
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data Stores
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('fw_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('fw_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [timeLogs, setTimeLogs] = useState(() => {
    const saved = localStorage.getItem('fw_timelogs');
    return saved ? JSON.parse(saved) : INITIAL_TIME_LOGS;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('fw_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [showcase, setShowcase] = useState(INITIAL_SHOWCASE);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Active Live Stopwatch State
  const [activeTimer, setActiveTimer] = useState(() => {
    const saved = localStorage.getItem('fw_active_timer');
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
      text: "Hello! I'm Freewheel AI, your agency copilot. Ask me to summarize unbilled project hours, check task statuses, or draft project proposals!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Persist State Updates
  useEffect(() => {
    localStorage.setItem('fw_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fw_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('fw_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('fw_timelogs', JSON.stringify(timeLogs));
  }, [timeLogs]);

  useEffect(() => {
    localStorage.setItem('fw_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('fw_active_timer', JSON.stringify(activeTimer));
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

  // Timer Control Functions
  const startTimer = (projectId, taskId, notes = '') => {
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
    setActiveTimer(prev => ({ ...prev, isRunning: false }));
  };

  const stopAndSaveTimer = () => {
    if (activeTimer.elapsedSeconds < 10) {
      // Discard tiny logs
      setActiveTimer({ isRunning: false, startTime: null, elapsedSeconds: 0, projectId: 'proj_1', taskId: 'tsk_101', notes: '' });
      return;
    }

    const proj = projects.find(p => p.id === activeTimer.projectId);
    const task = tasks.find(t => t.id === activeTimer.taskId);
    const durationMins = Math.max(1, Math.round(activeTimer.elapsedSeconds / 60));

    const newLog = {
      id: `log_${Date.now()}`,
      projectId: activeTimer.projectId,
      projectName: proj ? proj.name : 'Unassigned Project',
      taskId: activeTimer.taskId,
      taskTitle: task ? task.title : 'General Work',
      userId: currentUser.id,
      userName: currentUser.name,
      durationMinutes: durationMins,
      hourlyRate: proj ? proj.hourlyRate : 100,
      billable: true,
      invoiced: false,
      date: new Date().toISOString().split('T')[0],
      notes: activeTimer.notes || 'Tracked with live stopwatch timer'
    };

    setTimeLogs(prev => [newLog, ...prev]);
    
    // Add activity
    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: currentUser.name,
      action: `logged ${(durationMins / 60).toFixed(1)} hrs on`,
      target: proj ? proj.name : 'Project',
      time: 'Just now'
    }, ...prev]);

    // Reset timer
    setActiveTimer({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      projectId: 'proj_1',
      taskId: 'tsk_101',
      notes: ''
    });
  };

  // Helper CRUD Handlers
  const addProject = (projectData) => {
    const newProj = {
      id: `proj_${Date.now()}`,
      completionPercentage: 0,
      color: 'from-indigo-500 to-purple-600',
      ...projectData
    };
    setProjects(prev => [newProj, ...prev]);
    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: currentUser.name,
      action: 'created project',
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
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask) {
      setActivities(prev => [{
        id: `act_${Date.now()}`,
        user: currentUser.name,
        action: `updated status to ${newStatus}:`,
        target: targetTask.title,
        time: 'Just now'
      }, ...prev]);
    }
  };

  const addTimeLog = (logData) => {
    const proj = projects.find(p => p.id === logData.projectId);
    const newLog = {
      id: `log_${Date.now()}`,
      projectName: proj ? proj.name : 'Project',
      hourlyRate: proj ? proj.hourlyRate : 100,
      billable: true,
      invoiced: false,
      date: new Date().toISOString().split('T')[0],
      ...logData
    };
    setTimeLogs(prev => [newLog, ...prev]);
  };

  const createInvoiceFromTimeLogs = (projectId, dueDate) => {
    const proj = projects.find(p => p.id === projectId);
    const unbilledLogs = timeLogs.filter(l => l.projectId === projectId && l.billable && !l.invoiced);

    if (unbilledLogs.length === 0) return null;

    const items = unbilledLogs.map(l => {
      const hours = +(l.durationMinutes / 60).toFixed(2);
      const amount = hours * l.hourlyRate;
      return {
        description: `${l.taskTitle || 'Work Log'} - ${l.notes || 'Engineering services'}`,
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
      clientId: proj ? proj.clientId : 'usr_3',
      clientName: proj ? proj.clientName : 'Apex Corporation',
      clientEmail: 'contact@apexcorp.com',
      projectId: projectId,
      projectName: proj ? proj.name : 'Project',
      status: 'Sent',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paidDate: null,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      items,
      notes: 'Payment due within 14 days of invoice issue.'
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Mark logs as invoiced
    const logIdsToMark = unbilledLogs.map(l => l.id);
    setTimeLogs(prev => prev.map(l => logIdsToMark.includes(l.id) ? { ...l, invoiced: true, invoiceId } : l));

    setActivities(prev => [{
      id: `act_${Date.now()}`,
      user: currentUser.name,
      action: 'generated invoice',
      target: `${newInvoice.invoiceNumber} ($${totalAmount.toLocaleString()})`,
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

  // AI Chatbot Helper
  const sendChatMessage = (userText) => {
    const userMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let botResponse = "I've analyzed your request. ";
      const textLower = userText.toLowerCase();

      if (textLower.includes('unbilled') || textLower.includes('hours') || textLower.includes('revenue')) {
        const unbilled = timeLogs.filter(l => l.billable && !l.invoiced);
        const totalUnbilledHrs = unbilled.reduce((acc, l) => acc + (l.durationMinutes / 60), 0);
        const totalUnbilledVal = unbilled.reduce((acc, l) => acc + ((l.durationMinutes / 60) * l.hourlyRate), 0);
        botResponse += `You currently have **${totalUnbilledHrs.toFixed(1)} unbilled hours** worth **$${totalUnbilledVal.toLocaleString()}** ready for invoice generation across ${projects.length} active projects.`;
      } else if (textLower.includes('project') || textLower.includes('status')) {
        botResponse += `There are ${projects.length} active projects. ${projects[0].name} is at ${projects[0].completionPercentage}% completion.`;
      } else if (textLower.includes('task') || textLower.includes('kanban')) {
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        botResponse += `You currently have ${inProgress} tasks in progress. Would you like me to assign more tasks to team members?`;
      } else {
        botResponse += `As your Freewheel agentic assistant, I can help you auto-generate client proposals, summarize logged billable time, check project deadlines, or trigger invoice generation.`;
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
      users: INITIAL_USERS,
      currentUser,
      setCurrentUser,
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

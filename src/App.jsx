import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { ProjectsView } from './views/ProjectsView';
import { TasksView } from './views/TasksView';
import { TimeTrackingView } from './views/TimeTrackingView';
import { InvoicesView } from './views/InvoicesView';
import { ShowcaseView } from './views/ShowcaseView';
import { AdminUsersView } from './views/AdminUsersView';
import { ChatbotWidget } from './views/ChatbotWidget';

const MainContent = () => {
  const { activeTab } = useApp();

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'projects': return <ProjectsView />;
      case 'tasks': return <TasksView />;
      case 'timetracking': return <TimeTrackingView />;
      case 'invoices': return <InvoicesView />;
      case 'adminusers': return <AdminUsersView />;
      case 'showcase': return <ShowcaseView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 pb-16 overflow-y-auto bg-slate-50">
        {renderView()}
      </main>
      <ChatbotWidget />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-600 selection:text-white">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
}

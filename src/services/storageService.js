/**
 * Freewheel Storage Service Architecture
 * 
 * Deployment-ready abstract storage service providing:
 * 1. Safe LocalStorage wrapper with In-Memory fallback for restricted browser contexts (incognito, iframe, webviews).
 * 2. Unified versioned key management (`fw_v1_*`).
 * 3. Legacy storage key migration (`fw_*_v6`, `fw_*_v7` -> `fw_v1_*`).
 * 4. Full Workspace JSON Export & Import (Backup & Restore).
 * 5. Storage metrics & health monitoring for production diagnostics.
 */

export const FW_STORAGE_KEYS = {
  AUTHED: 'fw_v2_authed',
  REMEMBER_ME: 'fw_v2_remember_me',
  USERS: 'fw_v2_users',
  CURRENT_USER: 'fw_v2_user',
  PROJECTS: 'fw_v2_projects',
  TASKS: 'fw_v2_tasks',
  TIME_LOGS: 'fw_v2_timelogs',
  INVOICES: 'fw_v2_invoices',
  SHOWCASE: 'fw_v2_showcase',
  TASK_TIMERS: 'fw_v2_task_timers',
  ACTIVITIES: 'fw_v2_activities',
};

// In-Memory fallback storage for restricted environments (e.g. strict cross-origin iframe sandboxes, disabled cookies)
const memoryStore = {};

/**
 * Checks if window.localStorage is accessible and writable
 */
export const isLocalStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__fw_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Checks if window.sessionStorage is accessible and writable
 */
export const isSessionStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return false;
    const testKey = '__fw_session_test__';
    window.sessionStorage.setItem(testKey, '1');
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const hasLocalStorage = isLocalStorageAvailable();
const hasSessionStorage = isSessionStorageAvailable();

/**
 * Legacy key mapping for seamless migration
 */
const LEGACY_KEY_MAP = {
  [FW_STORAGE_KEYS.AUTHED]: ['fw_authed_v7', 'fw_authed_v6'],
  [FW_STORAGE_KEYS.USERS]: ['fw_users_v7', 'fw_users_v6'],
  [FW_STORAGE_KEYS.CURRENT_USER]: ['fw_user_v7', 'fw_user_v6'],
  [FW_STORAGE_KEYS.PROJECTS]: ['fw_projects_v6'],
  [FW_STORAGE_KEYS.TASKS]: ['fw_tasks_v6'],
  [FW_STORAGE_KEYS.TIME_LOGS]: ['fw_timelogs_v6'],
  [FW_STORAGE_KEYS.INVOICES]: ['fw_invoices_v6'],
  [FW_STORAGE_KEYS.SHOWCASE]: ['fw_showcase_v6'],
  [FW_STORAGE_KEYS.TASK_TIMERS]: ['fw_task_timers_v6'],
};

/**
 * Automatically migrates legacy keys to unified v1 keys if legacy data exists
 */
export const migrateLegacyData = () => {
  if (!hasLocalStorage) return;

  try {
    Object.entries(LEGACY_KEY_MAP).forEach(([newKey, legacyKeys]) => {
      // Check if new key already has data
      const existing = window.localStorage.getItem(newKey);
      if (!existing) {
        for (const oldKey of legacyKeys) {
          const legacyVal = window.localStorage.getItem(oldKey);
          if (legacyVal) {
            window.localStorage.setItem(newKey, legacyVal);
            break;
          }
        }
      }
    });
  } catch (err) {
    console.warn('[StorageService] Legacy migration warning:', err);
  }
};

// Run migration immediately on module load
migrateLegacyData();

/**
 * Safely retrieve an item from storage
 */
export const getItem = (key, defaultValue = null) => {
  try {
    if (hasLocalStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) {
        return JSON.parse(val);
      }
    } else if (memoryStore[key] !== undefined) {
      return JSON.parse(memoryStore[key]);
    }
  } catch (err) {
    console.error(`[StorageService] Error reading key "${key}":`, err);
  }
  return defaultValue;
};

/**
 * Safely save an item to storage
 */
export const setItem = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    if (hasLocalStorage) {
      window.localStorage.setItem(key, serialized);
    } else {
      memoryStore[key] = serialized;
    }
    return true;
  } catch (err) {
    console.error(`[StorageService] Error setting key "${key}":`, err);
    // QuotaExceededError or restriction: fallback to memory store
    try {
      memoryStore[key] = JSON.stringify(value);
    } catch (e) {
      // Ignore memory store failure
    }
    return false;
  }
};

/**
 * Remove an item from storage
 */
export const removeItem = (key) => {
  try {
    if (hasLocalStorage) {
      window.localStorage.removeItem(key);
    }
    delete memoryStore[key];
  } catch (err) {
    console.error(`[StorageService] Error removing key "${key}":`, err);
  }
};

/**
 * Session-based authentication helpers
 * By default, session is retained only while the browser tab/window is open.
 * If rememberMe is true, session persists across browser restarts in localStorage.
 */
export const getAuthSession = () => {
  try {
    // 1. Check active browser tab session first (sessionStorage)
    if (hasSessionStorage) {
      const sessionAuthed = window.sessionStorage.getItem(FW_STORAGE_KEYS.AUTHED);
      if (sessionAuthed === 'true') {
        const sessionUser = window.sessionStorage.getItem(FW_STORAGE_KEYS.CURRENT_USER);
        return {
          isAuthenticated: true,
          currentUser: sessionUser ? JSON.parse(sessionUser) : null,
          isRemembered: false
        };
      }
    }

    // 2. Check localStorage ONLY if Remember Me was explicitly enabled
    if (hasLocalStorage) {
      const isRemembered = window.localStorage.getItem(FW_STORAGE_KEYS.REMEMBER_ME) === 'true';
      const localAuthed = window.localStorage.getItem(FW_STORAGE_KEYS.AUTHED) === 'true';

      if (isRemembered && localAuthed) {
        const localUser = window.localStorage.getItem(FW_STORAGE_KEYS.CURRENT_USER);
        const parsedUser = localUser ? JSON.parse(localUser) : null;
        
        // Also populate current tab's sessionStorage for fast reads
        if (hasSessionStorage) {
          window.sessionStorage.setItem(FW_STORAGE_KEYS.AUTHED, 'true');
          if (parsedUser) {
            window.sessionStorage.setItem(FW_STORAGE_KEYS.CURRENT_USER, JSON.stringify(parsedUser));
          }
        }

        return {
          isAuthenticated: true,
          currentUser: parsedUser,
          isRemembered: true
        };
      } else {
        // Clear any old un-remembered persistent auth flags in localStorage
        window.localStorage.removeItem(FW_STORAGE_KEYS.AUTHED);
        window.localStorage.removeItem(FW_STORAGE_KEYS.REMEMBER_ME);
      }
    } else if (memoryStore[FW_STORAGE_KEYS.AUTHED] === 'true') {
      return {
        isAuthenticated: true,
        currentUser: memoryStore[FW_STORAGE_KEYS.CURRENT_USER] ? JSON.parse(memoryStore[FW_STORAGE_KEYS.CURRENT_USER]) : null,
        isRemembered: false
      };
    }
  } catch (err) {
    console.error('[StorageService] Error getting auth session:', err);
  }

  return {
    isAuthenticated: false,
    currentUser: null,
    isRemembered: false
  };
};

export const saveAuthSession = (user, rememberMe = false) => {
  try {
    const userStr = JSON.stringify(user);

    // Always store in sessionStorage for the active browser session
    if (hasSessionStorage) {
      window.sessionStorage.setItem(FW_STORAGE_KEYS.AUTHED, 'true');
      window.sessionStorage.setItem(FW_STORAGE_KEYS.CURRENT_USER, userStr);
    }

    // If rememberMe is requested, store in localStorage as well
    if (hasLocalStorage) {
      if (rememberMe) {
        window.localStorage.setItem(FW_STORAGE_KEYS.AUTHED, 'true');
        window.localStorage.setItem(FW_STORAGE_KEYS.REMEMBER_ME, 'true');
        window.localStorage.setItem(FW_STORAGE_KEYS.CURRENT_USER, userStr);
      } else {
        window.localStorage.removeItem(FW_STORAGE_KEYS.AUTHED);
        window.localStorage.removeItem(FW_STORAGE_KEYS.REMEMBER_ME);
        window.localStorage.setItem(FW_STORAGE_KEYS.CURRENT_USER, userStr);
      }
    } else {
      memoryStore[FW_STORAGE_KEYS.AUTHED] = 'true';
      memoryStore[FW_STORAGE_KEYS.CURRENT_USER] = userStr;
    }
  } catch (err) {
    console.error('[StorageService] Error saving auth session:', err);
  }
};

export const clearAuthSession = () => {
  try {
    if (hasSessionStorage) {
      window.sessionStorage.removeItem(FW_STORAGE_KEYS.AUTHED);
      window.sessionStorage.removeItem(FW_STORAGE_KEYS.CURRENT_USER);
    }
    if (hasLocalStorage) {
      window.localStorage.removeItem(FW_STORAGE_KEYS.AUTHED);
      window.localStorage.removeItem(FW_STORAGE_KEYS.REMEMBER_ME);
    }
    delete memoryStore[FW_STORAGE_KEYS.AUTHED];
    delete memoryStore[FW_STORAGE_KEYS.CURRENT_USER];
  } catch (err) {
    console.error('[StorageService] Error clearing auth session:', err);
  }
};

/**
 * Export complete workspace state as a JSON object / string
 */
export const exportWorkspaceData = (currentState) => {
  const exportPayload = {
    version: '1.0',
    app: 'Freewheel Agency Platform',
    exportedAt: new Date().toISOString(),
    data: {
      users: currentState.users,
      projects: currentState.projects,
      tasks: currentState.tasks,
      timeLogs: currentState.timeLogs,
      invoices: currentState.invoices,
      showcase: currentState.showcase,
      taskTimers: currentState.taskTimers,
      activities: currentState.activities,
    }
  };
  return JSON.stringify(exportPayload, null, 2);
};

/**
 * Validates and imports a workspace JSON snapshot
 */
export const importWorkspaceData = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.data) {
      return { success: false, error: 'Invalid backup file format. Missing root "data" object.' };
    }
    const data = parsed.data;

    // Batch update storage keys
    if (data.users) setItem(FW_STORAGE_KEYS.USERS, data.users);
    if (data.projects) setItem(FW_STORAGE_KEYS.PROJECTS, data.projects);
    if (data.tasks) setItem(FW_STORAGE_KEYS.TASKS, data.tasks);
    if (data.timeLogs) setItem(FW_STORAGE_KEYS.TIME_LOGS, data.timeLogs);
    if (data.invoices) setItem(FW_STORAGE_KEYS.INVOICES, data.invoices);
    if (data.showcase) setItem(FW_STORAGE_KEYS.SHOWCASE, data.showcase);
    if (data.taskTimers) setItem(FW_STORAGE_KEYS.TASK_TIMERS, data.taskTimers);
    if (data.activities) setItem(FW_STORAGE_KEYS.ACTIVITIES, data.activities);

    return { success: true, importedData: data };
  } catch (err) {
    return { success: false, error: `JSON Parse error: ${err.message}` };
  }
};

/**
 * Clear all Freewheel storage keys
 */
export const resetStorage = () => {
  try {
    clearAuthSession();
    Object.values(FW_STORAGE_KEYS).forEach(key => {
      removeItem(key);
    });
    // Also clean legacy keys
    Object.values(LEGACY_KEY_MAP).flat().forEach(oldKey => {
      if (hasLocalStorage) window.localStorage.removeItem(oldKey);
    });
    return true;
  } catch (err) {
    console.error('[StorageService] Error resetting storage:', err);
    return false;
  }
};

/**
 * Calculate storage metrics (bytes used, item count, engine status)
 */
export const getStorageMetrics = () => {
  let totalBytes = 0;
  let itemCount = 0;
  const itemBreakdown = {};

  try {
    Object.entries(FW_STORAGE_KEYS).forEach(([friendlyName, key]) => {
      let rawVal = null;
      if (hasLocalStorage) {
        rawVal = window.localStorage.getItem(key);
      } else if (memoryStore[key]) {
        rawVal = memoryStore[key];
      }

      if (rawVal) {
        const bytes = new Blob([rawVal]).size;
        totalBytes += bytes;
        itemCount++;
        itemBreakdown[friendlyName] = {
          bytes,
          kb: (bytes / 1024).toFixed(2),
        };
      }
    });
  } catch (err) {
    console.error('[StorageService] Metric calculation error:', err);
  }

  return {
    engine: hasLocalStorage ? 'Browser LocalStorage' : 'In-Memory Store (Restricted Environment)',
    hasLocalStorage,
    hasSessionStorage,
    totalBytes,
    totalKB: (totalBytes / 1024).toFixed(2),
    itemCount,
    itemBreakdown,
    lastSync: new Date().toLocaleTimeString()
  };
};

export const storageService = {
  KEYS: FW_STORAGE_KEYS,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
  migrateLegacyData,
  getItem,
  setItem,
  removeItem,
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  exportWorkspaceData,
  importWorkspaceData,
  resetStorage,
  getStorageMetrics,
};

export default storageService;

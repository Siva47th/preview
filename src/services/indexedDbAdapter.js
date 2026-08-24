/**
 * Freewheel Native IndexedDB Client Adapter
 * 
 * Provides structured browser database storage using IndexedDB.
 */

const DB_NAME = 'FreewheelAgencyDB';
const DB_VERSION = 1;
const STORES = ['users', 'projects', 'tasks', 'timeLogs', 'invoices', 'showcase', 'taskTimers', 'activities'];

export const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this browser environment.'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      STORES.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: false });
        }
      });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const saveToIndexedDB = async (storeName, data) => {
  try {
    const db = await initIndexedDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    // Clear and batch re-insert
    store.clear();
    const items = Array.isArray(data) ? data : [data];
    items.forEach(item => {
      if (item && (item.id || item.taskId)) {
        store.put(item.id ? item : { id: item.taskId, ...item });
      }
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Error writing to store "${storeName}":`, err);
    return false;
  }
};

export const getFromIndexedDB = async (storeName) => {
  try {
    const db = await initIndexedDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Error reading from store "${storeName}":`, err);
    return null;
  }
};

export const indexedDbAdapter = {
  initIndexedDB,
  saveToIndexedDB,
  getFromIndexedDB
};

export default indexedDbAdapter;

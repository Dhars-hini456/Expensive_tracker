import React, { createContext, useCallback, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    window.setTimeout(() => {
      setNotification((current) => (current && current.message === message ? null : current));
    }, 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
      {notification && (
        <div className={`toast toast-${notification.type}`} role="alert">
          <span>{notification.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{notification.message}</span>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

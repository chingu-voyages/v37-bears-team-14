import { createContext, useContext, useEffect, useState } from "react";
import { INotification } from "../../shared/NotificationInterfaces";
import { useSession } from "../../hooks/session";

export type NotificationData = {
  notifications: INotification[];
};

export const NotificationContext = createContext<INotification[]>([]);

export function NotificationProvider(props: any) {
  const { user } = useSession();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  console.log("notif", user);
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const getSession = async () => {
        const resp = await fetch("/api/v1/notifications?to=" + user.id);
        if (resp.status === 200) {
          return await resp.json();
        }
        if (resp.status >= 400) {
          console.error("Session fetch error", resp);
        }
        return { isLoggedIn: false, user: null };
      };

      try {
        const notifications = await getSession();
        setNotifications(notifications);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications().catch(console.error);
  }, [user]);

  return (
    <NotificationContext.Provider value={notifications}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

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

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const resp = await fetch("/api/v1/notifications?to=" + user.id);
      if (resp.status === 200 || resp.status === 304) {
        setNotifications(await resp.json());
      } else {
        console.error("Failed to get notifications", resp.status, resp);
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

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { INotification } from "../../shared/NotificationInterfaces";
import { useSession } from "../../hooks/session";

// Set host in dev to ":8080" to bypass proxy and go directly to backend.
let STREAM_URL: string;
if (process.env.NODE_ENV === "development") {
  STREAM_URL = "http://localhost:8080/api/v1/streams/notifications";
} else {
  STREAM_URL = "/api/v1/streams/notifications";
}

export type NotificationData = {
  connected: boolean;
  notifications: INotification[];
};

export const NotificationContext = createContext<NotificationData>({
  connected: false,
  notifications: [],
});

export function NotificationProvider(props: any) {
  const { user } = useSession();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [connected, setConnected] = useState(false);
  const [wait, setWait] = useState(false);
  const events = useRef<EventSource>();

  const pushNotification = useCallback(
    (notification) => {
      setNotifications(
        [notification].concat(
          notifications.filter((n) => n.id !== notification.id)
        )
      );
    },
    [notifications]
  );

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

  useEffect(() => {
    if (wait) return;
    if (!user) return;

    try {
      if (!events.current) {
        try {
          events.current = new EventSource(STREAM_URL, {
            withCredentials: true,
          });
        } catch (err) {
          setWait(true);
          console.error("Failed to connect, trying again in 10 seconds");
          setTimeout(() => setWait(false), 10000);
          return;
        }
      }

      events.current.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          if (parsedData["event"] === "ping") {
            console.log("got ping", event);
          } else if (parsedData["event"] !== undefined) {
            pushNotification(parsedData);
          }
        } catch (err) {
          console.error("Failed to parse message", event);
        }
      };

      events.current.onerror = (err) => {
        events.current = undefined;
        setConnected(false);
      };

      events.current.onopen = () => {
        setConnected(true);
      };
    } catch (err) {
      console.error(err);
    }
  }, [wait, pushNotification, connected, user]);

  return (
    <NotificationContext.Provider value={{ connected, notifications }}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

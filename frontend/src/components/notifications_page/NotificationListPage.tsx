import { Link } from "react-router-dom";
import { INotification } from "../../shared/NotificationInterfaces";
import { useNotifications } from "./useNotifications";
import moment from "moment";

const NotificationListPage = () => {
  const notifications = useNotifications();

  const mapNotification = (notification: INotification) => {
    switch (notification.event) {
      case "test":
        return (
          <div key={notification.id} className="my-3">
            {notification.event}{" "}
            {notification.data.user && (
              <span>
                from{" "}
                <Link
                  className="text-emerald-600 hover:underline"
                  to={"/user/" + notification.data.user.username}
                >
                  {notification.data.user.username}
                </Link>
              </span>
            )}
            <div className="text-xs text-gray-500">
              {moment(notification.createdAt).fromNow()}{" "}
            </div>
          </div>
        );
      default:
        return (
          <div key={notification.id} className="my-3">
            Unrecognized notification: {notification.event}
            <div className="text-xs text-gray-500">
              {moment(notification.createdAt).fromNow()}{" "}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mx-3 my-4 md:mx-8">
      {notifications.map(mapNotification)}
    </div>
  );
};

export default NotificationListPage;

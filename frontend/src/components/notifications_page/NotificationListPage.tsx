import { Link } from "react-router-dom";
import { INotification } from "../../shared/NotificationInterfaces";
import { useNotifications } from "./useNotifications";
import moment from "moment";

const NotificationListPage = () => {
  const { connected, notifications } = useNotifications();

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
              {moment(notification.createdAt).fromNow()}
            </div>
          </div>
        );
      case "application_created":
        const { project, application, user } = notification.data;
        return (
          <div key={notification.id} className="my-3">
            <div>
              <Link
                className="text-emerald-600 hover:underline"
                to={"/user/" + user?.username}
              >
                {user?.username}
              </Link>{" "}
              wants to apply to{" "}
              <Link
                className="text-emerald-600 hover:underline"
                to={"/projects/" + project?.id}
              >
                {project?.name}
              </Link>{" "}
              as a <span>{application?.requestedRole}</span>.
            </div>
            <div className="text-xs text-gray-500">
              {moment(notification.createdAt).fromNow()}
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

  if (notifications.length < 1) {
    return (
      <div className="mx-3 my-4 md:mx-8">
        <div className="text-sm text-gray-500">
          {connected ? (
            <>
              <div className="relative top-[0.05rem] inline-block rounded-full w-3 h-3 bg-emerald-600"></div>{" "}
              <span className="">Connected</span>
            </>
          ) : (
            <>
              <div className="relative top-[0.05rem] inline-block rounded-full w-3 h-3 bg-amber-600"></div>{" "}
              <span className="">Connecting...</span>
            </>
          )}
        </div>
        <div className="my-3 text-gray-500">No notifications.</div>
      </div>
    );
  }

  return (
    <div className="mx-3 my-4 md:mx-8">
      <div className="text-sm text-gray-500">
        {connected ? (
          <>
            <div className="relative top-[0.05rem] inline-block rounded-full w-3 h-3 bg-emerald-600"></div>{" "}
            <span className="">Connected</span>
          </>
        ) : (
          <>
            <div className="relative top-[0.05rem] inline-block rounded-full w-3 h-3 bg-amber-600"></div>{" "}
            <span className="">Connecting...</span>
          </>
        )}
      </div>
      {notifications.map(mapNotification)}
    </div>
  );
};

export default NotificationListPage;

import BellIcon from "../icons/BellIcon";
import { useNotifications } from "../notifications_page/useNotifications";

const NotificationIcon = () => {
  const { notifications } = useNotifications();
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <button className="relative inline-flex items-center mr-2 justify-center p-0.5 overflow-hidden text-sm font-medium text-emerald-200 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
      <span className="relative px-3 py-2.5 transition-all ease-in duration-75 bg-gray-700 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        <div className="right-[0.7rem] top-[0.7rem] absolute w-2 h-2 rounded-full border-[1px] border-gray-700 bg-yellow-400"></div>
        <BellIcon className="inline w-4 h-4" />
      </span>
    </button>
  );
};

export default NotificationIcon;

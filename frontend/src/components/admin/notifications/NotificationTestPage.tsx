import { useState } from "react";
import { useSession } from "../../../hooks/session";

const NotificationTestPage = () => {
  const { user } = useSession();
  const [response, setResponse] = useState({});
  const [to, setTo] = useState((user && user.id) || "");

  return (
    <div className="mx-3 my-4 md:mx-8">
      <div className="my-2">
        <label htmlFor="to" className="text-sm font-semibold">
          To User ID
        </label>
        <input
          className="px-1 rounded w-full"
          type="text"
          id="to"
          placeholder="To User ID"
          onChange={(e) => setTo(e.target.value)}
          value={to}
        />
      </div>
      <button
        className="main-btn"
        onClick={async () => {
          const test = await fetch("/api/v1/admin/notifications/sendtest", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ to }),
          });
          setResponse({
            status: test.status,
            response: await test.json(),
          });
        }}
      >
        Send Test Notification
      </button>
      <div className="text-sm font-semibold">Response</div>
      <pre className="text-sm bg-white p-1 rounded">
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
};

export default NotificationTestPage;

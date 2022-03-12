import { FC } from "react";
import { Hook } from "../../../shared/Interfaces";
import ActionButton from "../../controls/ActionButton";

interface WebhookUpdateParams {
  isActive?: boolean;
}

interface HookControlProps {
  hook: Hook;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (hook: Hook) => Promise<void>;
}

const HookControl: FC<HookControlProps> = ({ hook, onDelete, onUpdate }) => {
  const removeWebhook = async (id: string) => {
    const removal = await fetch("/api/v1/hooks/" + id, {
      method: "DELETE",
    });
    if (removal.status === 200 || removal.status === 304) {
      if (onDelete) {
        await onDelete(id);
      }
    } else {
      console.error("Failed to remove", removal.status, removal);
    }
  };

  const updateWebhook = async (id: string, params: WebhookUpdateParams) => {
    const update = await fetch("/api/v1/hooks/" + id, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(params),
    });
    if (update.status === 200 || update.status === 304) {
      if (onUpdate) {
        await onUpdate(await update.json());
      }
    } else {
      console.error("Failed to update", update.status, update);
    }
  };

  const rotateSecret = async (id: string) => {
    const rotation = await fetch("/api/v1/hooks/" + id + "/rotate_secret", {
      method: "POST",
      headers: { "content-type": "application/json" },
    });
    if (rotation.status === 200 || rotation.status === 304) {
      if (onUpdate) {
        await onUpdate(await rotation.json());
      }
    } else {
      console.error("Failed to rotate secret", rotation.status, rotation);
    }
  };

  const webhookUrl =
    document.location.protocol +
    "//" +
    document.location.host +
    "/api/v1/hooks/" +
    hook.id +
    "/events/github";

  return (
    <div className="my-4 p-4 border-[1px] border-gray-400 rounded">
      <div className="w-full my-2">
        <label className="font-semibold" htmlFor={"webhook_url_" + hook.id}>
          Webhook URL
        </label>
        <input
          className=" w-full"
          id={"webhook_url_" + hook.id}
          tabIndex={0}
          value={webhookUrl}
          readOnly
        />
      </div>

      <div className="w-full my-2">
        <label className="font-semibold" htmlFor={"webhook_secret_" + hook.id}>
          Webhook Secret
        </label>
        <textarea
          className=" w-full h-32"
          id={"webhook_secret_" + hook.id}
          tabIndex={0}
          value={hook.secret}
          readOnly
        />
      </div>

      <div className="my-1">
        <label className="font-semibold">Secret Generated At</label>
        <div className="">{hook.secretGeneratedAt}</div>
      </div>

      <div className="my-1">
        <label className="font-semibold">Invocations</label>
        <div className="">{hook.invokeCount}</div>
      </div>

      <div className="my-1">
        <label className="font-semibold">Last Invoked At</label>
        <div className="">
          {hook.invokedAt || (
            <span className="text-gray-500">Not Invoked Yet</span>
          )}
        </div>
      </div>

      <div className="my-1">
        <input
          id={"webhook_isActive_" + hook.id}
          type="checkbox"
          checked={hook.isActive}
          className="mr-2"
          onChange={(e) =>
            updateWebhook(hook.id, { isActive: e.target.checked })
          }
        />
        <label htmlFor={"webhook_isActive_" + hook.id}>Active</label>
      </div>

      <div className="my-2">
        <ActionButton
          onClick={() => rotateSecret(hook.id)}
          additionalClassName="bg-amber-600 active:bg-amber-600 hover:bg-amber-800 border-amber-800"
        >
          Rotate Secret
        </ActionButton>
      </div>

      <div className="my-2">
        <ActionButton
          onClick={() => removeWebhook(hook.id)}
          additionalClassName="bg-red-600 active:bg-red-600 hover:bg-red-800 border-red-800"
        >
          Delete
        </ActionButton>
      </div>
    </div>
  );
};

export default HookControl;

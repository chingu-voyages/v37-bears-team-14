import { FC, useEffect, useState } from "react";
import { Hook } from "../../../../shared/Interfaces";
import ActionButton from "../../../controls/ActionButton";
import HookControl from "../../components/HookControl";
import LoadingSpinner from "../../../Spinners/LoadingSpinner";

interface HookListProps {
  projectId: string;
}

const HookList: FC<HookListProps> = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  const [hooks, setHooks] = useState<Hook[]>([]);

  useEffect(() => {
    const getHooks = async () => {
      const resp = await fetch("/api/v1/hooks?project=" + projectId);
      if (resp.status === 200 || resp.status === 304) {
        setHooks(await resp.json());
        setLoading(false);
      } else {
        console.error("Failed to get hooks", resp.status, resp);
      }
    };

    getHooks().catch(console.error);
  }, [projectId]);

  const newHook = async (project: string) => {
    const create = await fetch("/api/v1/hooks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        project,
        isActive: true,
      }),
    });

    if (create.status === 200 || create.status === 304) {
      const newHook: Hook = await create.json();
      setHooks([...hooks.filter((h) => h.id !== newHook.id), newHook]);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      <div className="">
        {hooks.map((h) => (
          <HookControl
            key={h.id}
            hook={h}
            onDelete={async (id) => setHooks(hooks.filter((h) => h.id !== id))}
            onUpdate={async (hook) =>
              setHooks(hooks.map((h) => (h.id === hook.id ? hook : h)))
            }
          />
        ))}
      </div>
      <div>
        <ActionButton onClick={() => newHook(projectId)}>
          New Webhook
        </ActionButton>
      </div>
    </div>
  );
};

export default HookList;

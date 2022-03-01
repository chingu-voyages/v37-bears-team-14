import { useEffect, useState } from "react";
import { useSession } from "../../../hooks/session";
import { Application } from "../../../shared/Interfaces";
import ApplicationService from "../../../services/ApplicationService";

const useApplication = (projectId: string) => {
  const { user } = useSession();
  const [application, setApplication] = useState<null | Application>(null);

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    const findApplication = async () => {
      try {
        const app = await ApplicationService.findApplication(
          projectId,
          user.id
        );
        if (app) {
          setApplication(app);
        }
      } catch (err) {
        console.error("Failed to find application", err);
      }
    };

    findApplication().catch(console.error);
  }, [projectId, user]);

  return { application, setApplication };
};

export default useApplication;

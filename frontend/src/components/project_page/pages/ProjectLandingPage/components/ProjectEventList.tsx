import { FC, useEffect, useState } from "react";
import { ProjectEvent } from "../../../../../shared/EventInterfaces";
import LoadingSpinner from "../../../../Spinners/LoadingSpinner";
import ProjectEventPreview from "./ProjectEventPreview";

interface ProjectEventListProps {
  projectId: string;
}

const RECOGNIZED_EVENTS = ["repo_push", "repo_pull_request"];

const ProjectEventList: FC<ProjectEventListProps> = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ProjectEvent[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      const events = await fetch(
        "/api/v1/events/projectevents?project=" +
          projectId +
          "&types=" +
          RECOGNIZED_EVENTS.join(",")
      );
      if (events.status === 200 || events.status === 304) {
        setEvents(await events.json());
        setLoading(false);
      } else {
        console.error("failed to get project events", events.status);
      }
    };
    getEvents().catch(console.error);
  }, [projectId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {events.map((event) => (
        <div key={event.id} className="my-1">
          <ProjectEventPreview event={event} />
        </div>
      ))}
    </>
  );
};

export default ProjectEventList;

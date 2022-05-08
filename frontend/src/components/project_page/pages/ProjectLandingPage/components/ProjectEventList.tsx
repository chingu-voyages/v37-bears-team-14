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
  const [expanded, setExpanded] = useState(false);

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
      <div
        className={`relative ${
          !expanded && "max-h-32"
        } overflow-hidden border-2 border-black rounded shadow`}
      >
        {!expanded && (
          <div className="absolute h-full w-full bg-gradient-to-t from-white"></div>
        )}
        <div
          className="absolute right-0 bottom-0 bg-black text-white p-1 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {!expanded ? "View All" : "Collapse"}
        </div>
        {(() => {
          const options = [];

          for (let i = 0; i <= 50; i++) {
            options.push(<option value={i}>{i}</option>);
          }

          return options;
        })()}
      </div>
      {/* {events.map((event) => (
        <div key={event.id} className="my-1">
          <ProjectEventPreview event={event} now={new Date()} />
        </div>
      ))} */}
    </>
  );
};

export default ProjectEventList;

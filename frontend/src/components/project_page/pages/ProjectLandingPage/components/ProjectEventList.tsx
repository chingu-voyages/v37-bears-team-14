import { FC, useEffect, useState } from "react";
import { ProjectEvent } from "../../../../../shared/EventInterfaces";
import LoadingSpinner from "../../../../Spinners/LoadingSpinner";
import ChevronDownIcon from "../../../../icons/ChevronDownIcon";
import ProjectEventPreview from "./ProjectEventPreview";
import { Transition } from "@headlessui/react";

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
          !expanded ? "h-32" : "h-96"
        } border-[1px] border-black box-content rounded shadow transition-height duration-500 ease-in-out`}
      >
        {/* {!expanded && ()} */}
        <Transition
          show={!expanded}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute h-full w-full bg-gradient-to-t from-medGray rounded"></div>
        </Transition>

        <div
          className="absolute right-0 bottom-0 bg-gradient-to-br transition-all duration-1000 from-purple-600 to-blue-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white p-1 cursor-pointer rounded-tl"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center">
            <span>{!expanded ? "View All" : "Collapse"}</span>
            <ChevronDownIcon
              className={`h-5 w-5 ${
                expanded && "rotate-180"
              } transition-all duration-500 ease-in-out`}
            />
          </div>
        </div>
        <div
          className={`${
            !expanded ? "h-32 overflow-hidden" : "h-96 overflow-y-scroll"
          } transition-height duration-500 ease-in-out`}
        >
          {(() => {
            const options = [];

            for (let i = 0; i <= 50; i++) {
              options.push(
                <div key={i} className="ml-2">
                  {i}
                </div>
              );
            }

            return options;
          })()}
        </div>
      </div>

      {/* {events.map((event) => (
        <div key={event.id} className="my-1 ml-2">
          <ProjectEventPreview event={event} now={new Date()} />
        </div>
      ))} */}
    </>
  );
};

export default ProjectEventList;

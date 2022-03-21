import moment from "moment";
import { FC } from "react";
import { Link } from "react-router-dom";
import { ProjectEvent } from "../../../../../../shared/EventInterfaces";

export const RECOGNIZED_EVENTS = ["repo_push", "repo_pull_request"];

interface TimestampProps {
  now: Date;
  time: Date;
}

const Timestamp: FC<TimestampProps> = ({ time, now }) => {
  return (
    <div
      title={moment(time).format()}
      className="text-sm text-gray-500"
    >
      {moment(time).from(now)}
    </div>
  );
};

interface ProjectEventProps {
  now: Date;
  event: ProjectEvent;
}

const ProjectEventPullRequest: FC<ProjectEventProps> = ({ event, now }) => {
  const action = event.payload.action;
  const sender = event.user?.username;
  const url = event.payload.pull_request.html_url;
  const number = event.payload.pull_request.number;

  const senderEl = !!sender ? (
    <Link className="text-emerald-600 hover:underline" to={"/user/" + sender}>
      {sender}
    </Link>
  ) : (
    <span>{event.payload.sender.login}</span>
  );

  return (
    <div>
      <div>
        {senderEl} {action}{" "}
        <a href={url} className="text-emerald-600 hover:underline">
          Pull Request #{number}
        </a>
      </div>
      <Timestamp time={event.createdAt} now={now} />
    </div>
  );
};

const ProjectEventPush: FC<ProjectEventProps> = ({ event, now }) => {
  const sender = event.user?.username;
  const ref = event.payload.ref;
  const url = ref.startsWith("refs/heads")
    ? event.payload.repository.html_url +
      "/tree/" +
      ref.replace("refs/heads/", "")
    : event.payload.compare;

  const senderEl = !!sender ? (
    <Link className="text-emerald-600 hover:underline" to={"/user/" + sender}>
      {sender}
    </Link>
  ) : (
    <span>{event.payload.sender.login}</span>
  );

  return (
    <div>
      <div>
        {senderEl} pushed to{" "}
        <a className="text-emerald-600 hover:underline" href={url}>
          {ref}
        </a>
      </div>
      <Timestamp time={event.createdAt} now={now} />
    </div>
  );
};

const ProjectEventUnknown: FC<ProjectEventProps> = ({ event, now }) => {
  return (
    <div>
      <div>Unknown event: {event.event}</div>
      <Timestamp time={event.createdAt} now={now} />
    </div>
  );
};

const ProjectEventPreview: FC<ProjectEventProps> = (props) => {
  switch (props.event.event) {
    case "repo_pull_request":
      return <ProjectEventPullRequest {...props} />;
    case "repo_push":
      return <ProjectEventPush {...props} />;
    default:
      return <ProjectEventUnknown {...props} />;
  }
};

export default ProjectEventPreview;

import { Link, useParams } from "react-router-dom";
import Details from "../../../info/Details";
import HookList from "./HookList";

const ProjectSettingsHooksPage = () => {
  const { projectId } = useParams();
  return (
    <div className="mx-3 mb-8 mt-3 md:mt-6 md:w-full">
      <div className="text-2xl font-bold">Webhooks</div>
      <div className="mb-6">
        <Details title="Webhook Setup">
          <div className="my-3">
            Webhooks allow you to get events pushed from another source.{" "}
            <Link
              className="text-emerald-600 hover:underline"
              to="https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks"
              target="_blank"
            >
              GitHub Webhooks
            </Link>{" "}
            are the only event type currently supported.
          </div>
          <div className="my-3">
            <div className="font-semibold">GitHub Setup</div>
            <div className="">
              Configure this in your repository: Settings {">"} Webhooks {">"}{" "}
              Add webhook. (1) Copy and paste the "Webhook URL" into "Payload
              URL". (2) Select "application/json" for "Content type". (3) Copy
              and paste the secret into "Secret". Read more about setting up
              GitHub Webhooks at:{" "}
              <Link
                className="text-emerald-600 hover:underline"
                to="https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks"
                target="_blank"
              >
                Creating webhooks
              </Link>
              .
            </div>
            <div className="my-1">
              <Link
                to="/images/screenshot_webhook_github_example.png"
                target="_blank"
              >
                <img
                  className="h-auto w-full md:w-80"
                  src="/images/screenshot_webhook_github_example.png"
                  alt="Example GitHub Webhook"
                />
              </Link>
            </div>
          </div>
        </Details>
      </div>
      {projectId && <HookList projectId={projectId} />}
    </div>
  );
};

export default ProjectSettingsHooksPage;

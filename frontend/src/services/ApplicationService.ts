import { Application } from "../shared/Interfaces";
import { CreateApplicationParams } from "../shared/ApplicationInterfaces";

const findApplication = (
  projectId: string,
  applications: Application[]
): null | Application => {
  for (let i = 0; i < applications.length; i++) {
    const application = applications[i];
    if (application.project.id === projectId) {
      return application;
    }
  }
  return null;
};

class ApplicationService {
  static async submitApplication(
    project: string,
    user: string,
    values: CreateApplicationParams
  ): Promise<Application> {
    const submission = await fetch("/api/v1/applications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        project,
        user,
        ...values,
      }),
    });

    if (!(submission.status === 200 || submission.status === 304)) {
      throw new Error("Failed to submit application, please try again");
    }

    return await submission.json();
  }

  static async acceptApplicationById(applicationId: string) {
    const resp = await fetch("/api/v1/applications/" + applicationId);
    if (!(resp.status === 200 || resp.status === 304)) {
      throw new Error("Failed to get application " + applicationId);
    }

    const application: Application = await resp.json();
    return await ApplicationService.acceptApplication(application);
  }

  static async acceptApplication(
    application: Application,
    roleOverride?: string
  ): Promise<Application> {
    const accept = await fetch("/api/v1/applications/" + application.id, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        status: "accepted",
      }),
    });

    if (!(accept.status === 200 || accept.status === 304)) {
      throw new Error("Failed to accept application, please try again");
    }

    const addition = await fetch(
      "/api/v1/projects/" + application.project.id + "/members",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: application.user.id,
          roleName: roleOverride || application.requestedRole,
        }),
      }
    );

    if (!(addition.status === 200 || addition.status === 304)) {
      throw new Error("Failed to add user to project, please try again");
    }

    return await accept.json();
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: string
  ): Promise<Application> {
    const update = await fetch("/api/v1/applications/" + applicationId, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        status,
      }),
    });

    if (!(update.status === 200 || update.status === 304)) {
      throw new Error("Failed to update project status, please try again");
    }

    return await update.json();
  }

  static async findApplication(
    projectId: string,
    userId: string
  ): Promise<null | Application> {
    const search = await fetch("/api/v1/applications?user=" + userId);
    if (search.status === 200 || search.status === 304) {
      const applications = await search.json();
      return findApplication(projectId, applications);
    } else {
      throw new Error(
        "Failed to search apps projectId:" + projectId + " user: " + userId
      );
    }
  }
}

export default ApplicationService;

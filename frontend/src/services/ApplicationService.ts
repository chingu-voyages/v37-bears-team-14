import { Application } from "../shared/Interfaces";

class ApplicationService {
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
}

export default ApplicationService;

# Design Document

This is a living document that keeps a (best effort) record of the design decisions behind LinkUp, a platform for connecting developers to projects.

## Architecture

## Data Model

Projects are associated to users via a "member" resource.
The member object allows users to be associated with multiple projects and
vice versa (projects can be associated with multiple users).

Applications represent a User's request to be added as a Member to a Project.

Search is an insert-only collection we don't plan to update the items of.
It saves the metadata of project searches for downstream processing.

```
User {
  id: ObjectId
  displayName: string
  username: string, indexed
  avatarUrl: string
  githubId: number, indexed
  isAdmin: boolean // whether the user is a site admin
  techs: ObjectId[] // ref to Tech
}

Project {
  id: ObjectId
  name: string
  description: string // short description
  techs: ObjectId[] // ref to Tech
  settingOpenRoles: string[] // default ["developer", "designer"]
}

Search {
  query: string;
  nameMatchesProjects: ObjectId[]; // ref to Project
  descriptionMatchesProjects: ObjectId[]; // ref to Project
  techMatchesProjects: ObjectId[]; // ref to Project
  matchedTechs: ObjectId[]; // ref to Tech
  mergedCount: number;
  totalCount: number;
  timeElapsedMs: number;
  user: ObjectId | null; // ref to User, the logged-in user making the search
}

Member {
  project: ObjectId // ref to Project
  user: ObjectId // ref to User
  roleName: string // owner, developer, etc.
}

Tech {
  id: ObjectId
  name: string, indexed
  description: string
  imageUrl: string
}

Application {
  id: ObjectId
  project: ObjectId // ref to Project
  user: ObjectId // ref to User
  content: string // markdown
  status: string // pending, accepted, closed
  requestedRole: string
}

Hook {
  id: ObjectId
  project: ObjectId // ref to Project
  secret: string
  secretGeneratedAt: Date
  isActive: boolean
  invokedAt: Date | null
  invokeCount: number
}

ProjectEvent {
  id: ObjectId
  event: string
  project: ObjectId // ref to Project
  user?: ObjectId // ref to User, missing if a user can't be associated.
  payload: string // JSON string of event payload
}
```

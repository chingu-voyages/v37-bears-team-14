# Design Document

This is a living document that keeps a (best effort) record of the design decisions behind LinkUp, a platform for connecting developers to projects.

## Architecture

## Data Model

Projects are associated to users via a "member" resource.
The member object allows users to be associated with multiple projects and
vice versa (projects can be associated with multiple users).

Applications represent a User's request to be added as a Member to a Project.

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
```

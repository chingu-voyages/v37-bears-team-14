# Design Document

This is a living document that keeps a (best effort) record of the design decisions behind LinkUp, a platform for connecting developers to projects.

## Architecture

Projects are associated to users via a "member" resource.
The member object allows users to be associated with multiple projects and
vice versa (projects can be associated with multiple users).

## Data Model

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
```

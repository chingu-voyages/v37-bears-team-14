# Design Document

This is a living document that keeps a (best effort) record of the design decisions behind StackCafe, a platform for connecting developers to projects based on technology match.

## Entities

These models back the core functionality of StackCafe.

Projects are associated to users via a "member" resource.
The member object allows users to be associated with multiple projects and
vice versa (projects can be associated with multiple users).

Applications represent a User's request to be added as a Member to a Project.

![StackCafe Entity-Relationship Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQrB5q6_zCuiX18aeSpizXlnK2iJTA1lREljC-PM9lpi9kU2adnYOV7Rxt310HQlMii_kGuEXJZpzgb/pub?w=960&h=720)

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

## Interaction

The Search model is an insert-only collection that stores information about
user interaction with the project search. Of relevance are the search term,
the number of matched projects per attribute of project, time elapsed,
and whether the search was initiated by a logged-in user. This information
is used for downstream processing.

```
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
```

## Computation Data Models

Computations are the result of periodic endpoint calls.
Only the latest result matters, so no indexing on any fields
besides the _id field is needed. Getting the latest item
relies on the fact that _id's ObjectId contains a timestamp component
and the latest _id can be queried.

```
ComputationTrendingSearch {
  id: ObjectId
  suggestions: {
    query: string
    score: number
  }[];
  start: ObjectId // ref to Search
  end: ObjectId // ref to Search
  analyzed: number
  maxAnalyzed: number
  timeElapsedMs: number
  createdAt: Date
}
```

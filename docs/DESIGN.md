# Design Document

This is a living document that keeps a (best effort) record of the design decisions behind LinkUp, a platform for connecting developers to projects.

## Data Model

User {
  id: ObjectId
  displayName: string
  username: string, indexed
  avatarUrl: string
  githubId: number, indexed
  isAdmin: boolean // whether the user is a site admin
  techs: ObjectId[] // ref to Tech
}

Tech {
  id: ObjectId
  name: string, indexed
  description: string
  imageUrl: string
}

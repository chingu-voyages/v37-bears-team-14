<img src="https://i.imgur.com/SrodzuF.png" height="100">

# StackCafe

StackCafe matches projects with developers based on tech stack.

We are a MERN-based platform for the sharing and publishing of
tech stacks behind projects. Developers can search to find projects
that match their tech stack interests and can also apply to
join projects as team members.

## Tech Stack

**See our [StackCafe profile](https://stack.cafe/projects/6217a785dc514a753b85730b)!**

## Features

#### Users
- Edit username, avatar, technologies
- View profile
#### Authentication
- Sign in with GitHub
- Log out
#### Project Profiles
- Create projects
- Edit name and descriptions
- Edit technologies
#### Project Application
- Apply to projects
- Edit requested role and message
- Write a message to reviewer
  - Markdown supported
  - Suggested messages
- View list of user's applications to other projects
  - Filter by pending, accepted, closed
#### Project Application Review
- Accept or Close applications
  - Inline help text for actions
- View list of applications to project
  - Filter list by pending, accepted, closed
#### Project Settings
- Add, remove, and edit roles of team members
- Configure webhooks for receiving GitHub repository events
  - Inline help text for GitHub Webhook configuration
#### Project Search
- View summary of team and tech stack in project preview
  - Show +N if there are more than 5 technologies
- View latest updated projects
- Search by name, description, and technology
- Search metrics (see snapshot: https://snapshots.raintank.io/dashboard/snapshot/HjvBHi1eHCYNgZ43Obc35Y0KqJ7I1z3r)
#### Front Page
- Call to action - Browse Projects
- Search term suggestions
  - Deep link to search automatically
#### Administration
- Admin view for viewing all available technologies
#### Site Reliability
- Uptime monitor https://status.stack.cafe
  - Ping endpoint for lightweight monitor

## Deployment

The application is deployed onto fly.io at each push into `main` branch.
The production deployment is accessible at https://v37-bears-team-14.fly.dev/

## Setup

Requirements:
```
node 16
yarn 1.22.17
```

`yarn install`: Installs the dependencies. The postinstall script also
goes into backend and frontend folders to install the dependencies defined
there too.

## Commands

`yarn dev`: Runs frontend development server and backend server at the
same time. The create-react-app frontend will proxy the backend endpoint.

`yarn build`: Builds the frontend app into files that are ready for
serving in production.

`yarn test`: Runs the backend and frontend unit tests.

`yarn start`: Starts the web server (used in production). The server
serves the frontend web files from the build folder `backend/build/client`

`yarn fmt`: Runs a style formatter.

### Verifying build and test

The CI environment automatically sets the `CI=true` environment variable.
The testing framework uses that setting as a cue to treat warnings as errors.
In order to simulate that environment locally, run the build and test
commands with `CI=true yarn build && CI=true yarn test`.

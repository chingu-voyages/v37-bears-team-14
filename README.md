<p align="center">
  <a href="#stackcafe">About</a> •
  <a href="#philosophy">Philosophy</a> •
  <a href="./docs/DESIGN.md">Design</a> •
  <a href="#development">Development</a>
</p>

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
#### Authorization
- Role-based access control for project teams
- Site admin authorization
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
- Add and remove team members
  - Edit roles of team members
- Configure webhooks for receiving GitHub repository events
  - Inline help text for GitHub Webhook configuration
#### Project Search
- View summary of team and tech stack in project preview
  - Show +N if there are more than 5 technologies
- View latest updated projects
- Search by name, description, and technology
- Search metrics ([see dashboard snapshot](https://snapshots.raintank.io/dashboard/snapshot/7Fl3U1Vi9CTm07P8KmJiSDO61SlxXarq))
#### Entity Relationship Explorer
- Explore entity relationships with a graph visualizer
- Model graph in API with node types
  - Project
  - User
  - Tech
#### Front Page
- Call to action - Browse Projects
- Call to action - Explore Relationships
- Search term suggestions
  - Deep link to search automatically
#### Administration
- Admin view for viewing all available technologies
#### Site Reliability
- Uptime monitor https://status.stack.cafe
  - Ping endpoint for lightweight monitor

## Roadmap

See the [open issues](https://github.com/chingu-voyages/v37-bears-team-14/issues) for a list of proposed features (and known issues).

## Philosophy

We value:
- velocity
- monitoring
- automation
- reliability

Because of our short sprint cycle and the practice of iteractive development,
our approach optimizes for feature development velocity.
We achieve this by using processes that help us to release to production often
while at the same time using tools like automated testing and monitoring
to help us build confidence in the quality of the software we write.

### Velocity
To deploy our changes and respond early, we have set up automatic releases into production
when code is merged into the `main` branch.

We also follow the [Code Review Developer Guide](https://google.github.io/eng-practices/review/)
when reviewing pull requests, and only require one approval for merging.

### Monitoring
We have centralized logging via Logtail and uptime monitoring via Freshping to
give us visibility into the health of our production website.

### Automation
Wherever possible, we use automation to eliminate toil.
We use automated systems for testing and deploying code, as well
as for collecting and managing data in production.

### Reliability
To achieve reliability, we use GitHub Actions to automatically build and
test each pull request. We also document manual test plans (if any)
in the description of each pull request.

## Development

The code structure is split between `backend/`, which contains the server
code, and `frontend/`, which contains the React app code.

## Deployment

The application is deployed onto fly.io at each push into `main` branch.
The production deployment is accessible at https://v37-bears-team-14.fly.dev/.
This is the instance that backs the custom domain https://stack.cafe.

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

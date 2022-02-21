# Stack Cafe

Stack Cafe matches projects with developers based on tech stack.

## Intro



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

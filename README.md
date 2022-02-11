# voyage-tasks

Your project's `readme` is as important to success as your code. For 
this reason you should put as much care into its creation and maintenance
as you would any other component of the application.

If you are unsure of what should go into the `readme` let this article,
written by an experienced Chingu, be your starting point - 
[Keys to a well written README](https://tinyurl.com/yk3wubft).

And before we go there's "one more thing"! Once you decide what to include
in your `readme` feel free to replace the text we've provided here.

> Own it & Make it your Own!

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

`yarn start`: Starts the web server (used in production). The server
serves the frontend web files from the build folder `backend/build/client`

`yarn fmt`: Runs a style formatter.

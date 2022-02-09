# config

`config/` directory contains `.env` files for populating environment variables
in development and testing environments. `.env.dev` for development and `.env.test`
for testing.

Environment variables in production are instead configured with the platform hosting
the server. For fly.io, see https://fly.io/docs/reference/runtime-environment/#environment-variables

## Example .env file

```sh
PORT="8080"
```

export interface AppConfig {
  mongodbUri: string;
  sessionSecret: string;
  githubClientId: string;
  githubClientSecret: string;
  githubCallbackUrl: string;
  logtailToken?: string;
  nodeEnv?: string;
}

// Parses environment for expected variables.
// Shuts down the server if required variables are not present.
export function mustGetConfig(env: NodeJS.ProcessEnv): AppConfig {
  return {
    // required
    mongodbUri: getConfigValue(env, "MONGODB_URI"),
    sessionSecret: getConfigValue(env, "SESSION_SECRET"),
    githubClientId: getConfigValue(env, "GITHUB_CLIENT_ID"),
    githubClientSecret: getConfigValue(env, "GITHUB_CLIENT_SECRET"),
    githubCallbackUrl: getConfigValue(env, "GITHUB_CALLBACK_URL"),
    // optional
    logtailToken: process.env["LOGTAIL_TOKEN"],
    nodeEnv: process.env["NODE_ENV"],
  } as AppConfig;
}

export function getConfigValue(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (undefined === value) {
    console.error("Environment variable missing! name=" + name);
    process.exit(1);
  } else {
    return value;
  }
}

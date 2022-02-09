export interface AppConfig {
  mongodbUri: string;
}

export function mustGetConfig(env: NodeJS.ProcessEnv): AppConfig {
  return {
    mongodbUri: getConfigValue(env, "MONGODB_URI"),
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

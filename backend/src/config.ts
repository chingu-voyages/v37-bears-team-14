export interface RequiredAppConfig {
  mongodbUri: string;
  sessionSecret: string;
  githubClientId: string;
  githubClientSecret: string;
  githubCallbackUrl: string;
}

export interface OptionalAppConfig {
  logtailToken?: string;
  nodeEnv?: string;
  jobTokens?: string[];
  kafkaEnabled: boolean;
  kafkaBrokers?: string[];
  kafkaUsername?: string;
  kafkaPassword?: string;
  flyAllocId?: string;
}

export function getOptionalConfig(env: NodeJS.ProcessEnv): OptionalAppConfig {
  const opts = {
    logtailToken: env["LOGTAIL_TOKEN"],
    nodeEnv: env["NODE_ENV"],
    jobTokens: env["JOB_TOKENS"] ? env["JOB_TOKENS"].split(";") : undefined,

    kafkaBrokers: env["KAFKA_BROKERS"]
      ? env["KAFKA_BROKERS"].split(",")
      : undefined,
    kafkaUsername: env["KAFKA_USERNAME"],
    kafkaPassword: env["KAFKA_PASSWORD"],
    flyAllocId: env["FLY_ALLOC_ID"],
  };

  return {
    ...opts,
    kafkaEnabled: !!(
      opts.kafkaBrokers &&
      opts.kafkaUsername &&
      opts.kafkaPassword
    ),
  };
}

// Parses environment for expected variables.
// Shuts down the server if required variables are not present.
export function mustGetConfig(
  env: NodeJS.ProcessEnv
): RequiredAppConfig & OptionalAppConfig {
  return {
    // required
    mongodbUri: mustGet(env, "MONGODB_URI"),
    sessionSecret: mustGet(env, "SESSION_SECRET"),
    githubClientId: mustGet(env, "GITHUB_CLIENT_ID"),
    githubClientSecret: mustGet(env, "GITHUB_CLIENT_SECRET"),
    githubCallbackUrl: mustGet(env, "GITHUB_CALLBACK_URL"),
    // optional
    ...getOptionalConfig(env),
  };
}

export function mustGet(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (undefined === value) {
    console.error("Environment variable missing! name=" + name);
    process.exit(1);
  } else {
    return value;
  }
}

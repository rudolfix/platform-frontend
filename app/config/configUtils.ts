export function getRequiredEnv(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} missing!`);
  }

  return value;
}

export function getRequiredNumber(env: NodeJS.ProcessEnv, name: string): number {
  const str = getRequiredEnv(env, name);
  const parsedNumber = parseFloat(str);
  if (isNaN(parsedNumber)) {
    throw new Error(`Parsing ${name} failed. Value was: ${str}`);
  }

  return parsedNumber;
}

export function getOptionalEnv(env: NodeJS.ProcessEnv, name: string): string | undefined {
  return env[name] as any;
}

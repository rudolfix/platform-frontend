import { invariant } from "@neufund/shared-utils";

export function getRequiredEnv(env: unknown, name: string): string {
  invariant(typeof env === "string", `Environment variable ${name} missing!`);

  return env;
}

export function getRequiredNumber(env: unknown, name: string): number {
  const str = getRequiredEnv(env, name);

  const parsedNumber = parseFloat(str);

  invariant(!isNaN(parsedNumber), `Parsing ${name} failed. Value was: ${str}`);

  return parsedNumber;
}

/**
 * Validates if feature flag is "0", "1" or undefined.
 */
export function verifyOptionalFlagEnv(env: unknown, name: string): string | undefined {
  if (!env) {
    return undefined;
  }

  invariant(
    env === "0" || env === "1",
    `Env flag ${name} has incorrect value. Correct values: "0", "1"`,
  );

  return env;
}

import { minutesToMs, secondsToMs } from "@neufund/shared-utils";

export const AUTH_TOKEN_REFRESH_THRESHOLD = minutesToMs(1);
export const AUTH_JWT_TIMING_THRESHOLD = secondsToMs(10);

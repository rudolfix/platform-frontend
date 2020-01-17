import BroadcastChannel from "broadcast-channel";

import { symbols } from "../../di/symbols";
import { AUTH_INACTIVITY_THRESHOLD } from "../../modules/auth/constants";
import { cyPromise } from "../utils/cyPromise";

enum EUserActivityMessage {
  USER_ACTIVE = "user-active",
}

type UserActivityChannelMessage = {
  status: EUserActivityMessage;
};

const channel: BroadcastChannel<UserActivityChannelMessage> = new BroadcastChannel(
  symbols.userActivityChannel.toString(),
  { webWorkerSupport: false },
);

const pushTimeThenPostMessage = (milliseconds: number) =>
  cyPromise(() => {
    // Posting a message takes some time before it reaches to another browser this generates race conditions
    // We need to await for sometimes to guarantee that the posted message was received
    cy.wait(500);

    cy.tick(milliseconds);

    return channel.postMessage({
      status: EUserActivityMessage.USER_ACTIVE,
    });
  });

const keepSessionActive = (milliseconds: number) => {
  if (milliseconds === 0) {
    return;
  }

  const ticks = Math.min(milliseconds, AUTH_INACTIVITY_THRESHOLD - 1);

  pushTimeThenPostMessage(ticks);

  keepSessionActive(milliseconds - ticks);
};

const routeJwtRefresh = () => cy.route("POST", "**/jwt/refresh");

const routeJwtCreate = () => cy.route("POST", "**/jwt/create");

export { keepSessionActive, routeJwtRefresh, routeJwtCreate };

import BigNumber from "bignumber.js";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiBignumber from "chai-bignumber";
import crypto from "crypto";
import "ignore-styles";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import "reflect-metadata";
import sinonChai from "sinon-chai";

chai.config.truncateThreshold = 0;
interface IGlobalWithWindow extends NodeJS.Global {
  window: Window;
  // Window object is injected later
}

// Adds random bytes for lightwallet generation
// Note: we are forced to use `self` because one of the libraries that the light wallet uses, utilizes self
(self as any).crypto = {
  getRandomValues: (n: Uint8Array) => {
    const length = n.length;
    crypto.randomBytes(length);
  },
};

// Adds fetch to our unit/integration tests
(global as any).fetch = fetch;

chai.use(chaiAsPromised);
chai.use(chaiBignumber(BigNumber));
chai.use(sinonChai);

// @SEE https://github.com/jsdom/jsdom/issues/2383
const { window } = new JSDOM(``, {
  url: "http://localhost",
});

(global as IGlobalWithWindow).window = window;

// in lieu of process.node.env === "development"
(global as any).__DEV__ = true;

// make sure that tests fail on unhandled promise rejection
process.on("unhandledRejection", (reason, p) => {
  // tslint:disable-next-line
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});

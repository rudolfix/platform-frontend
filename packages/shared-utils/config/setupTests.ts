import BigNumber from "bignumber.js";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiBignumber from "chai-bignumber";
import { JSDOM } from "jsdom";
import sinonChai from "sinon-chai";

interface IGlobalWithWindow extends NodeJS.Global {
  window: Window;
  // Winodw object is injected later
}

chai.use(chaiAsPromised);
chai.use(chaiBignumber(BigNumber));
chai.use(sinonChai);

// @SEE https://github.com/jsdom/jsdom/issues/2383
const { window } = new JSDOM(``, {
  url: "http://localhost",
});

(global as IGlobalWithWindow).window = window;

// make sure that tests fail on unhandled promise rejection
process.on("unhandledRejection", (reason, p) => {
  // tslint:disable-next-line
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});

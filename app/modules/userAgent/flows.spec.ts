import { expect } from "chai";
import { spy } from "sinon";
import { TDetectBrowser } from "../../lib/dependencies/detectBrowser";
import { actions } from "../actions";
import { userAgentFlows } from "./flows";

describe("userAgent flows", () => {
  describe("detectUserAgent", () => {
    it("should detect user agent and issue action", () => {
      const expectedBrowserName = "chrome";
      const expectedBrowserVersion = "58.1.0";

      const dispatchMock = spy();
      const detectBrowserMock: TDetectBrowser = spy(() => ({
        name: expectedBrowserName,
        version: expectedBrowserVersion,
      }));

      userAgentFlows.detectUserAgent(dispatchMock, detectBrowserMock);

      expect(dispatchMock).to.be.calledWithExactly(
        actions.userAgent.loadUserAgentInfo(expectedBrowserName, expectedBrowserVersion),
      );
    });
  });
});

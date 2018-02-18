import { symbols } from "../../di/symbols";
import { TDetectBrowser } from "../../lib/dependencies/detectBrowser";
import { injectableFn } from "../../middlewares/redux-injectify";
import { AppDispatch } from "../../store";
import { actions } from "../actions";

export const userAgentFlows = {
  detectUserAgent: injectableFn(
    (dispatch: AppDispatch, detectBrowser: TDetectBrowser) => {
      const userAgentInfo = detectBrowser();

      dispatch(actions.userAgent.loadUserAgentInfo(userAgentInfo.name, userAgentInfo.version));
    },
    [symbols.appDispatch, symbols.detectBrowser],
  ),
};

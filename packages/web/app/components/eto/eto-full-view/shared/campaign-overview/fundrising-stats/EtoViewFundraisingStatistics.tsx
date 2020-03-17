import { withParams } from "@neufund/shared";
import * as React from "react";

import { getConfig } from "../../../../../../config/getConfig";
import { LoadingIndicatorHexagon } from "../../../../../shared/loading-indicator/LoadingIndicatorHexagon";

import * as styles from "./EtoViewFundraisingStatistics.module.scss";

const EtoViewFundraisingStatistics: React.FunctionComponent<{ etoId: string }> = ({ etoId }) => {
  const { externalResources } = getConfig(process.env);
  let statsUrl = withParams(externalResources.etoStatisticsIframeURL, { etoId });

  if (process.env.NF_USE_FAKE_ETO_STATS === "1") {
    // hardcode url if is .io or .net or localhost, ignore for cypress run
    statsUrl = "https://test.icomonitor.io/#/eto-stats/0x7fa12D095A080b364Cb9A7ad9cA622939873d1e8";
  }

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const [height, setHeight] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const onMessage = (msg: MessageEvent) => {
      const { origin } = new URL(statsUrl);
      if (msg.origin === origin) {
        const receivedHeight = Number(msg.data);

        if (isLoading && receivedHeight > 0) {
          // Mark component as loaded on first message
          // with height >0 received from iFrame
          setIsLoading(false);
        }

        if (!Number.isNaN(receivedHeight)) {
          setHeight(receivedHeight);
        }
      }
    };

    if (iframeRef.current) {
      window.addEventListener("message", onMessage);
    }

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingIndicatorHexagon />}
      <iframe
        sandbox="allow-scripts allow-same-origin"
        ref={iframeRef}
        style={{ height: height }}
        src={statsUrl}
        className={styles.fundraisingContainer}
        scrolling="no"
        data-test-id="eto.public-view.fundraising-statistics.iframe"
      />
    </>
  );
};

export { EtoViewFundraisingStatistics };

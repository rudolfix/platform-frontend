import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ResponsiveVideo } from "./ResponsiveVideo";

import * as mp4 from "../../assets/img/eto_offers/curfhover@1x.mp4";
import * as webm from "../../assets/img/eto_offers/curfhover@1x.webm";

storiesOf("ResponsiveVideo", module).add("default", () => (
  <ResponsiveVideo
    sources={{
      webm: webm,
      mp4: mp4,
    }}
    width={1}
    height={1}
  />
));

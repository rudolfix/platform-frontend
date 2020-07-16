import { storiesOf } from "@storybook/react-native";
import * as React from "react";

import { spacing2, spacing3 } from "styles/spacings";

import { Skeleton } from "./Skeleton";

storiesOf("Atoms|Skeleton", module).add("default", () => (
  <>
    <Skeleton height={spacing3} width={"80%"} marginBottom={spacing2} />

    <Skeleton height={spacing2} width={"40%"} />
  </>
));

import { ILogger, noopLogger } from "@neufund/shared-modules";
import * as React from "react";

import { symbols } from "../../../di/symbols";
import { ContainerContext } from "../InversifyProvider";

const useLogger = () => {
  const container = React.useContext(ContainerContext);

  // For storybook return noop logger as container is not connected with stories
  if (process.env.STORYBOOK_RUN === "1" || process.env.NODE_ENV === "development") {
    return noopLogger;
  }

  if (container === undefined) {
    throw new Error("Inversify container should be defined at this stage");
  }

  return container.get<ILogger>(symbols.logger);
};

export { useLogger };

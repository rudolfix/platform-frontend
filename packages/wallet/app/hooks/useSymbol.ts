import { TLibSymbol } from "@neufund/shared-modules";
import * as React from "react";

import { ContainerContext } from "components/containers/InversifyProvider";

/**
 * Extracts value from the container under symbol
 *
 * @note Always prefer access container from sagas over components
 */
const useSymbol = <T>(symbol: TLibSymbol<T>) => {
  const container = React.useContext(ContainerContext);

  if (container === undefined) {
    throw new Error("Inversify container should be defined at this stage");
  }

  return container.get<T>(symbol);
};

export { useSymbol };

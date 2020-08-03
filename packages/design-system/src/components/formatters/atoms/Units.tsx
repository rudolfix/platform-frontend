import * as React from "react";

interface IUnitProps {
  show?: boolean;
}

export const Units: React.FunctionComponent<IUnitProps> = ({ children, show }) =>
  show ? <span data-test-id="units">{children}</span> : null;

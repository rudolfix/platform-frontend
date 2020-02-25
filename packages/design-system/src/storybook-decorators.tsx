import * as React from "react";

export const InlineBlockWrapper: React.FunctionComponent = ({ children }) => (
  <div style={{ display: "inline-block", marginRight: "10px" }}>{children}</div>
);

export const BlockWrapper: React.FunctionComponent = ({ children }) => (
  <div style={{ marginBottom: "10px" }}>{children}</div>
);

export const PaddedWrapper: React.FunctionComponent = ({ children }) => (
  <div style={{ padding: "25px" }}>{children}</div>
);

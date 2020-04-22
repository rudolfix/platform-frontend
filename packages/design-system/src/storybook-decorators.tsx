import * as React from "react";

type TStyleProps = {
  style?: Object;
};

export const InlineBlockWrapper: React.FunctionComponent<TStyleProps> = ({ children, style }) => (
  <div style={{ display: "inline-block", marginRight: "10px", ...style }}>{children}</div>
);

export const BlockWrapper: React.FunctionComponent<TStyleProps> = ({ children }) => (
  <div style={{ marginBottom: "10px" }}>{children}</div>
);

export const PaddedWrapper: React.FunctionComponent<TStyleProps> = ({ children }) => (
  <div style={{ padding: "25px" }}>{children}</div>
);

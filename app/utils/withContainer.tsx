import * as React from "react";

export const withContainer: (
  Layout: React.ComponentType,
) => (WrappedComponent: React.ComponentType) => React.SFC = Layout => WrappedComponent => props => (
  <Layout>
    <WrappedComponent {...props} />
  </Layout>
);

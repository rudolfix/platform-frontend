import { UnknownObject } from "@neufund/shared-utils";
import * as React from "react";

interface IExternalProps {
  layout: React.ComponentType;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

// TODO: Add logger support
class ErrorBoundary extends React.Component<IExternalProps, IErrorBoundaryState> {
  constructor(props: IExternalProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): IErrorBoundaryState {
    return { hasError: true };
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <this.props.layout />;
    }

    return this.props.children;
  }
}

const createErrorBoundary = (layout: React.ComponentType) => <T extends UnknownObject>(
  WrappedComponent: React.ComponentType<T>,
) => (props: T) => (
  <ErrorBoundary layout={layout}>
    <WrappedComponent {...props} />
  </ErrorBoundary>
);

export { createErrorBoundary, ErrorBoundary };

import { captureException } from "@sentry/browser";
import * as React from "react";
import { ComponentEnhancer, nest, withProps } from "recompose";

interface IErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<any, IErrorBoundaryState> {
  state = { hasError: false };

  componentDidCatch(error: Error | null): void {
    captureException(error); //Error goes to Sentry
    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <this.props.layout />;
    }

    return this.props.children;
  }
}

const createErrorBoundary = (layout: any): ComponentEnhancer<any, any> => {
  return WrappedComponent => nest(withProps({ layout })(ErrorBoundary), WrappedComponent);
};

export { createErrorBoundary, ErrorBoundary };

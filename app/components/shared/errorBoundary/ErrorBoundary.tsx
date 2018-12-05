import { captureException } from "@sentry/browser";
import * as React from "react";
import { ComponentEnhancer, nest, withProps } from "recompose";

interface IErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<any, IErrorBoundaryState> {
  state = { hasError: false };

  componentDidCatch(error: Error | null, errorInfo: object): void {
    captureException({ error, errorInfo: JSON.stringify(errorInfo, null, 2) }); //Error goes to Sentry
    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <this.props.layout />;
    }

    return this.props.children;
  }
}

const createErrorBoundary = (layout: React.ReactNode): ComponentEnhancer<any, any> => {
  return WrappedComponent => nest(withProps({ layout })(ErrorBoundary), WrappedComponent);
};

export { createErrorBoundary, ErrorBoundary };

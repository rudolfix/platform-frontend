import { ILogger } from "@neufund/shared-modules";
import { ContainerContext } from "@neufund/shared-utils";
import * as React from "react";
import { ComponentEnhancer, nest, withProps } from "recompose";

import { symbols } from "../../../di/symbols";

interface IErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<any, IErrorBoundaryState> {
  static contextType = ContainerContext;

  logger: ILogger | null;

  constructor(props: any, container: React.ContextType<typeof ContainerContext>) {
    super(props);

    this.state = { hasError: false };
    // Only get logger if there is context. This is to prevent error in storybook (context is missing in storybook tests).
    this.logger = container ? container.get<ILogger>(symbols.logger) : null;
  }

  componentDidCatch(error: Error, errorInfo: object): void {
    if (this.logger) {
      this.logger.fatal(error, "A critical error occurred", errorInfo);
    }
    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <this.props.layout />;
    }

    return this.props.children;
  }
}

const createErrorBoundary = (
  layout: React.ReactNode,
): ComponentEnhancer<any, any> => WrappedComponent =>
  nest(withProps({ layout })(ErrorBoundary), WrappedComponent);

export { createErrorBoundary, ErrorBoundary };

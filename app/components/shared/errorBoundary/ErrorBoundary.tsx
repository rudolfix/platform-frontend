import * as PropTypes from "prop-types";
import * as React from "react";
import { ComponentEnhancer, nest, withProps } from "recompose";

import { symbols } from "../../../di/symbols";
import { ILogger } from "../../../lib/dependencies/Logger";
import { IInversifyProviderContext } from "../../../utils/InversifyProvider";

interface IErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<any, IErrorBoundaryState> {
  static contextTypes = {
    container: PropTypes.object,
  };

  logger: ILogger | null;

  constructor(props: any, context: IInversifyProviderContext) {
    super(props);

    this.state = { hasError: false };
    // Only get logger if there is context. This is to prevent error in storybook (context is missing in storybook tests).
    this.logger = context.container ? context.container.get<ILogger>(symbols.logger) : null;
  }

  componentDidCatch(error: Error, errorInfo: object): void {
    if (this.logger) {
      this.logger.fatal("A critical error occurred", error, errorInfo);
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

const createErrorBoundary = (layout: React.ReactNode): ComponentEnhancer<any, any> => {
  return WrappedComponent => nest(withProps({ layout })(ErrorBoundary), WrappedComponent);
};

export { createErrorBoundary, ErrorBoundary };

import { Container } from "inversify";
import * as PropTypes from "prop-types";
import * as React from "react";

export interface IInversifyProvider {
  container: Container;
}

export interface IInversifyProviderContext {
  container: Container;
}

export class InversifyProvider extends React.Component<IInversifyProvider>
  implements React.ChildContextProvider<IInversifyProviderContext> {
  static childContextTypes = {
    container: PropTypes.object,
  };

  getChildContext(): IInversifyProviderContext {
    return {
      container: this.props.container,
    };
  }

  render(): React.ReactNode {
    return this.props.children;
  }
}

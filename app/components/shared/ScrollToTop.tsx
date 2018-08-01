import * as React from "react";
import { RouteProps } from "react-router";

export class ScrollToTop extends React.Component<RouteProps> {
  componentDidUpdate(prevProps: RouteProps): void {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render(): React.ReactNode {
    return this.props.children;
  }
}

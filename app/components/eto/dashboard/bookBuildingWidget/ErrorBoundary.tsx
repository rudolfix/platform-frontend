import * as React from 'react';
import {Panel} from "../../../shared/Panel";

import * as styles from './ErrorBoundary.module.scss'

interface IErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<any, IErrorBoundaryState> {
  constructor(props:any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error:Error|null, info:object) {
    //TODO log to Sentry here
    this.setState({ hasError: true});
  }

  render() {
    if (this.state.hasError) {
      return <Panel className={styles.panel}>
        <p>Something went wrong.</p>
      </Panel>;
    }

    return this.props.children;
  }
}

const createErrorBoundary = (WrappedComponent:React.ComponentType) => (wrappedComponentProps:any) =>  {
  return <ErrorBoundary>
    <WrappedComponent {...wrappedComponentProps}/>
  </ErrorBoundary>
};

export {createErrorBoundary}

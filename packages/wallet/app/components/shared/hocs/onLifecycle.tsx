import { UnknownObject } from "@neufund/shared-utils";
import { useFocusEffect } from "@react-navigation/native";
import noop from "lodash/noop";
import * as React from "react";
import { connect } from "react-redux";
import { compose, withProps } from "recompose";

import { TAppGlobalActions } from "store/types";

type TDispatchProps = {
  mountAction: () => void;
  focusAction: () => void;
  unmountAction: () => void;
  blurAction: () => void;
};

type TWithProps = {
  wrappedComponent: React.ComponentType;
};

type TOptions<P = UnknownObject> = {
  onMount?: (dispatch: (action: TAppGlobalActions) => void, props: P) => void;
  onFocus?: (dispatch: (action: TAppGlobalActions) => void, props: P) => void;
  onUnmount?: (dispatch: (action: TAppGlobalActions) => void, props: P) => void;
  onBlur?: (dispatch: (action: TAppGlobalActions) => void, props: P) => void;
};

const OnLifecycle: React.FunctionComponent<TWithProps & TDispatchProps> = ({
  mountAction,
  unmountAction,
  focusAction,
  blurAction,
  wrappedComponent: Component,
  ...componentProps
}) => {
  const isMountAction = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (isMountAction.current) {
        focusAction();
      }

      return blurAction;
      // we do only care about focus and blur here
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  React.useEffect(() => {
    isMountAction.current = true;
    mountAction();

    return () => {
      unmountAction();
    };
    // we do only care about mount and unmount here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Component {...componentProps} />;
};

/**
 * Convenient HOC wrapper to dispatch action during core lifecycle events
 *
 * @param onMount - invokes a provided function when component has been mounted
 * @param onFocus - invokes a provided function when component received navigation focus (note: 'onFocus' is not invoked during mounting phase)
 * @param onUnmount -invokes a provided function before component is unmounted
 * @param onBlur - invokes a provided function when component lost navigation focus
 */
export const onLifecycle = <P extends UnknownObject = UnknownObject>({
  onMount = noop,
  onFocus = noop,
  onUnmount = noop,
  onBlur = noop,
}: TOptions<P>) => (wrappedComponent: React.ComponentType) =>
  compose<TWithProps & TDispatchProps, UnknownObject>(
    connect<UnknownObject, TDispatchProps, P>(undefined, (dispatch, props) => ({
      mountAction: () => onMount(dispatch, props),
      focusAction: () => onFocus(dispatch, props),
      unmountAction: () => onUnmount(dispatch, props),
      blurAction: () => onBlur(dispatch, props),
    })),
    withProps<TWithProps, TWithProps>({
      wrappedComponent,
    }),
  )(OnLifecycle);

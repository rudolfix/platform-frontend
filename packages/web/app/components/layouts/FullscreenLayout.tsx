import * as React from "react";
import { compose } from "recompose";

import { selectIsAuthorized } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { TDataTestId, TTranslatedString } from "../../types";
import { withContainer } from "../shared/hocs/withContainer";
import { Content } from "./Content";
import { HeaderFullscreen, THeaderFullscreenProps } from "./header/HeaderFullscreen";
import { TContentExternalProps } from "./Layout";
import { LayoutContainer } from "./LayoutContainer";

type TStateProps = {
  userIsAuthorized: boolean;
};

type TInitialProps = {
  buttonProps?: TButtonProps;
  wrapperClass?: string;
};

type TButtonProps = {
  buttonText: TTranslatedString | undefined;
  buttonAction: (() => void) | undefined;
};

type TButtonContext = {
  buttonProps: TButtonProps | undefined;
  setCurrentButtonProps: (
    text: TTranslatedString | undefined,
    action: (() => void) | undefined,
  ) => void;
};

const FullscreenButtonContext = React.createContext<TButtonContext>({
  buttonProps: undefined,
  setCurrentButtonProps: () => {},
});

const useActionButton = (initialProps?: TButtonProps): TButtonContext => {
  const [buttonProps, setButtonProps] = React.useState<TButtonProps | undefined>(initialProps);

  const setCurrentButtonProps = React.useCallback(
    (buttonText: TTranslatedString | undefined, buttonAction: (() => void) | undefined) => {
      setButtonProps({ buttonText, buttonAction });
    },
    [],
  );

  return { buttonProps, setCurrentButtonProps };
};

const FullscreenLayoutComponent: React.FunctionComponent<TStateProps &
  TDataTestId &
  TContentExternalProps &
  THeaderFullscreenProps &
  TInitialProps> = ({ children, buttonProps, wrapperClass, ...contentProps }) => {
  const buttonCtx = useActionButton(buttonProps);

  return (
    <>
      <FullscreenButtonContext.Provider value={buttonCtx}>
        <HeaderFullscreen
          buttonAction={buttonCtx.buttonProps?.buttonAction}
          buttonText={buttonCtx.buttonProps?.buttonText}
        />

        <Content {...contentProps}>{children}</Content>
      </FullscreenButtonContext.Provider>
    </>
  );
};

const FullscreenLayout = compose<
  TStateProps,
  TDataTestId & TContentExternalProps & THeaderFullscreenProps & TInitialProps
>(
  appConnect<TStateProps>({
    stateToProps: state => ({
      userIsAuthorized: selectIsAuthorized(state),
    }),
  }),
  withContainer<TDataTestId & TInitialProps & TStateProps>(
    ({ "data-test-id": dataTestId, userIsAuthorized, wrapperClass, children }) => (
      <LayoutContainer
        data-test-id={dataTestId}
        className={wrapperClass}
        userIsAuthorized={userIsAuthorized}
      >
        {children}
      </LayoutContainer>
    ),
  ),
)(FullscreenLayoutComponent);

export { FullscreenLayout, FullscreenButtonContext, FullscreenLayoutComponent };

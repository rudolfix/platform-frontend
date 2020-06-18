import { withContainer } from "@neufund/shared-utils";
import * as React from "react";
import { compose } from "recompose";

import { selectIsAuthorized } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { TDataTestId, TTranslatedString } from "../../types";
import { ProgressBarSimple } from "../shared/ProgressBarSimple";
import { Content } from "./Content";
import { FullscreenLayoutComponent } from "./FullscreenLayout";
import { HeaderFullscreen, THeaderFullscreenProps } from "./header/HeaderFullscreen";
import { TContentExternalProps } from "./Layout";
import { LayoutContainer } from "./LayoutContainer";

import * as styles from "./FullscreenProgressLayout.module.scss";

type TStateProps = {
  userIsAuthorized: boolean;
};

type TInitialProps = {
  progress?: number;
  buttonProps?: TButtonProps;
  wrapperClass?: string;
};

type TButtonProps = {
  buttonText: TTranslatedString | undefined;
  buttonAction: (() => void) | undefined;
};

type TProgressContext = {
  progress: number;
  setCurrentProgress: (value: number) => void;
};

type TButtonContext = {
  buttonProps: TButtonProps | undefined;
  setCurrentButtonProps: (
    text: TTranslatedString | undefined,
    action: (() => void) | undefined,
  ) => void;
};

const calculateStepProgress = (step: number, allSteps: number) =>
  Math.ceil((step / allSteps) * 100);

const FullscreenProgressContext = React.createContext<TProgressContext>({
  progress: 0,
  setCurrentProgress: () => {},
});

const FullscreenButtonContext = React.createContext<TButtonContext>({
  buttonProps: undefined,
  setCurrentButtonProps: () => {},
});

const useProgress = (initialValue = 0): TProgressContext => {
  const [progress, setProgress] = React.useState(initialValue);

  const setCurrentProgress = React.useCallback((currentProgress: number) => {
    setProgress(currentProgress);
  }, []);

  return { progress, setCurrentProgress };
};

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

const FullscreenProgressLayoutComponent: React.FunctionComponent<TStateProps &
  TDataTestId &
  TContentExternalProps &
  THeaderFullscreenProps &
  TInitialProps> = ({
  children,
  buttonProps,
  wrapperClass,
  userIsAuthorized,
  progress = 0,
  "data-test-id": dataTestId,
  ...contentProps
}) => {
  const progressCtx = useProgress(progress);
  const buttonCtx = useActionButton(buttonProps);

  return (
    <>
      <FullscreenProgressContext.Provider value={progressCtx}>
        <FullscreenButtonContext.Provider value={buttonCtx}>
          <HeaderFullscreen
            buttonAction={buttonCtx.buttonProps && buttonCtx.buttonProps.buttonAction}
            buttonText={buttonCtx.buttonProps && buttonCtx.buttonProps.buttonText}
          />
          {!!progress && (
            <ProgressBarSimple
              className={styles.progress}
              progress={progressCtx.progress.toString()}
            />
          )}
          <Content {...contentProps}>{children}</Content>
        </FullscreenButtonContext.Provider>
      </FullscreenProgressContext.Provider>
    </>
  );
};

const FullscreenProgressLayout = compose<
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

export {
  FullscreenProgressLayoutComponent,
  FullscreenProgressLayout,
  FullscreenProgressContext,
  calculateStepProgress,
  FullscreenButtonContext,
};

import { FixturesSwitcher } from "components/screens/FixtureScreen/FixturesSwitcher";

import { authModuleAPI } from "modules/auth/module";

import { appConnect } from "store/utils";

type TStateProps = {
  isStateChangeInProgress: ReturnType<typeof authModuleAPI.selectors.selectIsStateChangeInProgress>;
};

type TDispatchProps = {
  changeAccount: (privateKeyOrMnemonic: string, name: string) => void;
};

const SwitchFixtureScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    isStateChangeInProgress: authModuleAPI.selectors.selectIsStateChangeInProgress(state),
  }),
  dispatchToProps: dispatch => ({
    changeAccount: (privateKeyOrMnemonic: string, name: string) =>
      dispatch(authModuleAPI.actions.switchAccount(privateKeyOrMnemonic, name)),
  }),
})(FixturesSwitcher);

export { SwitchFixtureScreen };

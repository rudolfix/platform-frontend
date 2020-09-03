import { FixturesSwitcher } from "components/screens/FixtureScreen/FixturesSwitcher";

import { authModuleAPI } from "modules/auth/module";

import { appConnect } from "store/utils";

type TStateProps = {
  isStateChangeInProgress: ReturnType<typeof authModuleAPI.selectors.selectIsStateChangeInProgress>;
};

type TDispatchProps = {
  changeAccount: (privateKeyOrMnemonic: string, name: string) => void;
};

const ImportFixtureScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    isStateChangeInProgress: authModuleAPI.selectors.selectIsStateChangeInProgress(state),
  }),
  dispatchToProps: dispatch => ({
    changeAccount: (privateKeyOrMnemonic: string, name: string) =>
      dispatch(authModuleAPI.actions.importAccount(privateKeyOrMnemonic, name)),
  }),
})(FixturesSwitcher);

export { ImportFixtureScreen };

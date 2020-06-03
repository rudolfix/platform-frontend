import { FixturesSwitcher } from "components/screens/FixtureScreen/FixturesSwitcher";

import { authModuleAPI } from "modules/auth/module";

import { appConnect } from "store/utils";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  changeAccount: (privateKeyOrMnemonic: string, name: string) => void;
};

const SwitchFixtureScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    authState: authModuleAPI.selectors.selectAuthState(state),
  }),
  dispatchToProps: dispatch => ({
    changeAccount: (privateKeyOrMnemonic: string, name: string) =>
      dispatch(authModuleAPI.actions.switchAccount(privateKeyOrMnemonic, name)),
  }),
})(FixturesSwitcher);

export { SwitchFixtureScreen };

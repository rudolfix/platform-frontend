import { NavLink, NavLinkProps, Switch } from "react-router-dom";

// tslint:disable-next-line
import { SwitchProps } from "react-router";
import { appConnect } from "../../store";

export const SwitchConnected = appConnect<{}, {}, SwitchProps>({
  stateToProps: s => ({ location: s.router.location }),
  dispatchToProps: _d => ({}),
})(Switch);

export const NavLinkConnected = appConnect<{}, {}, NavLinkProps>({
  stateToProps: s => ({ location: s.router.location }),
  dispatchToProps: _d => ({}),
})(NavLink);

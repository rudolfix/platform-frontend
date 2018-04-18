import * as React from "react";

import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { selectKycOutSourcedURL, selectKycRequestStatus } from "../../modules/kyc/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoRouter } from "./Router";

interface IStateProps {}

interface IDispatchProps {}

type IProps = IStateProps & IDispatchProps;

export const EtoComponent: React.SFC<IProps> = () => {
  return (
    <LayoutAuthorized>
      <EtoRouter />
    </LayoutAuthorized>
  );
};

export const Eto = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: _state => ({}),
    dispatchToProps: _dispatch => ({}),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoComponent);

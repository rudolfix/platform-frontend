import * as React from "react";
import { Redirect } from "react-router";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { selecTEtoWithCompanyAndContractReadonlyById } from "../../../../modules/eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../../../modules/eto/types";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { withContainer } from "../../../../utils/withContainer.unsafe";
import { etoPublicViewByIdLink } from "../../../appRouteUtils";
import { Layout } from "../../../layouts/Layout";
import { LoadingIndicator } from "../../../shared/loading-indicator";

interface IStateProps {
  eto?: TEtoWithCompanyAndContractReadonly;
}

interface IRouterParams {
  etoId: string;
}

type TProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

const RedirectEtoByIdComponent: React.FunctionComponent<TProps> = ({ eto }) => (
  <Redirect to={etoPublicViewByIdLink(eto.etoId, eto.product.jurisdiction)} />
);

export const RedirectEtoById = compose<TProps, IRouterParams>(
  appConnect<IStateProps, {}, IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selecTEtoWithCompanyAndContractReadonlyById(state, props.etoId),
    }),
  }),
  withContainer(Layout),
  onEnterAction<IRouterParams>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.eto.loadEto(props.etoId));
    },
  }),
  branch<IStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(RedirectEtoByIdComponent);

import * as React from "react";
import { branch, compose } from "recompose";

import { TCompanyEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { TUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectEtoWithContract } from "../../modules/public-etos/selectors";
import { TEtoWithContract } from "../../modules/public-etos/types";
import { IWalletState } from "../../modules/wallet/reducer";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LayoutBase } from "../layouts/LayoutBase";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";

interface IStateProps {
  eto?: TEtoWithContract;
  userType?: TUserType;
  wallet?: IWalletState;
}

interface IRouterParams {
  etoId: string;
}

interface IDispatchProps {
  loadEto: () => void;
}

type IProps = IStateProps & IDispatchProps & IRouterParams;

class EtoPreviewComponent extends React.Component<IProps> {
  render(): React.ReactNode {
    if (!this.props.eto) {
      return <LoadingIndicator />;
    }

    return (
      <EtoPublicComponent
        wallet={this.props.wallet}
        companyData={this.props.eto.company as TCompanyEtoData}
        etoData={this.props.eto}
      />
    );
  }
}

export const EtoPublicView = compose<IProps, IRouterParams>(
  appConnect<IStateProps, IDispatchProps, IRouterParams>({
    stateToProps: (state, props) => ({
      userType: selectUserType(state.auth),
      eto: selectEtoWithContract(state, props.etoId),
      wallet: state.wallet,
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEto(props.etoId));
      dispatch(actions.wallet.startLoadingWalletData());
    },
  }),
  branch<IStateProps>(
    props => props.userType === "investor",
    withContainer(LayoutAuthorized),
    withContainer(LayoutBase),
  ),
)(EtoPreviewComponent);

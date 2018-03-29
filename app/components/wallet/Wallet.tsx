import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { WalletRouter } from "./Router";


// interface IProps {
//   goToDepositEuroToken: () => void;
//   goToDepositEth: () => void;
// }


export const Wallet: React.SFC = () => (
  <LayoutAuthorized>
    <WalletRouter />
  </LayoutAuthorized>
);


// export const Wallet = compose<React.SFC>(
//   appConnect<IProps>({
//     dispatchToProps: dispatch => ({
//       goToDepositEuroToken: () => dispatch(actions.routing.goToDepositEuroToken()),
//       goToDepositEth: () => dispatch(actions.routing.goToDepositEth()),
//     }),
//   }),
// )(WalletComponent);

import * as React from "react";
import { Modal } from "reactstrap";

import { actions } from "../../../modules/actions";
import { selectInvestmentModalOpened } from "../../../modules/investmentFlow/selectors";
import { appConnect } from "../../../store";
import { ModalComponentBody } from "../ModalComponentBody";
import { InvestmentSelection } from "./investment-flow/Investment";

interface IStateProps {
  isOpen: boolean;
}

interface IDispatchProps {
  onCancel: () => any;
  accept: () => any;
}

type Props = IStateProps & IDispatchProps;

export const InvestmentModalComponent: React.SFC<Props> = props => {
  const { isOpen, onCancel } = props;

  return (
    <Modal isOpen={isOpen} toggle={onCancel} className="big">
      <ModalComponentBody onClose={onCancel}><InvestmentSelection onAccept={() => {}} /></ModalComponentBody>
    </Modal>
  );
};

export const InvestmentModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: selectInvestmentModalOpened(state.investmentFlow),
  }),
  dispatchToProps: d => ({
    onCancel: () => d(actions.investmentFlow.investmentReset()),
    accept: () => {}
  }),
})(InvestmentModalComponent);

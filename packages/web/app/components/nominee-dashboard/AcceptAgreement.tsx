import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { actions } from "../../modules/actions";
import { ENomineeAcceptAgreementStatus } from "../../modules/nominee-flow/reducer";
import {
  selectNomineeRAAAState,
  selectNomineeTHAState,
} from "../../modules/nominee-flow/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { Button, EButtonLayout, EButtonTheme } from "../shared/buttons/Button";
import { ENomineeTask } from "./NomineeTasksData";

interface IStateProps {
  nomineeTHAStatus: ENomineeAcceptAgreementStatus;
  nomineeRAAAStatus: ENomineeAcceptAgreementStatus;
}

interface IExternalProps {
  task: ENomineeTask;
}

interface IDispatchProps {
  sign: () => void;
}

type IComponentProps = IDispatchProps & IExternalProps;

const isRAAA = (task: ENomineeTask): boolean => task === ENomineeTask.ACCEPT_RAAA;

export const AcceptAgreementLayout: React.FunctionComponent<IComponentProps> = ({ sign, task }) => (
  <>
    <h4>
      {isRAAA(task) ? (
        <FormattedMessage id="nominee-flow.sign-raaa.title" />
      ) : (
        <FormattedMessage id="nominee-flow.sign-tha.title" />
      )}
    </h4>
    <p>
      {isRAAA(task) ? (
        <FormattedMessage id="nominee-flow.sign-raaa.text" />
      ) : (
        <FormattedMessage id="nominee-flow.sign-tha.text" />
      )}
    </p>
    <Button
      layout={EButtonLayout.PRIMARY}
      theme={EButtonTheme.BRAND}
      data-test-id="eto-nominee-sign-agreement-action"
      onClick={sign}
    >
      <FormattedMessage id="nominee-flow.sign-agreement.sign-button" />
    </Button>
  </>
);

const acceptAgreement = compose<IComponentProps, {}>(
  appConnect<IStateProps, IDispatchProps, IExternalProps>({
    stateToProps: state => ({
      nomineeTHAStatus: selectNomineeTHAState(state),
      nomineeRAAAStatus: selectNomineeRAAAState(state),
    }),
    dispatchToProps: (dispatch, ownProps: IExternalProps) => {
      const signAction = isRAAA(ownProps.task)
        ? actions.txTransactions.startNomineeRAAASign()
        : actions.txTransactions.startNomineeTHASign();

      return {
        sign: () => dispatch(signAction),
      };
    },
  }),
  onEnterAction<IStateProps>({
    actionCreator: (dispatch, props) => {
      if (
        props.nomineeTHAStatus === ENomineeAcceptAgreementStatus.ERROR ||
        props.nomineeRAAAStatus === ENomineeAcceptAgreementStatus.ERROR
      )
        dispatch(actions.nomineeFlow.loadNomineeTaskData());
    },
  }),
);

const AcceptTHA = compose<IComponentProps, {}>(
  withProps(() => ({ task: ENomineeTask.ACCEPT_THA })),
  acceptAgreement,
)(AcceptAgreementLayout);

const AcceptRAAA = compose<IComponentProps, {}>(
  withProps(() => ({ task: ENomineeTask.ACCEPT_RAAA })),
  acceptAgreement,
)(AcceptAgreementLayout);

export { AcceptRAAA, AcceptTHA };

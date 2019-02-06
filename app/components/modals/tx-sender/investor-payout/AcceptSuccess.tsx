import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ConfettiEthereum } from "../../../landing/parts/ConfettiEthereum";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Message } from "../shared/Message";

interface IDispatchProps {
  goToWallet: () => void;
}

interface IStateProps {
  tokenName?: string;
}

type IProps = IDispatchProps & IStateProps;

const InvestorAcceptPayoutSuccessLayout: React.FunctionComponent<IProps> = ({ goToWallet }) => (
  <Message
    image={<ConfettiEthereum className="mb-3" />}
    text={<FormattedMessage id="investor-payout.accept.success.text" />}
  >
    <ButtonArrowRight onClick={goToWallet}>
      <FormattedMessage id="investor-payout.accept.success.view-wallet" />
    </ButtonArrowRight>
  </Message>
);

const InvestorAcceptPayoutSuccess = appConnect<IStateProps, IDispatchProps>({
  dispatchToProps: dispatch => ({
    goToWallet: () => dispatch(actions.routing.goToWallet()),
  }),
})(InvestorAcceptPayoutSuccessLayout);

export { InvestorAcceptPayoutSuccess, InvestorAcceptPayoutSuccessLayout };

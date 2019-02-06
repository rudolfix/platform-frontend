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

const InvestorPayoutSuccessLayout: React.FunctionComponent<IProps> = ({ goToWallet }) => (
  <Message
    image={<ConfettiEthereum className="mb-3" />}
    text={<FormattedMessage id="investor-payout.success.text" />}
  >
    <ButtonArrowRight onClick={goToWallet}>
      <FormattedMessage id="investor-payout.success.view-wallet" />
    </ButtonArrowRight>
  </Message>
);

const InvestorPayoutSuccess = appConnect<IStateProps, IDispatchProps>({
  dispatchToProps: dispatch => ({
    goToWallet: () => dispatch(actions.routing.goToWallet()),
  }),
})(InvestorPayoutSuccessLayout);

export { InvestorPayoutSuccess, InvestorPayoutSuccessLayout };

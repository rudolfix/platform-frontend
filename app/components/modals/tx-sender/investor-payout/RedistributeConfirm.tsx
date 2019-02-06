import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ConfettiEthereum } from "../../../landing/parts/ConfettiEthereum";
import { Button, ButtonArrowRight, ButtonGroup, EButtonLayout } from "../../../shared/buttons";
import { Message } from "../shared/Message";

interface IDispatchProps {
  confirm: () => void;
  deny: () => void;
}

type IProps = IDispatchProps;

const InvestorRedistributePayoutConfirmLayout: React.FunctionComponent<IProps> = ({
  deny,
  confirm,
}) => (
  <Message
    image={<ConfettiEthereum className="mb-3" />}
    title={<FormattedMessage id="investor-payout.redistribute.confirm.title" />}
    text={<FormattedMessage id="investor-payout.redistribute.confirm.text" />}
  >
    <ButtonGroup>
      <Button onClick={deny} layout={EButtonLayout.SECONDARY}>
        <FormattedMessage id="investor-payout.redistribute.confirm.deny" />
      </Button>
      <ButtonArrowRight onClick={confirm}>
        <FormattedMessage id="investor-payout.redistribute.confirm.confirm" />
      </ButtonArrowRight>
    </ButtonGroup>
  </Message>
);

const InvestorRedistributePayoutConfirm = appConnect<{}, IDispatchProps>({
  dispatchToProps: dispatch => ({
    confirm: () => dispatch(actions.txSender.txSenderAcceptDraft()),
    deny: () => dispatch(actions.txSender.txSenderHideModal()),
  }),
})(InvestorRedistributePayoutConfirmLayout);

export { InvestorRedistributePayoutConfirm, InvestorRedistributePayoutConfirmLayout };

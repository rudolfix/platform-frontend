import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { compose } from "redux";

import { actions } from '../../../../modules/actions';
import { appConnect } from "../../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { ButtonArrowRight } from "../../../shared/Buttons";
import { Panel } from "../../../shared/Panel";

import * as styles from "./SubmitProposalWidget.module.scss";

interface IDispatchProps {
  submitProposal: () => void;
}

export const SubmitProposalWidgetComponent: React.SFC<IDispatchProps & IIntlProps> = ({
  submitProposal,
  intl: { formatIntlMessage },
}) => {
  return (
    <Panel headerText={formatIntlMessage("settings.submit-your-proposal.header")}>
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="settings.submit-proposal-widget.completed-fields" />
        </p>
        <Col className="d-flex justify-content-center">
          <ButtonArrowRight onClick={submitProposal}>Submit</ButtonArrowRight>
        </Col>
      </div>
    </Panel>
  );
};

export const SubmitProposalWidget = compose<React.SFC>(
  appConnect<IDispatchProps>({
    dispatchToProps: dispatch => ({
      submitProposal: () => dispatch(actions.etoFlow.submitDataStart()),
    }),
  }),
  injectIntlHelpers,
)(SubmitProposalWidgetComponent);

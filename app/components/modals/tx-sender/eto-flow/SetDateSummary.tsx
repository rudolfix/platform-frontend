import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, Row } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectNewPreEtoStartDate } from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { EtherscanAddressLink } from "../../../shared/EtherscanLink";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps } from "../TxSender";

interface IStateProps {
  newDate: Date;
  etoTermsAddress: string;
  etoCommitmentAddress: string;
  etoCommitmentAgreementIPFSLink: string;
  equityTokenAddress: string;
  equityTokenAgreementIPFSLink: string;
}

type IProps = IStateProps & ITxSummaryDispatchProps;

const SetEtoDateSummaryComponent: React.SFC<IProps> = ({
  onAccept,
  etoTermsAddress,
  equityTokenAddress,
  equityTokenAgreementIPFSLink,
  etoCommitmentAddress,
  etoCommitmentAgreementIPFSLink,
  newDate,
}) => {
  const date = moment(newDate);
  return (
    <Container>
      <Row>
        <Heading>
          <FormattedMessage id="eto.settings.set-eto-date-summary.title" />
        </Heading>
      </Row>

      <Row className="mt-4">
        <InfoList>
          <InfoRow
            caption={<FormattedMessage id="eto.settings.eto-start-date-summary.new-start-date" />}
            value={date.format("dddd, MMM Do, YYYY")}
          />
          <InfoRow
            caption={
              <FormattedMessage id="eto.settings.eto-start-date-summary.time-span-to-start-date" />
            }
            value={date.fromNow()}
          />
          <InfoRow
            caption={
              <FormattedMessage id="eto.settings.eto-start-date-summary.eto-commitment-contract-address" />
            }
            value={
              <EtherscanAddressLink address={etoCommitmentAddress}>
                {etoCommitmentAddress}
              </EtherscanAddressLink>
            }
          />
          <InfoRow
            caption={
              <FormattedMessage id="eto.settings.eto-start-date-summary.eto-terms-contract-address" />
            }
            value={
              <EtherscanAddressLink address={etoTermsAddress}>
                {etoTermsAddress}
              </EtherscanAddressLink>
            }
          />
          <InfoRow
            caption={
              <FormattedMessage id="eto.settings.eto-start-date-summary.equity-token-address" />
            }
            value={
              <EtherscanAddressLink address={equityTokenAddress}>
                {equityTokenAddress}
              </EtherscanAddressLink>
            }
          />
          <InfoRow
            caption={
              <FormattedMessage id="eto.settings.eto-start-date-summary.download-equity-token-agreement" />
            }
            value={
              <a href={equityTokenAgreementIPFSLink} target="_blank">
                {equityTokenAgreementIPFSLink}
              </a>
            }
          />
          <InfoRow
            caption={
              <FormattedMessage id="eto.settings.eto-start-date-summary.download-eto-commitment-agreement" />
            }
            value={
              <a href={etoCommitmentAgreementIPFSLink} target="_blank">
                {etoCommitmentAgreementIPFSLink}
              </a>
            }
          />
        </InfoList>
      </Row>

      <Row className="justify-content-center mt-4">
        <Button
          layout={EButtonLayout.PRIMARY}
          type="button"
          onClick={onAccept}
          data-test-id="invest-modal-summary-confirm-button"
        >
          <FormattedMessage id="eto.settings.confirm" />
        </Button>
      </Row>
    </Container>
  );
};

const SetEtoDateSummary = compose<IProps, {}>(
  setDisplayName("SetEtoDateSummary"),
  appConnect<IStateProps, ITxSummaryDispatchProps>({
    stateToProps: state => {
      const newDate = selectNewPreEtoStartDate(state)!;
      return {
        newDate,
        etoTermsAddress: "",
        equityTokenAddress: "",
        etoCommitmentAddress: "",
        equityTokenAgreementIPFSLink: "",
        etoCommitmentAgreementIPFSLink: "",
      };
    },
    dispatchToProps: d => ({
      onAccept: () => d(actions.txSender.txSenderAccept()),
    }),
  }),
)(SetEtoDateSummaryComponent);

export { SetEtoDateSummaryComponent, SetEtoDateSummary };

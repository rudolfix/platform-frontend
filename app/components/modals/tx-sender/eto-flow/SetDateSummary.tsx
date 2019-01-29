import { find } from "lodash";
import * as moment from "moment";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Container, Row } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import {
  EEtoDocumentType,
  immutableDocumentName,
} from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectPlatformTermsConstants } from "../../../../modules/contracts/selectors";
import {
  selectIssuerEtoWithCompanyAndContract,
  selectNewPreEtoStartDate,
} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { EtherscanAddressLink, ExternalLink } from "../../../shared/links";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

interface IStateProps {
  newDate: Date;
  changeableTill: moment.Moment;
  etoTermsAddress: string;
  etoCommitmentAddress: string;
  termsAgreementIPFSLink: string;
  equityTokenAddress: string;
  offeringAgreementIPFSLink: string;
}

interface IDispatchProps {
  onAccept: () => any;
}

type IProps = IStateProps & IDispatchProps;

const SetEtoDateSummaryComponent: React.FunctionComponent<IProps> = ({
  onAccept,
  etoTermsAddress,
  equityTokenAddress,
  offeringAgreementIPFSLink,
  etoCommitmentAddress,
  termsAgreementIPFSLink,
  newDate,
  changeableTill,
}) => {
  const date = moment(newDate);
  return (
    <Container>
      <Row>
        <Heading>
          <FormattedMessage id="eto.settings.eto-start-date-summary.dates-title" />
        </Heading>
      </Row>

      <Row className="mt-4">
        <FormattedHTMLMessage
          tagName="p"
          id="eto.settings.eto-start-date-summary.dates-description"
          values={{ timeToChange: changeableTill.from(moment().startOf("day"), true) }}
        />
      </Row>

      <Row className="mt-0">
        <InfoList>
          <InfoRow
            caption={
              <FormattedMessage id="eto.settings.eto-start-date-summary.time-to-start-date" />
            }
            value={date.from(moment().startOf("day"), true)}
            dataTestId="set-eto-date-summary-time-to-eto"
          />
          <InfoRow
            caption={<FormattedMessage id="eto.settings.eto-start-date-summary.new-start-date" />}
            value={date.format("dddd, DD MMMM YYYY")}
          />
        </InfoList>
      </Row>

      <Row className="mt-4">
        <Heading>
          <FormattedMessage id="eto.settings.eto-start-date-summary.contracts-title" />
        </Heading>
      </Row>

      <Row className="mt-4">
        <p>
          <FormattedMessage id="eto.settings.eto-start-date-summary.contracts-description" />
        </p>
      </Row>

      <Row className="mt-0">
        <InfoList>
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
            caption={immutableDocumentName[EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT]}
            value={
              <ExternalLink href={offeringAgreementIPFSLink}>
                {offeringAgreementIPFSLink}
              </ExternalLink>
            }
          />
          <InfoRow
            caption={immutableDocumentName[EEtoDocumentType.SIGNED_TERMSHEET]}
            value={
              <ExternalLink href={termsAgreementIPFSLink}>{termsAgreementIPFSLink}</ExternalLink>
            }
          />
        </InfoList>
      </Row>

      <Row className="justify-content-center mt-4">
        <Button
          layout={EButtonLayout.PRIMARY}
          type="button"
          onClick={onAccept}
          data-test-id="set-eto-date-summary-confirm-button"
        >
          <FormattedMessage id="eto.settings.confirm" />
        </Button>
      </Row>
    </Container>
  );
};

const SetEtoDateSummary = compose<IProps, {}>(
  setDisplayName("SetEtoDateSummary"),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const newDate = selectNewPreEtoStartDate(state)!;
      const constants = selectPlatformTermsConstants(state);
      const changableTill = moment(newDate).subtract(
        constants.DATE_TO_WHITELIST_MIN_DURATION.toNumber(),
        "seconds",
      );

      const eto = selectIssuerEtoWithCompanyAndContract(state)!;
      const ipfsUrl = "https://ipfs.io/ipfs/";
      const termsDoc: any = find(eto.documents, [
        "documentType",
        EEtoDocumentType.SIGNED_TERMSHEET,
      ]);
      const offeringDoc: any = find(eto.documents, [
        "documentType",
        EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT,
      ]);
      const offeringAgreementIPFSLink = offeringDoc && ipfsUrl + (offeringDoc.ipfsHash as string);
      const termsAgreementIPFSLink = termsDoc && ipfsUrl + (termsDoc.ipfsHash as string);

      return {
        newDate,
        etoTermsAddress: eto.contract!.etoTermsAddress,
        equityTokenAddress: eto.contract!.equityTokenAddress,
        etoCommitmentAddress: eto.contract!.etoCommitmentAddress,
        offeringAgreementIPFSLink,
        termsAgreementIPFSLink,
        changeableTill: changableTill,
      };
    },
    dispatchToProps: d => ({
      onAccept: () => d(actions.txSender.txSenderAccept()),
    }),
  }),
)(SetEtoDateSummaryComponent);

export { SetEtoDateSummaryComponent, SetEtoDateSummary };

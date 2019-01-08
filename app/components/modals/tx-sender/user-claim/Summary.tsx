import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { actions } from "../../../../modules/actions";
import { selectMyInvestorTicketByEtoId } from "../../../../modules/investor-tickets/selectors";
import {
  selectTxGasCostEthUlps,
  selectTxSummaryAdditionalData,
  selectTxSummaryData,
} from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { InlineIcon } from "../../../shared/InlineIcon";
import { Heading } from "../../../shared/modals/Heading";
import { ECurrency, ECurrencySymbol, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps, ITxSummaryStateProps, TSummaryComponentProps } from "../TxSender";

import * as iconDownload from "../../../../assets/img/inline_icons/download.svg";
import * as styles from "./Summary.module.scss";

export const UserClaimSummaryComponent: React.SFC<TSummaryComponentProps> = ({
  etoData,
  txCost,
  onAccept,
}) => (
  <Container>
    <Row className="mb-4">
      <Col>
        <Heading>
          <FormattedMessage id="upgrade-flow.summary" />
        </Heading>
      </Col>
    </Row>

    <Row>
      <Col>
        <InfoList>
          <InfoRow
            caption={<FormattedMessage id="user-claim-flow.token-name" />}
            value={etoData!.equityTokenName}
          />

          <InfoRow
            caption={<FormattedMessage id="user-claim-flow.balance" />}
            value={etoData!.investorTicket.equityTokenInt.toString()}
          />

          <InfoRow
            caption={<FormattedMessage id="user-claim-flow.estimated-reward" />}
            value={
              <Money
                value={etoData!.investorTicket.rewardNmkUlps.toString()}
                currency={ECurrency.NEU}
                currencySymbol={ECurrencySymbol.NONE}
              />
            }
          />
          {/*  <>
            {map(
              (document: IEtoDocument) => (
                <span key={document.ipfsHash} className={styles.documentLink}>
                  <Document extension="pdf" />
                  <a href={document.name} download>
                    {getDocumentTitles(isRetailEto)[document.documentType]}
                  </a>
                </span>
              ),
              etoData.documents,
            )}
          </> */}

          <InfoRow
            caption={<FormattedMessage id="upgrade-flow.transaction-cost" />}
            value={<Money currency={ECurrency.ETH} value={txCost} />}
          />
          <InfoRow
            caption={
              <DocumentTemplateButton
                onClick={() => {}}
                title={<FormattedMessage id="wallet.icbm.reservation-agreement" />}
              />
            }
            value={<InlineIcon className={styles.icon} svgIcon={iconDownload} onClick={() => {}} />}
          />
          <InfoRow
            caption={
              <DocumentTemplateButton
                onClick={() => {}}
                title={<FormattedMessage id="wallet.icbm.reservation-agreement" />}
              />
            }
            value={<InlineIcon className={styles.icon} svgIcon={iconDownload} onClick={() => {}} />}
          />
          <InfoRow
            caption={
              <DocumentTemplateButton
                onClick={() => {}}
                title={<FormattedMessage id="wallet.icbm.reservation-agreement" />}
              />
            }
            value={<InlineIcon className={styles.icon} svgIcon={iconDownload} onClick={() => {}} />}
          />
        </InfoList>
      </Col>
    </Row>
    <Row>
      <Col className="text-center">
        <Button
          onClick={onAccept}
          className="mt-4"
          data-test-id="modals.tx-sender.withdraw-flow.summery.withdrawSummery.accept"
        >
          <FormattedMessage id="withdraw-flow.confirm" />
        </Button>
      </Col>
    </Row>
  </Container>
);

export const UserClaimSummary = appConnect<ITxSummaryStateProps, ITxSummaryDispatchProps, {}>({
  stateToProps: state => {
    const etoId: string = selectTxSummaryAdditionalData(state);
    return {
      txData: selectTxSummaryData(state)!,
      etoData: selectMyInvestorTicketByEtoId(state, etoId)!,
      txCost: selectTxGasCostEthUlps(state),
    };
  },
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
    downloadICBMAgreement: () => d(actions.icbmWalletBalanceModal.downloadICBMWalletAgreement()),
  }),
})(UserClaimSummaryComponent);

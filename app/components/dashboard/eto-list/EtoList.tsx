import { keyBy } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { EtoState, TPublicEtoData } from "../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectPublicEtos } from "../../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { IWalletState } from "../../../modules/wallet/reducer";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewStatus } from "../../eto/overview/EtoOverviewStatus";
import { SectionHeader } from "../../shared/SectionHeader";

interface IStateProps {
  etos: TEtoWithCompanyAndContract[];
  wallet: IWalletState;
}

interface IDispatchProps {
  startInvestmentFlow: (eto: TPublicEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoListComponent: React.SFC<IProps> = ({ etos, wallet }) => (
  <>
    <Col xs={12}>
      <SectionHeader>
        <FormattedMessage id="dashboard.eto-opportunities" />
      </SectionHeader>
    </Col>
    {etos.map(eto => (
      <Col xs={12} key={eto.etoId}>
        <div className="mb-3">
          {eto.state === EtoState.ON_CHAIN && (
            <EtoOverviewStatus
              preMoneyValuationEur={eto.preMoneyValuationEur}
              existingCompanyShares={eto.existingCompanyShares}
              equityTokensPerShare={eto.equityTokensPerShare}
              investmentAmount={`€ ${(
                ((eto.preMoneyValuationEur || 1) / (eto.existingCompanyShares || 1)) *
                (eto.newSharesToIssue || 1)
              ).toFixed(4)} - € 
              ${(
                ((eto.preMoneyValuationEur || 1) / (eto.existingCompanyShares || 1)) *
                (eto.minimumNewSharesToIssue || 1)
              ).toFixed(4)}`}
              contract={eto.contract}
              wallet={wallet}
              etoId={eto.etoId}
              smartContractOnchain={eto.state === EtoState.ON_CHAIN}
              prospectusApproved={keyBy(eto.documents, "documentType")["approved_prospectus"]}
              termSheet={keyBy(eto.documents, "documentType")["termsheet_template"]}
              canEnableBookbuilding={eto.canEnableBookbuilding}
              etoStartDate={eto.startDate}
              preEtoDuration={eto.whitelistDurationDays}
              publicEtoDuration={eto.publicDurationDays}
              inSigningDuration={eto.signingDurationDays}
              preMoneyValuation={eto.preMoneyValuationEur}
              newSharesGenerated={eto.newSharesToIssue}
              newSharesToIssue={eto.newSharesToIssue}
              tokenImage={{
                alt: eto.equityTokenName || "",
                srcSet: { "1x": eto.equityTokenImage || "" },
              }}
              tokenName={eto.equityTokenName || ""}
              tokenSymbol={eto.equityTokenSymbol || ""}
              campaigningWidget={{
                investorsLimit: eto.maxPledges || 0,
                maxPledge: eto.maxTicketEur || 0,
                minPledge: eto.minTicketEur || 0,
                isActivated: eto.isBookbuilding || false,
                quote: (eto.company && eto.company.keyQuoteFounder) || "",
              }}
            />
          )}
        </div>
      </Col>
    ))}
  </>
);

export const EtoList = compose<React.ComponentClass>(
  setDisplayName("EtoList"),
  onEnterAction({
    actionCreator: d => {
      d(actions.wallet.startLoadingWalletData());
      d(actions.publicEtos.loadEtos());
    },
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      etos: selectPublicEtos(state),
      wallet: state.wallet,
    }),
    dispatchToProps: d => ({
      startInvestmentFlow: (eto: TPublicEtoData) => {
        d(actions.investmentFlow.investmentStart(eto.etoId));
      },
    }),
  }),
)(EtoListComponent);

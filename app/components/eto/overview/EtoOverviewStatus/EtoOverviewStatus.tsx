import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { ProjectStatus } from "../../../shared/ProjectStatus";
import { Tag } from "../../../shared/Tag";

import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import { ETOStateOnChain } from "../../../../modules/public-etos/types";
import { IWalletState } from "../../../../modules/wallet/reducer";
import { appConnect } from "../../../../store";
import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { Button } from "../../../shared/buttons";
import { Counter } from "../../../shared/Counter";
import { PercentageIndicatorBar } from "../../../shared/PercentageIndicatorBar";
import { IResponsiveImage, ResponsiveImage } from "../../../shared/ResponsiveImage";
import { SuccessTick } from "../../../shared/SuccessTick";
import { CampaigningWidget, ICampaigningWidget } from "./CampaigningWidget";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IPublicWidgetProps {
  investorsBacked?: string | number;
  tokensGoal?: string | number;
  raisedTokens?: string | number;
  etoId: string;
}

interface IPublicWidgetDispatchProps {
  startInvestmentFlow: () => void;
}

interface IProps {
  wallet: IWalletState | undefined;
  contract: any;
  etoId: string;
  prospectusApproved: IEtoDocument;
  etoStartDate: string;
  canEnableBookbuilding: boolean;
  preEtoDuration: number | undefined;
  publicEtoDuration: number | undefined;
  inSigningDuration: number | undefined;
  preMoneyValuation: string | number | undefined;
  investmentAmount: string | number | undefined;
  newSharesGenerated: string | number | undefined;
  campaigningWidget: ICampaigningWidget;
  publicWidget: IPublicWidgetProps;
  preMoneyValuationEur?: number;
  existingCompanyShares?: number;
  equityTokensPerShare?: number;
  timedState?: number;
}

interface ICounterProps {
  endDate?: number;
  stage?: string;
}

interface IClaimWidget {
  tokenName: string;
  numberOfInvestors: number;
  raisedAmount: string | number;
  isPayout: boolean;
}

const ClaimWidget: React.SFC<IClaimWidget> = ({
  tokenName,
  numberOfInvestors,
  raisedAmount,
  isPayout,
}) => (
  <div className={styles.widgetClaim}>
    <SuccessTick />
    <div className={styles.message}>
      <FormattedMessage id="shared-component.eto-overview.success" />
      <div>
        <FormattedMessage id="shared-component.eto-overview.success.equivalent-to" />
        {` €${raisedAmount} `}
        <FormattedMessage id="shared-component.eto-overview.success.raised-by" />
        {` ${numberOfInvestors} `}
        <FormattedMessage id="shared-component.eto-overview.success.investors" />
      </div>
    </div>
    {isPayout && (
      <Button>
        <FormattedMessage id="shared-component.eto-overview.claim-your-token" /> {tokenName}
      </Button>
    )}
  </div>
);

const RefundWidget: React.SFC = () => (
  <div className={styles.widgetClaim}>
    <div className={styles.message}>
      <FormattedMessage id="shared-component.eto-overview.refund" />
    </div>
    <Button>
      <FormattedMessage id="shared-component.eto-overview.claim-your-eth-neur" />
    </Button>
  </div>
);

const CounterWidget: React.SFC<ICounterProps> = ({ endDate, stage }) => {
  return (
    <div className={styles.widgetPreEto}>
      <div className={styles.title}>
        <FormattedMessage id="shared-component.eto-overview.count-down-to" values={{ stage }} />
      </div>
      {endDate && (
        <>
          <div className={styles.zone}>{new Date(endDate).toUTCString()}</div>
          <Counter endDate={endDate} />
        </>
      )}
    </div>
  );
};

const PublicEtoWidgetComponent: React.SFC<IPublicWidgetProps & IPublicWidgetDispatchProps> = ({
  investorsBacked,
  tokensGoal,
  raisedTokens,
  startInvestmentFlow,
}) => {
  return (
    <div className={styles.widgetPublicEto}>
      <div className={styles.header}>
        <div>
          <div>{raisedTokens} nEUR</div>
        </div>
        <div>
          {`${investorsBacked} `}
          <FormattedMessage id="shared-component.eto-overview.investors" />
        </div>
      </div>
      <PercentageIndicatorBar
        theme="green"
        layout="narrow"
        className="my-2"
        fraction={raisedTokens / tokensGoal}
      />
      <div className={styles.investNowButton}>
        <Button onClick={startInvestmentFlow}>
          <FormattedMessage id="shared-component.eto-overview.invest-now" />
        </Button>
      </div>
    </div>
  );
};

const PublicEtoWidget = appConnect<{}, IPublicWidgetDispatchProps, IPublicWidgetProps>({
  dispatchToProps: (d, p) => ({
    startInvestmentFlow: () => d(actions.investmentFlow.investmentStart(p.etoId)),
  }),
})(PublicEtoWidgetComponent);

interface ITokenSymbolWidgetProps {
  tokenImage: IResponsiveImage;
  tokenName: string | undefined;
  tokenSymbol: string | undefined;
}

const WidgetTokenSymbol: React.SFC<ITokenSymbolWidgetProps> = ({
  tokenSymbol,
  tokenName,
  tokenImage,
}) => {
  return (
    <div className={styles.widgetTokenSymbol}>
      <div className={styles.tokenImageWrapper}>
        <ResponsiveImage {...tokenImage} className={styles.tokenImage} />
      </div>
      <div>
        <h3 className={styles.tokenName}>{tokenName}</h3>
        <h4 className={styles.tokenSymbol}>{tokenSymbol}</h4>
      </div>
    </div>
  );
};

interface IStatusOfEto {
  status: number;
}

const StatusOfEto: React.SFC<IStatusOfEto> = ({ status }) => {
  return (
    <div className={styles.statusOfEto}>
      <span className={styles.title}>
        <FormattedMessage id="shared-component.eto-overview.status-of-eto" />
      </span>
      <ProjectStatus status={status} />
    </div>
  );
};

const PoweredByNeufund = () => {
  return (
    <div className={styles.poweredByNeufund}>
      <div className={styles.powered}>Powered by</div>
      <div className={styles.neufund}>NEUFUND</div>
    </div>
  );
};

interface IWidgetTags {
  termSheet: IEtoDocument;
  prospectusApproved: boolean;
  smartContractOnchain: boolean;
  etoId: string;
}

const WidgetTags: React.SFC<IWidgetTags> = ({
  termSheet,
  prospectusApproved,
  smartContractOnchain,
  etoId,
}) => {
  const hasTermSheet = termSheet.name && termSheet.name.length;
  const hasProspectusApproved = prospectusApproved.name && prospectusApproved.name.length;

  const LinkedTag: React.SFC<{ href: string; text: TTranslatedString; download?: boolean }> = ({
    href,
    text,
    download,
  }) => {
    return (
      <a href={href} download={download} target="_blank">
        <Tag size="small" theme="green" layout="ghost" text={text} />
      </a>
    );
  };

  return (
    <>
      {hasTermSheet ? (
        <LinkedTag
          href={termSheet.name}
          download
          text={<FormattedMessage id="shared-component.eto-overview.term-sheet" />}
        />
      ) : (
        <Tag
          size="small"
          theme="silver"
          layout="ghost"
          text={<FormattedMessage id="shared-component.eto-overview.term-sheet" />}
        />
      )}
      {hasProspectusApproved ? (
        <LinkedTag
          href={prospectusApproved.name}
          download
          text={<FormattedMessage id="shared-component.eto-overview.prospectus-approved" />}
        />
      ) : (
        <Tag
          size="small"
          theme="silver"
          layout="ghost"
          text={<FormattedMessage id="shared-component.eto-overview.prospectus-approved" />}
        />
      )}
      {smartContractOnchain ? (
        <LinkedTag
          href={`https://etherscan.io/address/${etoId}`}
          text={<FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />}
        />
      ) : (
        <Tag
          size="small"
          theme="silver"
          layout="ghost"
          text={<FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />}
        />
      )}
    </>
  );
};

const EtoOverviewStatus: React.SFC<
  IProps & ITokenSymbolWidgetProps & IStatusOfEto & IWidgetTags & IClaimWidget & CommonHtmlProps
> = props => {
  const day = 86400000;
  const preEtoStartDate = Date.parse(props.etoStartDate);
  const publicEtoStartDate = isNaN(preEtoStartDate)
    ? NaN
    : preEtoStartDate + (props.preEtoDuration || 0) * day;

  const isEligibleToPreEto = !!(
    props.wallet &&
    props.wallet.data &&
    props.wallet.data.etherTokenICBMLockedWallet.LockedBalance !== "0"
  );

  return (
    <div className={cn(styles.etoOverviewStatus, props.className)}>
      <div className={styles.overviewWrapper}>
        <div className={styles.statusWrapper}>
          <StatusOfEto status={props.contract.timedState} />
          <Link to={withParams(appRoutes.etoPublicView, { etoId: props.etoId })}>
            <WidgetTokenSymbol
              tokenImage={props.tokenImage}
              tokenName={props.tokenName}
              tokenSymbol={props.tokenSymbol}
            />
          </Link>

          <PoweredByNeufund />
        </div>

        <div className={styles.divider} />

        <div className={styles.tagsWrapper}>
          <WidgetTags
            etoId={props.etoId}
            termSheet={props.termSheet}
            prospectusApproved={props.prospectusApproved}
            smartContractOnchain={props.smartContractOnchain}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.groupWrapper}>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
            </span>
            <span className={styles.value}>
              {"€ "}
              {props.preMoneyValuation}
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.investment-amount" />
            </span>
            <span className={styles.value}>{props.investmentAmount}</span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.new-shares-generated" />
            </span>
            <span className={styles.value}>{props.newSharesGenerated}</span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.equity-token-price" />
            </span>
            <span className={styles.value}>
              €{" "}
              {(
                (props.preMoneyValuationEur || 0) /
                (props.existingCompanyShares || 1) /
                (props.equityTokensPerShare || 1)
              ).toFixed(4)}
            </span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.stageContentWrapper}>
          {props.contract.timedState === ETOStateOnChain.Setup && (
            <CampaigningWidget
              etoId={props.etoId}
              minPledge={props.campaigningWidget.minPledge}
              maxPledge={props.campaigningWidget.maxPledge}
              isActivated={props.campaigningWidget.isActivated}
              quote={props.campaigningWidget.quote}
              investorsLimit={props.campaigningWidget.investorsLimit}
            />
          )}
          {props.contract.timedState === ETOStateOnChain.Whitelist &&
            (isEligibleToPreEto ? (
              <CounterWidget endDate={preEtoStartDate} stage="Pre ETO" />
            ) : (
              <CounterWidget endDate={publicEtoStartDate} stage="Public ETO" />
            ))}
          {(props.contract.timedState === ETOStateOnChain.Public ||
            (props.contract.timedState === ETOStateOnChain.Whitelist && isEligibleToPreEto)) && (
            <PublicEtoWidget
              raisedTokens={parseInt(
                `${props.contract.totalInvestment.totalTokensInt.toString()}`,
                10,
              )}
              investorsBacked={parseInt(
                `${props.contract.totalInvestment.totalInvestors.toString()}`,
                10,
              )}
              tokensGoal={0}
              etoId={props.etoId}
            />
          )}
          {props.contract.timedState === ETOStateOnChain.Claim && (
            <ClaimWidget
              tokenName={props.tokenName}
              numberOfInvestors={props.contract.totalInvestment.totalInvestors}
              raisedAmount={props.contract.totalInvestment.totalEquivEurUlps.toFormat(4)}
              isPayout={false}
            />
          )}
          {props.contract.timedState === ETOStateOnChain.Signing && (
            <ClaimWidget
              tokenName={props.tokenName}
              numberOfInvestors={props.contract.totalInvestment.totalInvestors}
              raisedAmount={props.contract.totalInvestment.totalEquivEurUlps.toFormat(4)}
              isPayout={false}
            />
          )}
          {props.contract.timedState === ETOStateOnChain.Payout && (
            <ClaimWidget
              tokenName={props.tokenName}
              numberOfInvestors={props.contract.totalInvestment.totalInvestors}
              raisedAmount={props.contract.totalInvestment.totalEquivEurUlps.toFormat(4)}
              isPayout={true}
            />
          )}
          {props.contract.timedState === ETOStateOnChain.Refund && <RefundWidget />}
        </div>
      </div>
    </div>
  );
};

export { EtoOverviewStatus };

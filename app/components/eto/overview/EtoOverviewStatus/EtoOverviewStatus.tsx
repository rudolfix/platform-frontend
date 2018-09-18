import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { ProjectStatus } from "../../../shared/ProjectStatus";
import { Tag } from "../../../shared/Tag";

import { EtoState } from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { CommonHtmlProps } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { Button } from "../../../shared/Buttons";
import { Counter } from "../../../shared/Counter";
import { PercentageIndicatorBar } from "../../../shared/PercentageIndicatorBar";
import { IResponsiveImage, ResponsiveImage } from "../../../shared/ResponsiveImage";
import { SuccessTick } from "../../../shared/SuccessTick";
import { CampaigningWidget, ICampaigningWidget } from "./CampaigningWidget/CampaigningWidget";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IPublicWidgetProps {
  investorsBacked: number;
  tokensGoal: number;
  raisedTokens: number;
  etoId: string;
}

interface IPublicWidgetDispatchProps {
  startInvestmentFlow: () => void;
}

interface IProps {
  etoId: string;
  prospectusApproved: boolean;
  etoStartDate: string;
  preEtoDuration: number | undefined;
  publicEtoDuration: number | undefined;
  inSigningDuration: number | undefined;
  preMoneyValuation: string | number | undefined;
  investmentAmount: string | number | undefined;
  newSharesGenerated: string | number | undefined;
  equityTokenPrice: string | number | undefined;
  campaigningWidget: ICampaigningWidget;
  publicWidget: IPublicWidgetProps;
}

interface IPreEtoProps {
  endDate?: number;
}

interface IClaimWidget {
  tokenName: string;
  numberOfInvestors: number;
  raisedAmount: string | number;
  timeToClaim: number;
}

const ClaimWidget: React.SFC<IClaimWidget> = ({
  tokenName,
  numberOfInvestors,
  raisedAmount,
  timeToClaim,
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
    {timeToClaim === 0 ? (
      <Button>
        <FormattedMessage id="shared-component.eto-overview.claim-your-token" /> {tokenName}
      </Button>
    ) : (
      <p>
        <FormattedMessage
          id="shared-component.eto-overview.claim-your-token-sign-in"
          values={{ timeToClaim, tokenName }}
        />
      </p>
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

const PreEtoWidget: React.SFC<IPreEtoProps> = ({ endDate }) => {
  return (
    <div className={styles.widgetPreEto}>
      <div className={styles.title}>
        <FormattedMessage id="shared-component.eto-overview.count-down-to-eto" />
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
  status: string;
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
  termSheet: boolean;
  prospectusApproved: boolean;
  smartContractOnchain: boolean;
}

const WidgetTags: React.SFC<IWidgetTags> = ({
  termSheet,
  prospectusApproved,
  smartContractOnchain,
}) => {
  return (
    <>
      <Tag
        size="small"
        theme={termSheet ? "green" : "silver"}
        layout="ghost"
        text={<FormattedMessage id="shared-component.eto-overview.term-sheet" />}
      />
      <Tag
        size="small"
        theme={prospectusApproved ? "green" : "silver"}
        layout="ghost"
        text={<FormattedMessage id="shared-component.eto-overview.prospectus-approved" />}
      />
      <Tag
        size="small"
        theme={smartContractOnchain ? "green" : "silver"}
        layout="ghost"
        text={<FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />}
      />
    </>
  );
};

const EtoOverviewStatus: React.SFC<
  IProps & ITokenSymbolWidgetProps & IStatusOfEto & IWidgetTags & IClaimWidget & CommonHtmlProps
> = props => {
  const day = 86400000;
  const today = Date.now() + 50;
  const preEtoStartDate = Date.parse(props.etoStartDate);
  const publicEtoStartDate = isNaN(preEtoStartDate)
    ? NaN
    : preEtoStartDate + (props.preEtoDuration || 0) * day;
  const inSigningStartDate = isNaN(publicEtoStartDate)
    ? NaN
    : publicEtoStartDate + (props.publicEtoDuration || 0) * day;
  const inSigningEndDate = isNaN(inSigningStartDate)
    ? NaN
    : inSigningStartDate + (props.inSigningDuration || 0) * day;

  return (
    <div className={cn(styles.etoOverviewStatus, props.className)}>
      <div className={styles.overviewWrapper}>
        <div className={styles.statusWrapper}>
          <StatusOfEto status={props.status} />
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
            <span className={styles.value}>{props.equityTokenPrice}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.stageContentWrapper}>
          {props.status === EtoState.ON_CHAIN &&
            !preEtoStartDate &&
            props.campaigningWidget && (
              <CampaigningWidget
                etoId={props.etoId}
                minPledge={props.campaigningWidget.minPledge}
                maxPledge={props.campaigningWidget.maxPledge}
                isActivated={props.campaigningWidget.isActivated}
                quote={props.campaigningWidget.quote}
                investorsLimit={props.campaigningWidget.investorsLimit}
              />
            )}
          {props.status === EtoState.ON_CHAIN &&
            today >= preEtoStartDate &&
            today < publicEtoStartDate && (
              // TODO: Check if you are able to invest
              <PreEtoWidget endDate={publicEtoStartDate} />
            )}
          {props.status === EtoState.ON_CHAIN &&
            today < preEtoStartDate && (
              // today >= publicEtoStartDate &&
              // today < inSigningStartDate &&
              <PublicEtoWidget
                raisedTokens={0}
                investorsBacked={0}
                tokensGoal={0}
                etoId={props.etoId}
              />
            )}
          {props.status === EtoState.ON_CHAIN &&
            today >= inSigningStartDate &&
            today < inSigningEndDate && (
              <ClaimWidget
                tokenName={props.tokenName}
                numberOfInvestors={props.numberOfInvestors}
                raisedAmount={props.raisedAmount}
                timeToClaim={props.timeToClaim}
              />
            )}
          {/* // TODO: connect when state will be avaliable */}
          {/* {props.status === "claim" && (
            <ClaimWidget
              tokenName={props.tokenName}
              numberOfInvestors={props.numberOfInvestors}
              raisedAmount={props.raisedAmount}
              timeToClaim={props.timeToClaim}
            />
          )} */}
          {props.status === "refund" && <RefundWidget />}
        </div>
      </div>
    </div>
  );
};

export { EtoOverviewStatus };

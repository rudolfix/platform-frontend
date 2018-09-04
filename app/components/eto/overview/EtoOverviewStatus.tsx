import * as cn from "classnames";
import { Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { CommonHtmlProps } from "../../../types";
import { ProjectStatus, TStatus } from "../../shared/ProjectStatus";
import { Tag } from "../../shared/Tag";

import { Button } from "../../shared/Buttons";
import Counter from "../../shared/Counter";
import { FormField } from "../../shared/forms/forms";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";
import { IResponsiveImage, ResponsiveImage } from "../../shared/ResponsiveImage";

import * as styles from "./EtoOverviewStatus.module.scss";

interface ICampaigningWidget {
  amountBacked: string;
  investorsBacked: number;
}

interface IPublicWidget {
  endInDays: number;
  investorsBacked: number;
  tokensGoal: number;
  raisedTokens: number;
}

interface IProps {
  prospectusApproved: boolean;
  preMoneyValuation: string;
  investmentAmount: string;
  newSharesGenerated: string;
  equityTokenPrice: string;
  publicWidget?: IPublicWidget;
  campaigningWidget?: ICampaigningWidget;
}

const CampaigningWidget: React.SFC<ICampaigningWidget> = ({ amountBacked, investorsBacked }) => {
  return (
    <div className={styles.widgetCampaigning}>
      <div className={styles.group}>
        <span className={styles.label}>
          <FormattedMessage id="shared-component.eto-overview.amount-backed" />
        </span>
        <span className={styles.value}>{amountBacked}</span>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>
          <FormattedMessage id="shared-component.eto-overview.investors-backed" />
        </span>
        <span className={styles.value}>{investorsBacked}</span>
      </div>
      <div>
        {/* TODO: change this dummy data once the logic is available */}
        <Formik initialValues={{ amount: 100 }} onSubmit={() => {}}>
          {() => (
            <Row>
              <Col xs={12} lg={6}>
                <FormField name="amount" prefix="€" />
              </Col>
              <Col xs={12} lg={6}>
                <Button type="submit">
                  <FormattedMessage id="shared-component.eto-overview.back-now" />
                </Button>
              </Col>
            </Row>
          )}
        </Formik>
      </div>
    </div>
  );
};

const ClaimWidget: React.SFC<{ tokenName?: string }> = ({ tokenName }) => (
  <div className={styles.widgetClaim}>
    <div className={styles.message}>
      <FormattedMessage id="shared-component.eto-overview.success" />
    </div>
    <Button>
      <FormattedMessage id="shared-component.eto-overview.claim-your-token" /> {tokenName}
    </Button>
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

const PreEtoWidget: React.SFC = () => (
  <div className={styles.widgetPreEto}>
    <div className={styles.title}>
      <FormattedMessage id="shared-component.eto-overview.count-down-to-eto" />
    </div>
    <div className={styles.zone}>UTC 22/07/2019</div>
    <Counter />
  </div>
);

const PublicEtoWidget: React.SFC<IPublicWidget> = ({
  endInDays,
  investorsBacked,
  tokensGoal,
  raisedTokens,
}) => {
  return (
    <div className={styles.widgetPublicEto}>
      <div className={styles.header}>
        <span className={styles.investorsBacked}>
          <FormattedMessage id="shared-component.eto-overview.investors-backed" />
          <span>{investorsBacked}</span>
        </span>
        <span>
          <FormattedMessage id="shared-component.eto-overview.ends-in" values={{ endInDays }} />
        </span>
      </div>
      <PercentageIndicatorBar className="my-2" fraction={raisedTokens / tokensGoal} />
      <div>
        {raisedTokens} / {tokensGoal} nEUR
      </div>
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <Row>
            <Col xs={12} lg={6}>
              <FormField name="" prefix="€" />
            </Col>
            <Col xs={12} lg={6}>
              <Button type="submit">
                <FormattedMessage id="shared-component.eto-overview.invest-now" />
              </Button>
            </Col>
          </Row>
        )}
      </Formik>
    </div>
  );
};

interface ITokenSymbolWidgetProps {
  tokenImage: IResponsiveImage;
  tokenName: string;
  tokenSymbol: string;
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
  status: TStatus;
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
      {termSheet && (
        <Tag
          size="small"
          theme="green"
          layout="ghost"
          text={<FormattedMessage id="shared-component.eto-overview.term-sheet" />}
        />
      )}
      {prospectusApproved && (
        <Tag
          size="small"
          theme="green"
          layout="ghost"
          text={<FormattedMessage id="shared-component.eto-overview.prospectus-approved" />}
        />
      )}
      {smartContractOnchain && (
        <Tag
          size="small"
          theme="green"
          layout="ghost"
          text={<FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />}
        />
      )}
    </>
  );
};

export const EtoOverviewStatus: React.SFC<
  IProps & ITokenSymbolWidgetProps & IStatusOfEto & IWidgetTags & CommonHtmlProps
> = props => {
  const hasTags = props.termSheet || props.prospectusApproved || props.smartContractOnchain;

  return (
    <div className={cn(styles.etoOverviewStatus, props.className)}>
      <div className={styles.overviewWrapper}>
        <div className={styles.statusWrapper}>
          <StatusOfEto status={props.status} />

          <WidgetTokenSymbol
            tokenImage={props.tokenImage}
            tokenName={props.tokenName}
            tokenSymbol={props.tokenSymbol}
          />

          <PoweredByNeufund />
        </div>

        <div className={styles.divider} />

        {hasTags && (
          <div className={styles.tagsWrapper}>
            <WidgetTags
              termSheet={props.termSheet}
              prospectusApproved={props.prospectusApproved}
              smartContractOnchain={props.smartContractOnchain}
            />
          </div>
        )}

        <div className={styles.divider} />

        <div className={styles.detailsWrapper}>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
            </span>
            <span className={styles.value}>{props.preMoneyValuation}</span>
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
          {props.status === "campaigning" &&
            props.campaigningWidget && (
              <CampaigningWidget
                amountBacked={props.campaigningWidget.amountBacked}
                investorsBacked={props.campaigningWidget.investorsBacked}
              />
            )}
          {props.status === "pre-eto" && <PreEtoWidget />}
          {props.status === "public-eto" && (
            <PublicEtoWidget
              endInDays={props.publicWidget!.endInDays}
              investorsBacked={props.publicWidget!.investorsBacked}
              tokensGoal={props.publicWidget!.tokensGoal}
              raisedTokens={props.publicWidget!.raisedTokens}
            />
          )}
          {props.status === "in-signing" && (
            <PublicEtoWidget
              endInDays={props.publicWidget!.endInDays}
              investorsBacked={props.publicWidget!.investorsBacked}
              tokensGoal={props.publicWidget!.tokensGoal}
              raisedTokens={props.publicWidget!.raisedTokens}
            />
          )}
          {props.status === "claim" && <ClaimWidget tokenName={props.tokenName} />}
          {props.status === "refund" && <RefundWidget />}
        </div>
      </div>
    </div>
  );
};

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
  tokenName: string;
  tokenSymbol: string;
  status: TStatus;
  image: IResponsiveImage;
  prospectusApproved: boolean;
  onchain: boolean;
  companyValuation: string;
  declaredCap: string;
  companyEquity: string;
  tokenPrice: string;
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
        <Formik initialValues={{}} onSubmit={() => {}}>
          {() => (
            <Row>
              <Col xs={12} lg={6}>
                <FormField name="" prefix="€" />
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

const ClaimWidget: React.SFC<{ tokenName: string }> = ({ tokenName }) => (
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

export const EtoOverviewStatus: React.SFC<IProps & CommonHtmlProps> = props => (
  <div className={cn(styles.etoOverviewStatus, props.className)}>
    <div className={styles.overviewWrapper}>
      <div className={styles.statusWrapper}>
        <div className={styles.statusOfEto}>
          <span className={styles.title}>
            <FormattedMessage id="shared-component.eto-overview.status-of-eto" />
          </span>
          <ProjectStatus status={props.status} />
        </div>
        <div className={styles.tokenDetails}>
          <div className={styles.image}>
            <ResponsiveImage {...props.image} />
          </div>
          <div>
            <h3 className={styles.tokenName}>{props.tokenName}</h3>
            <h4 className={styles.tokenSymbol}>{props.tokenSymbol}</h4>
          </div>
        </div>
        <div>
          {props.prospectusApproved && (
            <Tag
              size="small"
              theme="green"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.company-valuation" />}
            />
          )}
          {props.onchain && (
            <Tag
              size="small"
              theme="green"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.company-onchain" />}
            />
          )}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.detailsWrapper}>
        <div className={styles.group}>
          <span className={styles.label}>
            <FormattedMessage id="shared-component.eto-overview-status.company-valuation" />
          </span>
          <span className={styles.value}>{props.companyValuation}</span>
        </div>
        <div className={styles.group}>
          <span className={styles.label}>
            <FormattedMessage id="shared-component.eto-overview-status.declared-cap" />
          </span>
          <span className={styles.value}>{props.declaredCap}</span>
        </div>
        <div className={styles.group}>
          <span className={styles.label}>
            <FormattedMessage id="shared-component.eto-overview-status.company-equity" />
          </span>
          <span className={styles.value}>{props.companyEquity}</span>
        </div>
        <div className={styles.group}>
          <span className={styles.label}>
            <FormattedMessage id="shared-component.eto-overview-status.token-price" />
          </span>
          <span className={styles.value}>{props.tokenPrice}</span>
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

import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import Counter from "../../shared/Counter";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { PanelWhite } from "../../shared/Panel";
import { ProjectStatus, TStatus } from "../../shared/ProjectStatus";
import { EtoTimeline } from "./EtoTimeline";

import * as stylesCommon from "../EtoOverviewCommon.module.scss";
import * as styles from "./EtoOverviewStatus.module.scss";

interface IProps {
  cap: string;
  duration: string;
  tokensSupply: string;
  tokenName: string;
  tokenImg: string;
  status: TStatus;
}

const day = 86400000;
const etoStartDate = Date.now() - 20 * day;
const bookBuildingEndDate = etoStartDate + 16 * day;
const whitelistedEndDate = bookBuildingEndDate + 7 * day;
const publicEndDate = whitelistedEndDate + 7 * day;
const inSigningEndDate = publicEndDate + 14 * day;
const etoEndDate = inSigningEndDate + 7 * day;

export const EtoOverviewStatus: React.SFC<IProps> = props => (
  <PanelWhite>
    <div className={stylesCommon.container}>
      <Row>
        <Col>
          <div className={styles.overview}>
            <div className={styles.left}>
              <div className={cn(styles.divided, "cn-2")}>
                <strong className={stylesCommon.label}>
                  <FormattedMessage id="eto.overview.overview-status.status-of-your-eto" />
                </strong>
                <ProjectStatus status={props.status} />
              </div>
              <div className={styles.divided}>
                <strong className={cn(stylesCommon.label, "mb-2")}>
                  <FormattedMessage id="eto.overview.overview-status.time-to-end-of-the-round" />
                </strong>
                <Counter />
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.details}>
                <strong className={cn(stylesCommon.label, "mb-1")}>
                  <FormattedMessage id="eto.overview.overview-status.list.declared-cap" />
                </strong>
                <span>{props.cap}</span>
              </div>
              <div className={styles.details}>
                <strong className={cn(stylesCommon.label, "mb-1")}>
                  <FormattedMessage id="eto.overview.overview-status.list.declared-duration" />
                </strong>
                <span>{props.duration}</span>
              </div>
              <div className={styles.details}>
                <strong className={cn(stylesCommon.label, "mb-1")}>
                  <FormattedMessage id="eto.overview.overview-status.list.tokens-supply" />
                </strong>
                <span>{props.tokensSupply}</span>
              </div>
              <div className={styles.details}>
                <strong className={cn(stylesCommon.label, "mb-1")}>
                  <FormattedMessage id="eto.overview.overview-status.list.token-symbol" />
                </strong>
                <span className={styles.token}>
                  <img src={props.tokenImg} />
                  {props.tokenName}
                </span>
              </div>
            </div>
          </div>
          <HorizontalLine className="my-3 d-none d-lg-block" />
          <div>
            <strong className="d-none d-lg-block">
              <span className={cn(stylesCommon.label, "mb-3")}>
                <FormattedMessage id="eto.overview.overview-status.time" />
              </span>
              <EtoTimeline
                bookBuildingEndDate={bookBuildingEndDate}
                whitelistedEndDate={whitelistedEndDate}
                publicEndDate={publicEndDate}
                inSigningEndDate={inSigningEndDate}
                etoStartDate={etoStartDate}
                etoEndDate={etoEndDate}
                status={props.status}
              />
            </strong>
          </div>
        </Col>
      </Row>
    </div>
  </PanelWhite>
);

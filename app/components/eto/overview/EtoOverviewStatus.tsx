import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";

import Counter from "../../shared/Counter";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { PanelWhite } from "../../shared/PanelWhite";

import { ProjectStatus } from "../../shared/ProjectStatus";
import * as stylesCommon from "../EtoOverviewCommon.module.scss";
import * as styles from "./EtoOverviewStatus.module.scss";
import { EtoTimeline } from "./EtoTimeline";

interface IProps {
  cap: string;
  duration: string;
  tokensSupply: string;
  tokenName: string;
  tokenImg: string;
}

export const EtoOverviewStatus: React.SFC<IProps> = (props) => (
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
                <ProjectStatus status="whitelisted" />
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
                <span>
                  {props.cap}
                </span>
              </div>
              <div className={styles.details}>
                <strong className={cn(stylesCommon.label, "mb-1")}>
                  <FormattedMessage id="eto.overview.overview-status.list.declared-duration" />
                </strong>
                <span>
                  {props.duration}
                </span>
              </div>
              <div className={styles.details}>
                <strong className={cn(stylesCommon.label, "mb-1")}>
                  <FormattedMessage id="eto.overview.overview-status.list.tokens-supply" />
                </strong>
                <span>
                  {props.tokensSupply}
                </span>
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
          <HorizontalLine className="my-3" />
          <div>
            <strong>
              <span className="mb-3">
                <FormattedMessage id="eto.overview.overview-status.time" />
              </span>
              <EtoTimeline />
            </strong>
          </div>
        </Col>
      </Row>
    </div>
  </PanelWhite>
);

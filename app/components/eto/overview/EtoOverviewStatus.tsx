import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";

import { HorizontalLine } from "../../shared/HorizontalLine";
import { PanelWhite } from "../../shared/PanelWhite";

import * as stylesCommon from "../EtoOverviewCommon.module.scss";
import * as styles from "./EtoOverviewStatus.module.scss";

interface IProps {

}

export const EtoOverviewStatus: React.SFC<IProps> = () => (
  <PanelWhite>
    <div className={stylesCommon.container}>
      <Row>
        <Col>
          <div>
            <div>
              <div>
                <h4 className={styles.stylesCommon}><FormattedMessage id="eto.overview.overview-status.status-of-your-eto" /></h4>
              </div>
              <div>
                <h4 className={styles.stylesCommon}><FormattedMessage id="eto.overview.overview-status.time-to-end-of-the-round" /></h4>
              </div>
            </div>
            <ul>
              <li>
                <strong>
                  <FormattedMessage id="eto.overview.overview-status.list.declared-cap" />
                </strong>
                <span>
                </span>
              </li>
              <li>
                <strong>
                  <FormattedMessage id="eto.overview.overview-status.list.declared-duration" />
                </strong>
                <span>

                </span>
              </li>
              <li>
                <strong>
                  <FormattedMessage id="eto.overview.overview-status.list.tokens-supply" />
                </strong>
                <span>

                </span>
              </li>
              <li>
                <strong>
                  <FormattedMessage id="eto.overview.overview-status.list.token-symbol" />
                </strong>
                <span>

                </span>
              </li>
            </ul>
          </div>
          <HorizontalLine />
          <div>
            <h4></h4>
          </div>
        </Col>
      </Row>
    </div>
  </PanelWhite>
);

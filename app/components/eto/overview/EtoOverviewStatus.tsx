import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";

import { HorizontalLine } from "../../shared/HorizontalLine";
import { PanelWhite } from "../../shared/PanelWhite";

interface IProps {

}

export const EtoOverviewStatus: React.SFC<IProps> = () => (
  <PanelWhite>
    <Container>
      <Row>
        <Col>
          <div>
            <div>
              <h4><FormattedMessage id="eto.overview.overview-status.status-of-your-eto" /></h4>
              <h5><FormattedMessage id="eto.overview.overview-status.time-to-end-of-the-round" /></h5>
            </div>
            <ul>
              <li>
                <strong>
                  <FormattedMessage id="eto.overview.overview-status.list.declared-cap.label" />
                </strong>
                <span>
                  <FormattedMessage id="eto.overview.overview-status.list.declared-cap.value" />
                </span>
              </li>
              <li>
                <strong>
                  <FormattedMessage id="eto.overview.overview-status.list.declared-duration.label" />
                </strong>
                <span>
                  <FormattedMessage id="eto.overview.overview-status.list.declared-duration.value" />
                </span>
              </li>
              <li>
                <strong>
                  <FormattedMessage id="eto.overview.overview-status.list.tokens-supply.label" />
                </strong>
                <span>
                  <FormattedMessage id="eto.overview.overview-status.list.tokens-supply.value" />
                </span>
              </li>
              <li>
                <strong>
                  <FormattedMessage id="eto.overview.overview-status.list.tokens-symbol.label" />
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
    </Container>
  </PanelWhite>
);

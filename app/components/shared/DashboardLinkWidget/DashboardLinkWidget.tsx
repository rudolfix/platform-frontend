import * as cn from "classnames";
import * as H from "history";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";

import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { appRoutes } from "../../appRoutes";
import { ButtonArrowRight } from "../Buttons";
import { Panel } from "../Panel";

import * as styles from "./DashboardLinkWidget.module.scss";

interface IProps {
  title: string;
  text: string | React.ReactNode;
  to: H.LocationDescriptor;
  buttonText: string | React.ReactNode;
}

export const DashboardLinkWidget: React.SFC<IProps> = ({ title, text, to, buttonText }) => {
  return (
    <Panel headerText={title}>
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>{text}</p>
        <Col className="d-flex justify-content-center">
          <Link to={appRoutes.documents}>
            <ButtonArrowRight>{buttonText}</ButtonArrowRight>
          </Link>
        </Col>
      </div>
    </Panel>
  );
};

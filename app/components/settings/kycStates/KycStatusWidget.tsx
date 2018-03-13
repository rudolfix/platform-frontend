import * as cn from "classnames";
import * as React from "react";
import * as styles from "./KycStatusWidget.module.scss";

import * as successIcon from "../../../assets/img/notfications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notfications/warning.svg";

import { Col } from "reactstrap";
import { ArrowLink } from "../../shared/ArrowLink";
import { PanelDark } from "../../shared/PanelDark";

//This is a mock implementation
interface IProps {
  kycDone?: boolean;
}

export const KycStatusWidget: React.SFC<IProps> = ({ kycDone }) => {
  return (
    <PanelDark
      headerText="KYC PROCESS"
      className={styles.panel}
      rightComponent={
        kycDone ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        )
      }
    >
      {kycDone ? (
        <div data-test-id="verified-section" className={cn(styles.content)}>
          <div className="mt-3">Your verification is complete. </div>
        </div>
      ) : (
        <div
          data-test-id="unverified-section"
          className={cn(styles.content, "d-flex flex-wrap align-content-around")}
        >
          <p>Lorem upsom Kyc who bla once check rep</p>
          <Col xs={12} className="d-flex justify-content-center">
            <ArrowLink arrowDirection="right" to="#">
              Verify KYC
            </ArrowLink>
          </Col>
        </div>
      )}
    </PanelDark>
  );
};

//TODO: Connect Widget With status

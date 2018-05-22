import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Link } from "react-router-dom";
import { Button } from "../shared/Buttons";
import { PanelWhite } from "../shared/PanelWhite";
import { IVerificationProgressStep, VerificationStatus } from "../shared/VerificationStatus";

import * as arrowLeft from "../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./KycPanel.module.scss";

interface IPropsKycPanel {
  backLink?: string;
  isMaxWidth?: boolean;
  description?: string | React.ReactNode;
  steps: IVerificationProgressStep[];
  title?: string | React.ReactNode;
}

export const KycPanel: React.SFC<IPropsKycPanel> = ({
  title,
  steps,
  children,
  description,
  backLink,
  isMaxWidth,
}) => (
  <div className={`${styles.kycPanel} ${isMaxWidth ? styles.kycPanelMax : ""}`}>
    <PanelWhite className="mt-4">
      <header className={styles.header}>
        <h2 className={styles.title}>
          {title || <FormattedMessage id="kyc.panel.verification" />}
        </h2>
        <VerificationStatus steps={steps} />
        {description && <div className={styles.description}>{description}</div>}
      </header>
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        {backLink && (
          <Link to={backLink}>
            <Button layout="secondary" iconPosition="icon-before" svgIcon={arrowLeft}>
              <FormattedMessage id="kyc.panel.go-back" />
            </Button>
          </Link>
        )}
      </footer>
    </PanelWhite>
  </div>
);

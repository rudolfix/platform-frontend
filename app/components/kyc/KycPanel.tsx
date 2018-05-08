import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Link } from "react-router-dom";
import { Button } from "../shared/Buttons";
import { PanelWhite } from "../shared/PanelWhite";
import { IProgresStepper, ProgressStepper } from "../shared/ProgressStepper";

import * as arrowLeft from "../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./KycPanel.module.scss";

interface IPropsKycPanel {
  title: string | React.ReactNode;
  backLink?: string;
  isMaxWidth?: boolean;
  description?: string | React.ReactNode;
}

export const KycPanel: React.SFC<IPropsKycPanel & IProgresStepper> = ({
  steps,
  currentStep,
  title,
  children,
  description,
  backLink,
  isMaxWidth,
}) => (
  <div className={`${styles.kycPanel} ${isMaxWidth ? styles.kycPanelMax : ""}`}>
    <PanelWhite className="mt-4">
      <header className={styles.header}>
        <ProgressStepper steps={steps} currentStep={currentStep} />
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
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

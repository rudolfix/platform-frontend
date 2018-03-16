import * as React from "react";
import * as styles from "./KycPanel.module.scss";

import { ArrowLink } from "../shared/ArrowLink";
import { PanelWhite } from "../shared/PanelWhite";
import { IProgresStepper, ProgressStepper } from "../shared/ProgressStepper";

interface IPropsKycPanel {
  title: string;
  hasBackButton: boolean;
  isMaxWidth?: boolean;
  description?: string;
}

export const KycPanel: React.SFC<IPropsKycPanel & IProgresStepper> = ({
  steps,
  currentStep,
  title,
  children,
  description,
  hasBackButton,
  isMaxWidth,
}) => (
  <div className={`${styles.kycPanel} ${isMaxWidth ? styles.kycPanelMax : ""}`}>
    <PanelWhite>
      <header className={styles.header}>
        <ProgressStepper steps={steps} currentStep={currentStep} />
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </header>
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        {hasBackButton && (
          <ArrowLink arrowDirection={"left"} to="">
            BACK
          </ArrowLink>
        )}
      </footer>
    </PanelWhite>
  </div>
);

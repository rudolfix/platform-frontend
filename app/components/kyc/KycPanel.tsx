import * as React from "react";
import * as styles from "./KycPanel.module.scss";

import { Button } from "../shared/Buttons";
import { PanelWhite } from "../shared/PanelWhite";
import { IProgresStepper, ProgressStepper } from "../shared/ProgressStepper";

import * as arrowLeft from "../../assets/img/inline_icons/arrow_left.svg";

interface IPropsKycPanel {
  title: string;
  hasBackButton?: boolean;
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
    <PanelWhite className="mt-4">
      <header className={styles.header}>
        <ProgressStepper steps={steps} currentStep={currentStep} />
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </header>
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        {hasBackButton && (
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={arrowLeft}
            onClick={() => {}}
          >
            BACK
          </Button>
        )}
      </footer>
    </PanelWhite>
  </div>
);

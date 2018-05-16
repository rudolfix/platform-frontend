import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "../../shared/Buttons";
import { PanelWhite } from "../../shared/PanelWhite";
import { IProgressStepper, ProgressStepper } from "../../shared/ProgressStepper";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./EtoRegistrationPanel.module.scss";

interface IPropsKycPanel {
  title: string;
  hasBackButton?: boolean;
  isMaxWidth?: boolean;
  description?: string;
}

export const EtoRegistrationPanel: React.SFC<IPropsKycPanel & IProgressStepper> = ({
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
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={arrowLeft}
            onClick={() => {}}
          >
            <FormattedMessage id="form.button.back" />
          </Button>
        )}
      </footer>
    </PanelWhite>
  </div>
);

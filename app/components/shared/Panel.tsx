import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../types";
import { PanelBase } from "./PanelBase";
import { PanelHeader } from "./PanelHeader";

import * as styles from "./Panel.module.scss";

export interface IPanelProps extends CommonHtmlProps {
  headerText?: TTranslatedString;
  rightComponent?: React.ReactNode;
  icon?: string;
  narrow?: boolean;
  centerContent?: boolean;
}

const Panel: React.FunctionComponent<IPanelProps> = ({
  headerText,
  rightComponent,
  icon,
  className,
  children,
  narrow,
  centerContent,
  ...props
}) => {
  const hasHeader = !!(headerText || rightComponent || icon);

  return (
    <PanelBase {...props} className={className} narrow={narrow}>
      {hasHeader && (
        <PanelHeader icon={icon} headerText={headerText} rightComponent={rightComponent} />
      )}
      <div className={cn(styles.content, centerContent ? "justify-content-center" : null)}>
        {children}
      </div>
    </PanelBase>
  );
};

export { Panel };

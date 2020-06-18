import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../types";
import { Container, EColumnSpan, EContainerType } from "../layouts/Container";
import { EHeadingSize, Heading } from "./Heading";

import * as styles from "./Panel.module.scss";

export enum EPanelPadding {
  NARROW = styles.narrowPadding,
  NORMAL = styles.normalPadding,
  NO_PADDING = styles.noPadding,
}

export interface IPanelProps {
  /**
   * @deprecated It was a hasty abstraction to include header in Panel given it's size and UI is not always the same
   */
  headerText?: TTranslatedString;
  /**
   * @deprecated Same as with header. If we remove header then right component should be provided by consumer manually
   */
  rightComponent?: React.ReactNode;
  /**
   * @deprecated Same with icon.
   */
  icon?: string;
  padding?: EPanelPadding;
  columnSpan?: EColumnSpan;
  type?: EContainerType;
  className?: string;
}

const PanelBase: React.FunctionComponent<IPanelProps> = ({
  headerText,
  rightComponent,
  className,
  children,
  padding,
  ...props
}) => (
  <Container className={cn(styles.panel, className, padding)} {...props}>
    {(headerText || rightComponent) && (
      <div className={cn(styles.header)}>
        {headerText}
        {rightComponent}
      </div>
    )}
    {children}
  </Container>
);

/**
 * @deprecated Is not used anywhere in new pattern library. Replaced by PanelRounded and PanelGray
 */
const Panel: React.FunctionComponent<IPanelProps> = ({
  children,
  className,
  headerText,
  icon,
  padding = EPanelPadding.NORMAL,
  ...props
}) => (
  <PanelBase
    headerText={
      headerText ? (
        <Heading level={3} size={EHeadingSize.SMALL} decorator={icon}>
          {headerText}
        </Heading>
      ) : (
        undefined
      )
    }
    className={cn(styles.defaultPanel, className)}
    padding={padding}
    {...props}
  >
    {children}
  </PanelBase>
);

const PanelRounded: React.FunctionComponent<IPanelProps> = ({
  children,
  className,
  // TODO: Make the padding default style consistent
  padding = EPanelPadding.NO_PADDING,
  ...props
}) => (
  <PanelBase className={cn(styles.rounded, className)} padding={padding} {...props}>
    {children}
  </PanelBase>
);

const PanelGray: React.FunctionComponent<IPanelProps> = ({
  children,
  className,
  padding = EPanelPadding.NORMAL,
  ...props
}) => (
  <PanelBase className={cn(styles.gray, className)} padding={padding} {...props}>
    {children}
  </PanelBase>
);

export { Panel, PanelRounded, PanelGray };

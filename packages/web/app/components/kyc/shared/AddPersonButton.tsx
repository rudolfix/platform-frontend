import {
  Button,
  EButtonLayout,
  EButtonSize,
  EButtonWidth,
  EIconPosition,
} from "@neufund/design-system";
import * as React from "react";

import plusIcon from "../../../assets/img/inline_icons/round_plus.svg";
import * as styles from "./AddPersonButton.module.scss";

interface IProps {
  children: React.ReactNode;
  onClick: () => void;
  dataTestId: string;
}

export const AddPersonButton: React.FunctionComponent<IProps> = ({
  children,
  onClick,
  dataTestId,
}) => (
  <Button
    className={styles.addButton}
    data-test-id={dataTestId}
    layout={EButtonLayout.OUTLINE}
    width={EButtonWidth.BLOCK}
    size={EButtonSize.HUGE}
    iconPosition={EIconPosition.ICON_BEFORE}
    svgIcon={plusIcon}
    onClick={onClick}
  >
    {children}
  </Button>
);

import { Button, EButtonLayout, EButtonSize, EButtonWidth } from "@neufund/design-system";
import * as React from "react";

import { InlineIcon } from "../../shared/icons/InlineIcon";

import arrow from "../../../assets/img/inline_icons/link_arrow.svg";
import * as styles from "./Person.module.scss";

interface IProps {
  onClick: () => void;
  name: string;
}

export const Person: React.FunctionComponent<IProps> = ({ onClick, name }) => (
  <Button
    layout={EButtonLayout.SECONDARY}
    className={styles.card}
    width={EButtonWidth.BLOCK}
    size={EButtonSize.HUGE}
    onClick={onClick}
  >
    <span className={styles.name}>{name}</span>
    <InlineIcon width="24px" height="24px" className={styles.icon} svgIcon={arrow} />
  </Button>
);

import * as cn from "classnames";
import * as React from "react";
import { Button } from "reactstrap";
import * as styles from "./StandardButton.module.scss";

interface IButtonProps {
  text?: string;
  onClick?: () => void;
}

export const StandardButton: React.SFC<IButtonProps> = ({ text, onClick }) => (
  <Button
    outline
    color="dark"
    block
    className={cn("rounded-0", styles.standardButton)}
    onClick={onClick}
  >
    {text}
  </Button>
);

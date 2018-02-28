import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";
import * as styles from "./StandardButton.module.scss";

interface IButtonProps {
  text: string;
  to: string;
}

export const StandardLink: React.SFC<IButtonProps> = ({ text, to }) => (
  <Link className={cn("rounded-0 btn btn-outline-dark w-100", styles.standardButton)} to={to}>
    {text}
  </Link>
);

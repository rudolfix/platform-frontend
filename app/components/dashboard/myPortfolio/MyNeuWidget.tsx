import * as cn from "classnames";
import * as React from "react";
import { Row } from "reactstrap";
import * as icon from "../../../assets/img/neu_icon.svg";
import { ArrowLink } from "../../shared/ArrowLink";
import * as styles from "./MyNeuWidget.module.scss";

interface IProps {
  mode: "broke" | "money";
}
export const MyNeuWidget: React.SFC<IProps> = props => {
  return props.mode === "broke" ? (
    <div className={cn(styles.background, "text-center")}>
      <h5 className="text-light text-left mb-5 pl-3 pt-1">YOUR NEUMARK</h5>
      <h3 className="text-light mb-5 align-items-center">
        <img src={icon} className={cn(styles.icon, "mr-2")} />0.0000 NEU
      </h3>
      <ArrowLink arrowDirection="right" to="#" className="text-light">
        About NEU
      </ArrowLink>
    </div>
  ) : (
    <div className={cn(styles.background, "text-center")}>
      <h5 className="text-light text-left mb-3 pl-3 pt-1">YOUR NEUMARK</h5>
      <Row className="justify-content-center" noGutters>
        <img src={icon} className={cn(styles.icon, "mr-3")} />
        <div className="text-light text-left">
          <h3 className="text-light">25.0045 NEU</h3>
          <p>= 456.678 EUR</p>
          <p className="mb-1">Outstanding NEU</p>
          <p className={styles.color}>+ 0.5637 NEU</p>
        </div>
      </Row>
    </div>
  );
};

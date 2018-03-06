import * as React from "react";
import { ButtonSecondaryLink } from "./Buttons";

interface IProp {
  arrowDirection: "left" | "right";
  to: string;
  className?: string;
}

export const ArrowLink: React.SFC<IProp> = ({ className, children, ...props }) => (
  <ButtonSecondaryLink to={props.to} className={className}>
    {props.arrowDirection === "left" ? (
      <div>
        <i data-test-id="ArrowLink-arrow-left" className="fa fa-lg fa-angle-left mr-1" /> {children}
      </div>
    ) : (
      <div>
        {children}
        <i data-test-id="ArrowLink-arrow-right" className="fa fa-lg fa-angle-right ml-1" />
      </div>
    )}
  </ButtonSecondaryLink>
);

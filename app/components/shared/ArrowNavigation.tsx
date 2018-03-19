import * as React from "react";
import { LinkProps } from "react-router-dom";
import { ButtonProps } from "reactstrap";

import { ButtonSecondary, ButtonSecondaryLink } from "./Buttons";

interface IArrowElementProps {
  arrowDirection: "left" | "right";
}

export const ArrowButton: React.SFC<IArrowElementProps & ButtonProps> = ({
  children,
  arrowDirection,
  ...props
}) => (
  <ButtonSecondary {...props}>
    {arrowDirection === "left" ? (
      <div>
        <i data-test-id="ArrowLink-arrow-left" className="fa fa-lg fa-angle-left mr-1" /> {children}
      </div>
    ) : (
      <div>
        {children}
        <i data-test-id="ArrowLink-arrow-right" className="fa fa-lg fa-angle-right ml-1" />
      </div>
    )}
  </ButtonSecondary>
);

export const ArrowLink: React.SFC<IArrowElementProps & LinkProps> = ({
  children,
  arrowDirection,
  ...props
}) => (
  <ButtonSecondaryLink {...props}>
    {arrowDirection === "left" ? (
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

import * as React from "react";

import { Proportion } from "./Proportion";

interface IProps {
  slideShareUrl: string | undefined;
  className?: string;
}

export const Slides: React.SFC<IProps> = ({ slideShareUrl, className }) => {
  return slideShareUrl ? (
    <Proportion className={className}>
      <iframe src={slideShareUrl} allowFullScreen scrolling="no" />
    </Proportion>
  ) : null;
};

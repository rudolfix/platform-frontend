import * as React from "react";

import { Proportion } from "./Proportion";

interface IProps {
  youTubeId: string;
}

export const Video: React.SFC<IProps> = ({ youTubeId }) => {
  return (
    <Proportion width={720} height={405}>
      <iframe
        src={`https://www.youtube.com/embed/${youTubeId}?disablekb=1&rel=0&showinfo=0&color=white`}
      />
    </Proportion>
  );
};

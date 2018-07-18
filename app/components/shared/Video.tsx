import * as React from "react";

import { Proportion } from "./Proportion";

interface IProps {
  youTubeUrl: string;
  className?: string;
}

export const Video: React.SFC<IProps> = ({ youTubeUrl, className }) => {
  const youtubeId =
    youTubeUrl &&
    youTubeUrl
      .split("?")
      .filter(string => string.startsWith("v="))[0]
      .slice(2);

  if (!youtubeId) {
    return null;
  }

  return (
    <Proportion width={720} height={405} className={className}>
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?disablekb=1&rel=0&showinfo=0&color=white`}
      />
    </Proportion>
  );
};

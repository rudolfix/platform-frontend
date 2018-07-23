import * as React from "react";

import { Proportion } from "./Proportion";

interface IProps {
  youTubeUrl: string;
  className?: string;
}

export const Video: React.SFC<IProps> = ({ youTubeUrl, className }) => {
  let youtubeId = youTubeUrl && youTubeUrl.split("?").filter(string => string.startsWith("v="))[0];

  if (!youtubeId) {
    return null;
  } else {
    youtubeId = youtubeId.slice(2);
  }

  return (
    <Proportion width={720} height={405} className={className}>
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?disablekb=1&rel=0&showinfo=0&color=white`}
      />
    </Proportion>
  );
};

import * as React from "react";

import { Proportion } from "./Proportion";
import { ResponsiveImage } from "./ResponsiveImage";

interface IProps {
  youTubeUrl: string;
  className?: string;
  thumbnailOnly?: boolean;
}

export const Video: React.SFC<IProps> = ({ youTubeUrl, className, thumbnailOnly }) => {
  let youtubeId = youTubeUrl && youTubeUrl.split("?").filter(string => string.startsWith("v="))[0];

  if (!youtubeId) {
    return null;
  } else {
    youtubeId = youtubeId.slice(2);
  }

  return (
    <Proportion width={720} height={405} className={className}>
      {thumbnailOnly
        ? <img src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} alt="video thumbnail" />
        : <iframe src={`https://www.youtube.com/embed/${youtubeId}?disablekb=1&rel=0&showinfo=0&color=white`}/>}
    </Proportion>
  );
};

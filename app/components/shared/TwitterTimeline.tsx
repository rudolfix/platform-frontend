import * as React from 'react';

import * as style from './TwitterTimeline.module.scss'

interface IProps {
  url: string,
  userName: string
}

export class TwitterTimelineEmbed extends React.Component<IProps> {
  render (): React.ReactNode {
    return (
      <iframe src={`/twitter.html?user=${this.props.userName}&url=${this.props.url}`} scrolling="no" frameBorder={0} allowTransparency allowFullScreen title="Twitter Timeline">
      </iframe>
    );
  }
}

import * as React from 'react';

import { TTranslatedString } from '../../types';

import { Panel } from './Panel';

import * as styles from './MediaLinksWidget.module.scss'

interface ILink {
  title: TTranslatedString,
  url: string;
}

interface IProps {
  links: ILink[];
}

export const MediaLinksWidget: React.SFC<IProps> = ({links}) => {
  return (
    <Panel>
      {
        links.map(({title, url}) => (
          <div className={styles.link}>
            <a href={url}>{title}</a>
          </div>
        ))
      }
    </Panel>
  )
}

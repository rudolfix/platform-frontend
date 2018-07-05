import * as React from 'react';

import { InlineIcon } from './InlineIcon';
import { ISocialProfile } from './SocialProfilesEditor';


import * as styles from './SocialProfilesList.module.scss'

interface IProps {
  profiles: ISocialProfile[];
}

export const SocialProfilesList: React.SFC<IProps> = ({profiles}) => {
  return (
    <div className={styles.socialProfilesList}>
      {profiles.map(({name, url, svgIcon}) => (
        <div className={styles.profile}>
          <a href={url} target="_blank" title={name}>
            <InlineIcon svgIcon={svgIcon} />
          </a>
        </div>
      ))}
    </div>
  )
}

import * as cn from "classnames";
import * as React from 'react';

import { TTranslatedString } from '../../types';
import { ISrcSet, ResponsiveImage } from './ResponsiveImage';

import * as styles from './SlidePerson.module.scss'

interface IProps {
  srcSet: ISrcSet;
  name: string;
  bio: TTranslatedString;
  title?: TTranslatedString;
  layout?: "horizontal" | "vertical";
}

export const SlidePerson: React.SFC<IProps> = ({srcSet, name, title, bio, layout}) => {
  return (
    <div className={cn(styles.slidePerson, layout)}>
      <div className={styles.image}>
        <ResponsiveImage
          srcSet={srcSet}
          alt={name}/>
      </div>
      <div>
        <h5 className={styles.name}>{name}</h5>
        {title && <h6 className={styles.title}>{title}</h6>}
        <p className={styles.bio}>{bio}</p>
      </div>
    </div>
  )
}

SlidePerson.defaultProps = {
  layout: "horizontal",
}

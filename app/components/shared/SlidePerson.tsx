import * as cn from "classnames";
import * as React from "react";

import { ISrcSet, ResponsiveImage } from "./ResponsiveImage";
import { IEtoSocialProfile, SocialProfilesList } from "./SocialProfilesList";

import * as styles from "./SlidePerson.module.scss";

export type TSlidePersonLayout = "horizontal" | "vertical";
interface IProps {
  srcSet: ISrcSet;
  name: string;
  socialChannels: IEtoSocialProfile[];
  role: string;
  layout?: TSlidePersonLayout;
}

export const SlidePerson: React.SFC<IProps> = ({ srcSet, name, role, layout, socialChannels }) => {
  return (
    <div className={cn(styles.slidePerson, layout)}>
      <div className={styles.image}>
        <ResponsiveImage srcSet={srcSet} alt={name} />
      </div>
      <div>
        <h5 className={styles.name}>{name}</h5>
        {role && <h6 className={styles.title}>{role}</h6>}
      </div>
      {!!socialChannels.length && (
        <SocialProfilesList
          profiles={socialChannels || []}
          layoutIconSize="small"
          layoutIconsPosition="center"
        />
      )}
    </div>
  );
};

SlidePerson.defaultProps = {
  layout: "horizontal",
};

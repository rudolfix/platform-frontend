import * as React from "react";

import { Link } from "react-router-dom";
import { IResponsiveImage, ResponsiveImage } from "../../shared/ResponsiveImage";
import { Tag } from "../../shared/Tag";
import * as styles from "./Cover.module.scss";

interface IProps {
  coverImage: IResponsiveImage;
  company: {
    name: string | React.ReactNode;
    shortDescription: string | React.ReactNode;
    website: {
      title: string | React.ReactNode;
      url: string;
    };
    logo: IResponsiveImage;
    tags: string[];
  };
}

export const Cover: React.SFC<IProps> = ({ coverImage, company }) => {
  return (
    <div className={styles.cover}>
      <ResponsiveImage width={1230} height={380} srcSet={coverImage.srcSet} alt={coverImage.alt} />

      <div className={styles.companyDetails}>
        <div className={styles.identity}>
          <div className={styles.logo}>
            <ResponsiveImage srcSet={company.logo.srcSet} alt={company.logo.alt} theme="light" />
          </div>
          <div className={styles.details}>
            <h2 className={styles.name}>{company.name}</h2>
            <h3 className={styles.shortDescription}>{company.shortDescription}</h3>
            <Link className={styles.websiteLink} target="_blank" to={company.website.url}>
              {company.website.title}
            </Link>
          </div>
        </div>
        <div className={styles.tags}>
          {company.tags.map(tag => <Tag text={tag} layout="ghost-bold" theme="white" key={tag} />)}
        </div>
      </div>
    </div>
  );
};

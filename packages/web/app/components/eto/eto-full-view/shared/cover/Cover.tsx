import { Image, ISrcSet } from "@neufund/design-system";
import { EJurisdiction } from "@neufund/shared-modules";
import { COMPANY_TAGS_LIMIT } from "@neufund/shared-utils";
import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../../../../types";
import { Container, EColumnSpan, EContainerType } from "../../../../layouts/Container";
import { Tag } from "../../../../shared/Tag";

import * as styles from "./Cover.module.scss";

type TImage = {
  srcSet: ISrcSet;
  alt: string;
};

interface IProps {
  companyBanner: TImage;
  companyName: TTranslatedString;
  companyOneliner: TTranslatedString;
  companyLogo: TImage | undefined;
  companyJurisdiction: EJurisdiction;
  tags: ReadonlyArray<TTranslatedString> | undefined;
}

export const Cover: React.FunctionComponent<IProps> = ({
  companyBanner,
  companyName,
  companyLogo,
  tags = [],
}) => (
  <Container
    columnSpan={EColumnSpan.THREE_COL}
    className={styles.cover}
    type={EContainerType.CONTAINER}
  >
    <Image srcSet={companyBanner.srcSet} alt={companyBanner.alt} width={1250} height={400} />

    <div className={styles.companyDetails}>
      {companyLogo && (
        <div className={styles.logoWrapper}>
          <img src={companyLogo.srcSet["1x"]} alt={companyLogo.alt} />
        </div>
      )}
      <div className={styles.details}>
        <h1 className={styles.name}>{companyName}</h1>
      </div>
      <div className={styles.tags}>
        {tags.slice(0, COMPANY_TAGS_LIMIT).map((tag, index) => (
          <Tag
            text={tag}
            className={cn(styles.tag, "ml-3")}
            layout="bold"
            theme="dark"
            key={index}
          />
        ))}
      </div>
    </div>
  </Container>
);

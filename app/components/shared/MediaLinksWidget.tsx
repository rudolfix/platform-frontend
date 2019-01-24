import * as React from "react";

import { TTranslatedString } from "../../types";
import { ExternalLink } from "./links";
import { Panel } from "./Panel";

import * as styles from "./MediaLinksWidget.module.scss";

export interface ILink {
  publication: string;
  title: TTranslatedString;
  url: string;
}

interface IProps {
  links: ILink[];
}

export const normalizedUrl = (url: string) => {
  const cleanUrl = decodeURIComponent(url)
    .trim()
    .toLowerCase();

  return cleanUrl.startsWith("http") ? cleanUrl : `http://${cleanUrl}`;
};

export const MediaLinksWidget: React.FunctionComponent<IProps> = ({ links }) => {
  if (!links.length) {
    return null;
  }
  return (
    <Panel>
      {links.map(({ title, url, publication }, i) => {
        return (
          publication &&
          url &&
          title && (
            <div className={styles.link} key={i}>
              <ExternalLink href={normalizedUrl(url)}>
                {publication}: {title}
              </ExternalLink>
            </div>
          )
        );
      })}
    </Panel>
  );
};

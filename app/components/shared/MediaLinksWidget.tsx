import * as React from "react";

import { TTranslatedString } from "../../types";

import { Panel } from "./Panel";

import * as styles from "./MediaLinksWidget.module.scss";

interface ILink {
  title: TTranslatedString;
  url: string;
}

interface IProps {
  links: ILink[];
}

export const normalizedUrl = (url: string) =>
  url
    .trim()
    .toLowerCase()
    .startsWith("http")
    ? url
    : `http://${url}`;

export const MediaLinksWidget: React.SFC<IProps> = ({ links }) => {
  if (!links.length) {
    return null;
  }

  return (
    <Panel>
      {links.map(({ title, url }, i) => {
        return (
          url &&
          title && (
            <div className={styles.link} key={i}>
              <a href={normalizedUrl(url)} target="_blank">
                {title}
              </a>
            </div>
          )
        );
      })}
    </Panel>
  );
};

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

export const MediaLinksWidget: React.SFC<IProps> = ({ links }) => {
  if (!links.length) {
    return null;
  }

  return (
    <Panel>
      {links.map(
        ({ title, url }, i) =>
          url &&
          title && (
            <div className={styles.link} key={i}>
              <a href={url}>{title}</a>
            </div>
          ),
      )}
    </Panel>
  );
};

import * as React from "react";
import * as styles from "./Date.module.scss";
import { formatDate } from "./Date.utils";

interface IProps {
  timestamp: number;
}

export const Date: React.SFC<IProps> = ({ timestamp }) => (
  <time className={styles.date}>{formatDate(timestamp)}</time>
);

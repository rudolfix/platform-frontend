import * as React from "react";

import * as styles from "./Modals.module.scss";

export const Heading: React.SFC = ({ children }) => <h4 className={styles.heading}>{children}</h4>;

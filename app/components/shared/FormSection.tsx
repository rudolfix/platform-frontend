import * as React from "react";

import * as styles from "./FormSection.module.scss";

interface IProps {
  title: string | React.ReactNode;
}

export const FormSection: React.SFC<IProps> = ({ title, children }) => {
  return (
    <section className={styles.formSection}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </section>
  );
};

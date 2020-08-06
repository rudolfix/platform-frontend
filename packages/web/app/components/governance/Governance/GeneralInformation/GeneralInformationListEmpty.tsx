import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Container } from "../../../layouts/Container";

import styles from "./GeneralInformation.module.scss";

export const GeneralInformationListEmpty: React.FunctionComponent = () => (
  <Container>
    <ul className={styles.fileList}>
      <div className={styles.emptyMessage}>
        <h5 className={styles.emptyMessageText}>
          <FormattedMessage id="governance.no-updates" />
        </h5>
      </div>
    </ul>
  </Container>
);

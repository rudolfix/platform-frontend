import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";

import { Container, EColumnSpan, EContainerType } from "../../../../layouts/Container";
import { Panel } from "../../../../shared/Panel";

import styles from "./Disclaimer.module.scss";

export const Disclaimer = () => (
  <Container
    columnSpan={EColumnSpan.THREE_COL}
    type={EContainerType.INHERIT_GRID}
    data-test-id="eto-public-view.disclaimer"
  >
    <Panel className={styles.card}>
      <p className={styles.message}>
        <FormattedHTMLMessage id="eto.public-view.disclaimer" tagName="span" />
      </p>
    </Panel>
  </Container>
);

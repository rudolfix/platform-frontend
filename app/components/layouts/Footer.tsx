import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ExternalLink } from "../shared/links/index";

import * as styles from "./Footer.module.scss";

// todo add tos link
export const Footer: React.FunctionComponent = () => (
  <footer className={styles.footer}>
    <span className={styles.copyright}>©2019 Fifth Force GmbH</span>
    <ExternalLink href="https://neufund.org/imprint" className={styles.link}>
      <FormattedMessage id="footer.links.imprint" />
    </ExternalLink>
    <ExternalLink href="" className={styles.link}>
      <FormattedMessage id="footer.links.terms-of-use" />
    </ExternalLink>
    <ExternalLink
      href="https://neufund.org/cms_resources/fifth-force-privacy-policy-2018-11-26.pdf"
      className={styles.link}
    >
      <FormattedMessage id="footer.links.privacy-policy" />
    </ExternalLink>
  </footer>
);

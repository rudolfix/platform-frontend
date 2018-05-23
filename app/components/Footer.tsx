import * as React from "react";

import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import * as logo from "../assets/img/logo_capitalized.svg";
import * as styles from "./Footer.module.scss";

export const Footer: React.SFC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.contentWrapper}>
        <div className={styles.links}>
          <Link to="https://neufund.org/imprint" target="_blank">
            <FormattedMessage id="footer.links.imprint" />
          </Link>
          <Link
            to="https://neufund.org/cms_resources/neufundprivacypolicy20180523.pdf"
            target="_blank"
          >
            <FormattedMessage id="footer.links.privacy-policy" />
          </Link>
          <Link to="#0" target="_blank">
            <FormattedMessage id="footer.links.terms-and-conditions" />
          </Link>
        </div>
        <div className={styles.content}>
          <img src={logo} className={styles.logo} alt="logo" />
          <div>&copy; FIFTH FORCE GMBH</div>
        </div>
      </div>
    </footer>
  );
};

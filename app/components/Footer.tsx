import * as React from 'react';

import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import * as logo from "../assets/img/logo_capitalized.svg";
import * as styles from "./Footer.module.scss";

interface IProps {
}

export const Footer: React.SFC<IProps> = (props) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.contentWrapper}>
        <div className={styles.links}>
          <Link to="https://neufund.org/imprint" target="_blank">
            <FormattedMessage id="footer.links.imprint" />
          </Link>
          <Link to="https://zh-file.s3.amazonaws.com/116978635/c9964332-ad6b-4644-8a54-245a8e840c4f?Expires=1527072934&AWSAccessKeyId=AKIAI5X57DET3FHKSALA&Signature=U3IRnOWCQwNrKkaWO8ERvPWMd0c%3D" target="_blank">
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
  )
};

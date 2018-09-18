import * as React from "react";
import { Link } from "react-router-dom";

import { Button, ButtonWidth } from "../../shared/Buttons";

import * as logo from "../../../assets/img/logo_capitalized.svg";
import * as styles from "./RegisterCta.module.scss";

interface ISelfProps {
  text: string;
  ctaText: string;
  ctaLink: string;
}

export const RegisterCta: React.SFC<ISelfProps> = ({ text, ctaText, ctaLink }) => {
  return (
    <section className={styles.registerCta}>
      <img className={styles.image} src={logo} alt="Neufund logo" />
      <h2 className={styles.ctaText}>{text}</h2>
      <Link to={ctaLink}>
        <Button width={ButtonWidth.WIDE} theme="white">
          {ctaText}
        </Button>
      </Link>
    </section>
  );
};

import * as React from 'react';

import { Button } from '../../shared/Buttons';

import * as styles from './RegisterCta.module.scss';

interface ISelfProps {
  text: string;
  onRegister: any;
}

export const RegisterCta: React.SFC<ISelfProps> = ({ text, onRegister }) => {
  return (
    <section className={styles.registerCta}>
      <h2 className={styles.ctaText}>{text}</h2>
      <Button onClick={onRegister} size="wide" theme="t-white">Register</Button>
    </section>
  )
}

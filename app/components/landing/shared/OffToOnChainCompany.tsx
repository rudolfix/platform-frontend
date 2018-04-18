import * as React from 'react';
import * as styles from './OffToOnChainCompany.module.scss'

interface IStepProps {
  title: string;
  __html: string | ;
}

interface IProps {
  steps: IStepProps[];
}

export const OffToOnCompany: React.SFC<IProps> = ({ steps }) => {
  return (
    <div className={styles.offToOnCompany}>
      <h3><strong>OFF-CHAIN</strong> company</h3>
      {
        steps.map(({ title, __html }) => (
          <div className={styles.steps}>
            <div className={styles.step}>
              <h4 className={styles.stepName}>Register</h4>
              <span className={styles.stepCount}>1</span>
              <p className={styles.stepDescription} dangerouslySetInnerHTML={{ __html }} />
            </div>
          </div>
        ))
      }
      <h3><strong>on-CHAIN</strong> company</h3>
    </div>
  )
}

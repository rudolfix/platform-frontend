import * as React from 'react';

import { HorizontalLine } from '../../shared/HorizontalLine';
import { InlineIcon } from '../../shared/InlineIcon';

import * as arrowHead from "../../../assets/img/inline_icons/arrowhead.svg";
import * as styles from './OffToOnChainCompany.module.scss'

interface IStepProps {
  htmlTitle: string;
  htmlDescription: string;
}

interface IProps {
  steps: IStepProps[];
}

export const OffToOnCompany: React.SFC<IProps> = ({ steps }) => {
  return (
    <div className={styles.offToOnChainCompany}>
      <h3 className={styles.header}><strong>OFF-CHAIN</strong> company</h3>
      <HorizontalLine theme="yellow" size="narrow" />
      <div className={styles.steps}>
        {
          steps.map(({ htmlTitle, htmlDescription }, index) => (
            <div className={styles.step} key={index}>
              <h4 className={styles.stepName} dangerouslySetInnerHTML={{ __html: htmlTitle }} />
              <div className={styles.stepCount}>
                <div className={styles.counter}>{index + 1}</div>
              </div>
              <p className={styles.stepDescription} dangerouslySetInnerHTML={{ __html: htmlDescription }} />
            </div>
          ))
        }
        <InlineIcon svgIcon={arrowHead} />
      </div>
      <h3 className={styles.header}><strong>ON-CHAIN</strong> company</h3>
      <HorizontalLine theme="yellow" size="narrow" />
    </div>
  )
}

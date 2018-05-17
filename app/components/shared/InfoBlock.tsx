import * as cn from "classnames";
import * as React from 'react';

import * as styles from './InfoBlock.module.scss';

interface IProps {
  className?: string;
}

export const InfoBlock: React.SFC<IProps> = ({className, children}) => {
  return (
    <div className={cn(styles.infoBlock, className)}>
      {children}
    </div>
  )
};

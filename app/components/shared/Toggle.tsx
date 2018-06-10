import * as React from "react";

import * as styles from "./Toggle.module.scss";

interface IProps {
  disabledLabel: string | React.ReactNode;
  enabledLabel: string | React.ReactNode;
  onClick: () => void;
  checked: boolean;
  disabled?: boolean;
}

export const Toggle: React.SFC<IProps> = ({
  disabledLabel,
  enabledLabel,
  onClick,
  checked,
  disabled = false,
}) => {
  return (
    <div className={styles.toggle}>
      <div>{disabledLabel}</div>
      <label className={styles.toggleWrapper} onClick={onClick}>
        <input
          className={styles.input}
          type="checkbox"
          defaultChecked={checked}
          disabled={disabled}
        />
        <div className={styles.track}>
          <div className={styles.indicator} />
        </div>
      </label>
      <div>{enabledLabel}</div>
    </div>
  );
};

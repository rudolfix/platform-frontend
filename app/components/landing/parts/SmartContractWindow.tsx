import * as React from "react";

import * as code from "!raw-loader!./DummySmartContractCode.sol";
import * as styles from "./SmartContractWindow.module.scss";

export const SmartContractWindow = () => (
  <div className={styles.view}>
    <div className={styles.window}>
      <div className={styles.windowHeader}>
        <div className={styles.actionButtons} />
      </div>

      <div className={styles.windowBody}>
        <textarea className={styles.codeInput} defaultValue={code} data-gramm_editor={false} />

        <pre className={styles.codeOutput}>
          <code className={styles.languageJavascript} />
        </pre>
      </div>
    </div>
  </div>
);

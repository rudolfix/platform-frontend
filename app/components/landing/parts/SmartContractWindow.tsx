import * as React from "react";

import * as code from "!raw-loader!./DummySmartContractCode.sol";
import * as styles from "./SmartContractWindow.module.scss";

export const SmartContractWindow = () => (
  <main className={styles.view}>
    <h1 />

    <div className={styles.window}>
      <div className={styles.windowHeader}>
        <div className={styles.actionButtons} />
      </div>

      <div className={styles.windowBody}>
        <textarea className={styles.codeInput} data-gramm_editor={false}>
          {code}
        </textarea>

        <pre className={styles.codeOutput}>
          <code className={styles.languageJavascript} />
        </pre>
      </div>
    </div>
  </main>
);

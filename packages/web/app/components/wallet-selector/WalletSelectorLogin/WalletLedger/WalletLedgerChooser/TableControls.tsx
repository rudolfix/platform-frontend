import { Input } from "@neufund/design-system";
import { derivationPathPrefixValidator, IIntlProps, injectIntlHelpers } from "@neufund/shared";
import { debounce } from "lodash";
import * as React from "react";
import { FormFeedback } from "reactstrap";

import * as styles from "./TableControls.module.scss";

const DEBOUNCE_DELAY = 200;

interface IDPChooserComponent {
  derivationPathPrefix: string;
  onDerivationPathPrefixChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string | null;
}

interface TableControlsBaseProps {
  onDerivationPathPrefixChange: (derivationPathPrefix: string) => void;
  onDerivationPathPrefixError: () => void;
  setDerivationPathPrefix: (derivationPathPrefix: string) => void;
  setErrorMessage: (errorMessage: string) => void;
  derivationPathPrefix: string;
  errorMessage: string | null;
}

class TableControlsBase extends React.Component<TableControlsBaseProps & IIntlProps, {}> {
  debouncedOnChange = debounce((derivationPathPrefix: string): void => {
    const fixedDp = derivationPathPrefix.endsWith("/")
      ? derivationPathPrefix
      : derivationPathPrefix + "/";
    const errorMessage = derivationPathPrefixValidator(fixedDp);
    this.props.setErrorMessage(errorMessage);

    if (errorMessage) {
      this.props.onDerivationPathPrefixError();
    } else {
      this.props.onDerivationPathPrefixChange(fixedDp);
    }
  }, DEBOUNCE_DELAY);

  onDerivationPathPrefixChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const derivationPathPrefix = event.target.value;
    this.props.setDerivationPathPrefix(derivationPathPrefix);
    this.debouncedOnChange(derivationPathPrefix);
  };

  render(): React.ReactNode {
    const {
      derivationPathPrefix,
      errorMessage,
      intl: { formatIntlMessage },
    } = this.props;

    return (
      <div className={styles.wrapper}>
        <Input
          className={styles.input}
          name="derivationPathPrefix"
          value={derivationPathPrefix}
          onChange={this.onDerivationPathPrefixChange}
          placeholder={formatIntlMessage(
            "wallet-selector.ledger.derivation-path-selector.placeholder",
          )}
          invalid={errorMessage !== null}
        />
        <FormFeedback data-test-id="dpChooser-error-msg">{errorMessage}</FormFeedback>
      </div>
    );
  }
}

export const TableControls = injectIntlHelpers<IDPChooserComponent>(TableControlsBase);

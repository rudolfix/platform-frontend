import { Input } from "@neufund/design-system";
import { derivationPathPrefixValidator, IIntlProps, injectIntlHelpers } from "@neufund/shared";
import { debounce } from "lodash";
import * as React from "react";

import { InlineIcon } from "../../../../shared/icons/InlineIcon";

import arrowLeft from "../../../../../assets/img/inline_icons/arrow_left.svg";
import arrowRight from "../../../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./TableControls.module.scss";

const DEBOUNCE_DELAY = 200;

interface ITableControlsBaseProps {
  showNavigation: boolean;
  onDerivationPathPrefixChange: (derivationPathPrefix: string) => void;
  onDerivationPathPrefixError: () => void;
  setDerivationPathPrefix: (derivationPathPrefix: string) => void;
  setErrorMessage: (errorMessage: string | null) => void;
  showPrevAddresses: () => void;
  showNextAddresses: () => void;
  hasPreviousAddress: boolean;
  derivationPathPrefix: string;
  errorMessage: string | null;
}

class TableControlsBase extends React.Component<ITableControlsBaseProps & IIntlProps, {}> {
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
      intl: { formatIntlMessage },
      hasPreviousAddress,
      showPrevAddresses,
      showNextAddresses,
      showNavigation,
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
        />

        {showNavigation && (
          <div className={styles.navButtons}>
            <button
              className={styles.navButton}
              disabled={!hasPreviousAddress}
              onClick={showPrevAddresses}
              data-test-id="btn-previous"
            >
              <InlineIcon svgIcon={arrowLeft} />
            </button>

            <button
              className={styles.navButton}
              onClick={showNextAddresses}
              data-test-id="btn-next"
            >
              <InlineIcon svgIcon={arrowRight} />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export const TableControls = injectIntlHelpers<ITableControlsBaseProps>(TableControlsBase);

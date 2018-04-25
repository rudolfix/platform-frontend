import { debounce } from "lodash";
import * as React from "react";
import { Col, FormFeedback, FormGroup, Input, Row } from "reactstrap";

import { DEFAULT_DERIVATION_PATH_PREFIX } from "../../modules/wallet-selector/ledger-wizard/reducer";
import { injectIntlHelpers } from "../../utils/injectIntlHelpers";
import { derivationPathPrefixValidator } from "../../utils/Validators";

const DEBOUNCE_DELAY = 200;

interface IDPChooserComponent {
  derivationPathPrefix: string;
  onDerivationPathPrefixChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string | null;
}

export const DPChooserComponent = injectIntlHelpers<IDPChooserComponent>(
  ({
    derivationPathPrefix,
    onDerivationPathPrefixChange,
    errorMessage,
    intl: { formatIntlMessage },
  }) => (
    <Row>
      <Col md="5">
        <FormGroup>
          <Input
            name="derivationPathPrefix"
            value={derivationPathPrefix}
            onChange={onDerivationPathPrefixChange}
            placeholder={formatIntlMessage(
              "wallet-selector.ledger.derivation-path-selector.placeholder",
            )}
            valid={errorMessage === null ? undefined : false}
          />
          <FormFeedback data-test-id="dpChooser-error-msg">{errorMessage}</FormFeedback>
        </FormGroup>
      </Col>
    </Row>
  ),
);

interface IDPChooserProps {
  onDerivationPathPrefixChange: (derivationPathPrefix: string) => void;
  onDerivationPathPrefixError: () => void;
}

interface IDPChooserState {
  derivationPathPrefix: string;
  errorMessage: string | null;
}

export class WalletLedgerDPChooser extends React.Component<IDPChooserProps, IDPChooserState> {
  constructor(props: IDPChooserProps) {
    super(props);
    this.state = {
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      errorMessage: null,
    };
  }

  debouncedOnChange = debounce((derivationPathPrefix: string): void => {
    const errorMessage = derivationPathPrefixValidator(derivationPathPrefix);
    this.setState({
      errorMessage,
    });
    if (errorMessage) {
      this.props.onDerivationPathPrefixError();
    } else {
      this.props.onDerivationPathPrefixChange(derivationPathPrefix);
    }
  }, DEBOUNCE_DELAY);

  onDerivationPathPrefixChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const derivationPathPrefix = event.target.value;
    this.setState({
      derivationPathPrefix,
    });
    this.debouncedOnChange(derivationPathPrefix);
  };

  render(): React.ReactNode {
    return (
      <DPChooserComponent
        onDerivationPathPrefixChange={this.onDerivationPathPrefixChange}
        derivationPathPrefix={this.state.derivationPathPrefix}
        errorMessage={this.state.errorMessage}
      />
    );
  }
}

import { debounce } from "lodash";
import * as React from "react";
import { Alert, Col, FormGroup, Input, Label, Row } from "reactstrap";

import { DEFAULT_DERIVATION_PATH_PREFIX } from "../../modules/wallet-selector/ledger-wizard/reducer";
import { derivationPathPrefixValidator } from "../../utils/Validators";

const DEBOUNCE_DELAY = 200;

interface IDPChooserComponent {
  derivationPathPrefix: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string | null;
}

export const DPChooserComponent: React.SFC<IDPChooserComponent> = ({
  derivationPathPrefix,
  onChange,
  errorMessage,
}) => (
  <Row>
    <Col xs="6">
      <FormGroup>
        <Label for="derivationPathPrefix">Change your derivation path prefix, if necessary.</Label>
        <Input
          name="derivationPathPrefix"
          value={derivationPathPrefix}
          onChange={onChange}
          placeholder={DEFAULT_DERIVATION_PATH_PREFIX}
        />
      </FormGroup>
      {errorMessage && (
        <Alert color="danger">
          <span data-test-id="dpChooser-error-msg">{errorMessage}</span>
        </Alert>
      )}
    </Col>
  </Row>
);

interface IDPChooserProps {
  onChange: (derivationPathPrefix: string) => void;
  onDerivationPathError: () => void;
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
      this.props.onDerivationPathError();
    } else {
      this.props.onChange(derivationPathPrefix);
    }
  }, DEBOUNCE_DELAY);

  onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const derivationPathPrefix = event.target.value;
    this.setState({
      derivationPathPrefix,
    });
    this.debouncedOnChange(derivationPathPrefix);
  };

  render(): React.ReactNode {
    return (
      <DPChooserComponent
        onChange={this.onChange}
        derivationPathPrefix={this.state.derivationPathPrefix}
        errorMessage={this.state.errorMessage}
      />
    );
  }
}

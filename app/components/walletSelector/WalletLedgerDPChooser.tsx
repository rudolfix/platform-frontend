import * as React from "react";
import { Alert, Col, FormGroup, Input, Label, Row } from "reactstrap";

import { DEFAULT_DERIVATION_PATH_PREFIX } from "../../modules/wallet-selector/ledger-wizard/reducer";
import { derivationPathPrefixValidator } from "../../utils/Validators";

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
  onChange: any;
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

  onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const derivationPathPrefix = event.target.value;
    const errorMessage = derivationPathPrefixValidator(derivationPathPrefix);
    this.setState({
      derivationPathPrefix,
      errorMessage,
    });
    if (!errorMessage) {
      this.props.onChange(derivationPathPrefix);
    }
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

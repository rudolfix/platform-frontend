import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { flows } from "../../../modules/flows";
import { appConnect } from "../../../store";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";
import { RegisterWalletComponent } from "../light/RegisterLightWallet";
import { recoverRoutes } from "./recoverRoutes";
import { WalletLightSeedRecoveryComponent } from "./SeedRecovery";

interface IMainRecoveryState {
  seed?: string;
}

interface IFormValues {
  email: string;
  password: string;
  repeatPassword: string;
  seed?: string;
}

interface IProps {
  submitForm: (values: IFormValues) => void;
  seed: string;
}

interface IMainRecoveryProps {
  submitForm: (values: IFormValues) => void;
}
export class RecoveryProcessesComponent extends React.Component<
  IMainRecoveryProps,
  IMainRecoveryState
> {
  constructor(props: IMainRecoveryProps) {
    super(props);
    this.state = {};
  }

  setSeed = (words: string): void => {
    this.setState({ seed: words });
  };

  render(): React.ReactNode {
    return (
      <div>
        {this.state.seed ? (
          <div>
            <HeaderProgressStepper
              headerText={<FormattedMessage id="wallet-selector.recover.seed.header" />}
              descText={<FormattedMessage id="wallet-selector.recover.seed.register-description" />}
              currentStep={7}
              steps={8}
            />
            <RegisterWalletComponent
              submitForm={(values: IFormValues) => {
                this.props.submitForm({ ...values, seed: this.state.seed });
              }}
            />
          </div>
        ) : (
          <div>
            <WalletLightSeedRecoveryComponent
              startingStep={0}
              extraSteps={2}
              sendWords={this.setSeed}
            />
          </div>
        )}
        <Col md={12}>
          <Row className="mt-5 pt-5 justify-content-end align-items-center">
            <Link to={recoverRoutes.help}>
              <FormattedMessage id="wallet-selector.recover.help.contact-for-help" />{" "}
              <i className="fa fa-lg fa-angle-right ml-1" />
            </Link>
          </Row>
        </Col>
      </div>
    );
  }
}

export const RecoveryProcesses: React.SFC<IProps> = props => {
  return <RecoveryProcessesComponent {...props} />;
};

export const RecoverWallet = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) => {
        dispatch(
          flows.wallet.tryConnectingWithLightWallet(values.email, values.password, values.seed),
        );
      },
    }),
  }),
)(RecoveryProcesses);

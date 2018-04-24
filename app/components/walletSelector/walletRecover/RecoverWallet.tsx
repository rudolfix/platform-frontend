import * as React from "react";
import { compose } from "redux";
import { appConnect } from "../../../store";

import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { flows } from "../../../modules/flows";
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

interface IDispatchProps {
  submitForm: (values: IFormValues) => void;
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
              headerText="Reset your Password"
              descText="Lopsum Iprum"
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
            <Link className="" to={recoverRoutes.help}>
              Contact for help <i className="fa fa-lg fa-angle-right ml-1" />
            </Link>
          </Row>
        </Col>
      </div>
    );
  }
}

export const RecoveryProcesses: React.SFC<IDispatchProps> = props => {
  return <RecoveryProcessesComponent {...props} />;
};

export const RecoverWallet = compose<React.SFC>(
  appConnect<IDispatchProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) => {
        dispatch(
          flows.wallet.tryConnectingWithLightWallet(values.email, values.password, values.seed),
        );
      },
    }),
  }),
)(RecoveryProcesses);

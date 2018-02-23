import * as React from "react";
import { compose } from "redux";
import { appConnect } from "../../../store";

import { flows } from "../../../modules/flows";
import { RegisterWalletComponent } from "../walletRegister/RegisterWallet";
import { WalletLightSeedRecoveryComponent } from "./SeedRecovery";
import { WalletResetHeader } from "./WalletResetHeader";

interface IMainRecoveryState {
  seed?: string;
}

interface IFormValues {
  email?: string;
  password?: string;
  repeatPassword?: string;
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
    this.setSeed = this.setSeed.bind(this);
  }

  setSeed(words: string): any {
    this.setState({ seed: words });
  }

  render(): React.ReactNode {
    return this.state.seed ? (
      <div>
        <WalletResetHeader text="Lopsum Iprum" currentStep={6} steps={7} />
        <RegisterWalletComponent
          submitForm={(values: any) => {
            this.props.submitForm({ ...values, seed: this.state.seed });
          }}
        />
      </div>
    ) : (
      <div>
        <WalletLightSeedRecoveryComponent
          startingStep={0}
          extraSteps={1}
          sendWords={this.setSeed}
        />
      </div>
    );
  }
}

export const RecoveryProcesses: React.SFC<any> = props => {
  return <RecoveryProcessesComponent {...props} />;
};

export const RecoverWallet = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) => {
        dispatch(
          flows.wallet.tryConnectingWithLightWallet(
            values.email as string,
            values.password as string,
            values.seed as string,
          ),
        );
      },
    }),
  }),
)(RecoveryProcesses);

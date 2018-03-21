import * as React from "react";
import { Col, Modal, Row } from "reactstrap";
import { actions } from "../../modules/actions";
import { selectIsLightWallet, selectIsUnlocked, selectSeed } from "../../modules/web3/reducer";
import { appConnect } from "../../store";
import { BackupSeedDisplay } from "../settings/backupSeed/BackupSeedDisplay";
import { HeaderProgressStepper } from "../shared/HeaderProgressStepper";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { LightWalletSignPrompt } from "./LightWalletSign";
import { ModalComponentBody } from "./ModalComponentBody";

interface IStateProps {
  isOpen: boolean;
  errorMsg?: string;
  isLightWallet: boolean;
  isUnlocked: boolean;
  seed?: string[];
}

interface IDispatchProps {
  onCancel: () => void;
  onAccept: (password?: string) => void;
  fetchSeed: () => void;
  clearSeed: () => void;
}

interface IState {
  pageNo: number;
  seed?: string[];
}

export class ViewSeedComponent extends React.Component<IStateProps & IDispatchProps, IState> {
  constructor(props: IStateProps & IDispatchProps) {
    super(props);
    this.onNext = this.onNext.bind(this);
    this.onBack = this.onBack.bind(this);

    this.state = {
      pageNo: 0,
    };
  }
  private onNext(): void {
    this.setState({ pageNo: 1 });
  }
  private onBack(): void {
    this.setState({ pageNo: 0 });
  }
  componentWillMount(): void {
    this.props.fetchSeed();
  }

  componentDidUpdate(): void {
    if (!this.props.isOpen) this.props.clearSeed();
  }

  render(): React.ReactNode {
    return this.props.seed ? (
      <Row>
        <Col md={12} lg={{ size: 10, offset: 1 }} xl={{ size: 8, offset: 2 }}>
          <HeaderProgressStepper
            steps={2}
            currentStep={this.state.pageNo + 1}
            headerText="The safety phrase is crucial for the safety of your assets"
            descText="Please make sure you follow the instructions."
            warning
          />
          <BackupSeedDisplay
            words={this.props.seed}
            isModal
            pageNo={this.state.pageNo}
            onNext={this.onNext}
            onBack={this.onBack}
          />
        </Col>
      </Row>
    ) : (
      <LoadingIndicator />
    );
  }
}

const ViewSeedModalComponent: React.SFC<any> = props => {
  return props.isUnlocked ? (
    <Modal isOpen={props.isOpen} toggle={props.onCancel}>
      <ViewSeedComponent {...props} />
    </Modal>
  ) : (
    <Modal isOpen={props.isOpen} toggle={props.onCancel}>
      <ModalComponentBody onClose={props.onCancel}>
        <LightWalletSignPrompt onAccept={props.onAccept} onCancel={props.onCancel} />
        <p>{props.errorMsg}</p>
      </ModalComponentBody>
    </Modal>
  );
};

export const ViewSeedModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: s.showSeedModal.isOpen,
    errorMsg: s.showSeedModal.errorMsg,
    isLightWallet: selectIsLightWallet(s.web3State),
    isUnlocked: selectIsUnlocked(s.web3State),
    seed: selectSeed(s.web3State),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.showSeedModal.seedModelhide()),
    onAccept: (password?: string) => dispatch(actions.showSeedModal.seedModelAccept(password)),
    fetchSeed: () => dispatch(actions.web3.fetchSeedFromWallet()),
    clearSeed: () => dispatch(actions.web3.clearSeedFromState()),
  }),
})(ViewSeedModalComponent);

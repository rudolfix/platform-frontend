import * as React from "react";
import { Col, Row } from "reactstrap";
import { appRoutes } from "../../AppRouter";
import { LayoutAuthorized } from "../../layouts/LayoutAuthorized";
import { BreadCrumb } from "../../shared/BreadCrumb";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";
import { PanelWhite } from "../../shared/PanelWhite";
import { BackupSeedDisplay } from "./BackupSeedDisplay";
import { BackupSeedIntro } from "./BackupSeedIntro";
import { BackupSeedVerify } from "./BackupSeedVerify";

interface IProps {
  seed: string[];
  verifyBackupPhrase: () => void;
  onCancel: () => void;
  backupCodesVerified: boolean;
}

interface IState {
  backupStep: number;
}

export class BackupSeedFlowContainer extends React.Component<IProps, IState> {
  public state = {
    backupStep: 1,
  };

  private onBack = () => {
    this.setState({
      backupStep: this.state.backupStep - 1,
    });
  };

  private onNext = () => {
    this.setState({
      backupStep: this.state.backupStep + 1,
    });
  };

  renderBackupPage(): React.ReactNode {
    const { backupCodesVerified } = this.props;
    switch (this.state.backupStep) {
      case 1:
        return <BackupSeedIntro onBack={appRoutes.settings} onNext={this.onNext} />;
      case 2:
        return (
          <BackupSeedDisplay
            onBack={this.onBack}
            onNext={this.onNext}
            words={this.props.seed}
            pageNo={0}
          />
        );
      case 3:
        return (
          <BackupSeedDisplay
            onBack={this.onBack}
            onNext={() => (backupCodesVerified ? this.props.onCancel() : this.onNext())}
            words={this.props.seed}
            pageNo={1}
          />
        );
      case 4:
        return (
          <BackupSeedVerify
            onBack={this.onBack}
            onNext={this.props.verifyBackupPhrase}
            words={this.props.seed}
          />
        );
    }
  }

  render(): React.ReactNode {
    const steps = this.props.backupCodesVerified ? 3 : 4;
    return (
      <LayoutAuthorized>
        <BreadCrumb
          className="my-4"
          path={["Settings", "Security settings"]}
          view="Backup recovery phase"
        />
        <Row>
          <Col md={12} lg={{ size: 10, offset: 1 }} xl={{ size: 8, offset: 2 }}>
            <PanelWhite>
              <HeaderProgressStepper
                steps={steps}
                currentStep={this.state.backupStep}
                headerText="The safety phrase is crucial for the safety of your assets"
                descText="Please make sure you follow the instructions."
                warning
              />
              {this.renderBackupPage()}
            </PanelWhite>
          </Col>
        </Row>
      </LayoutAuthorized>
    );
  }
}

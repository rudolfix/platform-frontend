import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../../layouts/LayoutAuthorized";
import { ArrowLink } from "../../shared/ArrowLink";
import { BreadCrumb } from "../../shared/BreadCrumb";
import { ButtonPrimaryLink } from "../../shared/Buttons";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";
import { PanelWhite } from "../../shared/PanelWhite";
import { StepCard } from "../../shared/StepCard";

import * as noComputer from "../../../assets/img/seed_backup/no_computer.svg";
import * as safe from "../../../assets/img/seed_backup/safe.svg";
import * as write from "../../../assets/img/seed_backup/write.svg";

interface IBackupSeedIntroProps {
  nextLink: string;
  backLink: string;
}

export const BackupSeedIntro: React.SFC<IBackupSeedIntroProps> = ({ backLink, nextLink }) => (
  <LayoutAuthorized>
    <BreadCrumb
      className="my-4"
      path={["Settings", "Security settings"]}
      view="Backup recovery phase"
    />
    <Row>
      <Col md={12} lg={{ size: 10, offset: 1 }} xl={{ size: 8, offset: 2 }}>
        <PanelWhite className="pt-5">
          <HeaderProgressStepper
            steps={4}
            currentStep={1}
            headerText="The safety phrase is crucial for the safety of your assets"
            descText="Please make sure you follow the instructions."
            warning
          />
          <Row className="mb-4 text-center">
            <StepCard img={write} text={"Write all words on a piece of paper"} />
            <StepCard img={noComputer} text={"Do not store the words on your computer"} />
            <StepCard img={safe} text={"Store the phrase very safely"} />
          </Row>
          <Row className="my-5">
            <Col className="text-center">
              <ButtonPrimaryLink to={nextLink}>I have read instructions</ButtonPrimaryLink>
            </Col>
          </Row>
          <Row>
            <Col>
              <ArrowLink arrowDirection="left" to={backLink}>
                Back
              </ArrowLink>
            </Col>
          </Row>
        </PanelWhite>
      </Col>
    </Row>
  </LayoutAuthorized>
);

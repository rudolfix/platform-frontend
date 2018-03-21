import * as React from "react";
import { Col, Row } from "reactstrap";

import { ArrowLink } from "../../shared/ArrowNavigation";
import { ButtonPrimary } from "../../shared/Buttons";
import { StepCard } from "../../shared/StepCard";

import * as noComputer from "../../../assets/img/seed_backup/no_computer.svg";
import * as safe from "../../../assets/img/seed_backup/safe.svg";
import * as write from "../../../assets/img/seed_backup/write.svg";

interface IBackupSeedIntroProps {
  onNext: () => void;
  onBack: string;
}

export const BackupSeedIntro: React.SFC<IBackupSeedIntroProps> = ({ onBack, onNext }) => (
  <>
    <Row className="mb-4 text-center">
      <StepCard img={write} text={"Write all words on a piece of paper"} />
      <StepCard img={noComputer} text={"Do not store the words on your computer"} />
      <StepCard img={safe} text={"Store the phrase very safely"} />
    </Row>
    <Row className="my-5">
      <Col className="text-center">
        <ButtonPrimary onClick={onNext}>I have read instructions</ButtonPrimary>
      </Col>
    </Row>
    <Row>
      <Col className="col-auto">
        <ArrowLink arrowDirection="left" to={onBack}>
          Back
        </ArrowLink>
      </Col>
    </Row>
  </>
);

import * as React from "react";
import { Col, Row } from "reactstrap";

import { Button } from "../../shared/Buttons";
import { StepCard } from "../../shared/StepCard";

import * as noComputer from "../../../assets/img/seed_backup/no_computer.svg";
import * as safe from "../../../assets/img/seed_backup/safe.svg";
import * as write from "../../../assets/img/seed_backup/write.svg";

import { FormattedMessage } from "react-intl";
import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";

interface IBackupSeedIntroProps {
  onNext: () => void;
  onBack: string;
}

export const BackupSeedIntro = injectIntlHelpers<IBackupSeedIntroProps>(
  ({ intl: { formatIntlMessage }, onBack, onNext }) => (
    <>
      <Row className="mb-4 text-center">
        <StepCard
          img={write}
          text={formatIntlMessage("settings.backup-seed-intro.write-all-words")}
        />
        <StepCard
          img={noComputer}
          text={formatIntlMessage("settings.backup-seed-intro.words-warning")}
        />
        <StepCard img={safe} text={formatIntlMessage("settings.backup-seed-intro.store-safely")} />
      </Row>
      <Row className="my-5">
        <Col className="text-center">
          <Button onClick={onNext}>
            <FormattedMessage id="settings.backup-seed-intro.read-instructions" />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className="col-auto">
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={arrowLeft}
            onClick={() => onBack}
          >
            <FormattedMessage id="form.button.back" />
          </Button>
        </Col>
      </Row>
    </>
  ),
);

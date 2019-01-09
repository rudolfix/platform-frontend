import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { IWalletPrivateData } from "../../../modules/web3/reducer";
import { DashboardSection } from "../../eto/shared/DashboardSection";
import { Button, EButtonLayout } from "../../shared/buttons";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { ESectionHeaderSize } from "../../shared/SectionHeader";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./BackupSeedDisplay.module.scss";

interface IBackupSeedDisplayProps {
  onNext: () => void;
  onBack: () => void;
  walletPrivateData: IWalletPrivateData;
  isModal?: boolean;
}
const BackupSeedDisplay: React.SFC<IBackupSeedDisplayProps> = ({
  walletPrivateData,
  isModal,
  onNext,
  onBack,
}) => {
  return (
    <>
      <Row>
        <Col xs={{ size: 10, offset: 1 }}>
          <Row className="justify-content-around no-gutters">
            <DashboardSection
              title={<FormattedMessage id="components.settings.backup-seed-display.backup-seed" />}
              data-test-id="eto-dashboard-application"
              className="my-2"
              size={ESectionHeaderSize.MEDIUM}
            />
            {walletPrivateData.seed.map((word, index) => (
              <Col
                className={cn(styles.word, "mt-1 p-2 text-center")}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={index}
                data-test-id="seed-display-word"
              >
                {`${index + 1}.`}
                {isModal ? <div>{word}</div> : word}
              </Col>
            ))}
            <DashboardSection
              title={<FormattedMessage id="components.settings.backup-seed-display.private-key" />}
              data-test-id="eto-dashboard-application"
              className={styles.section}
              size={ESectionHeaderSize.MEDIUM}
            />
            <div className={styles.description}>
              <FormattedHTMLMessage
                tagName="span"
                id="components.settings.backup-seed-display.private-key-description"
              />
            </div>
            <Col
              className={cn(styles.word, "mt-2 p-2 text-center d-flex")}
              xs="auto"
              data-test-id="seed-display-word"
            >
              <div className="mr-2">{walletPrivateData.privateKey}</div>
              <CopyToClipboard value={walletPrivateData.privateKey} />
            </Col>
          </Row>
        </Col>
      </Row>

      {!isModal && (
        <Row className="justify-content-around">
          <Col className="mt-2" xs="auto">
            <Button
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-before"
              svgIcon={arrowLeft}
              onClick={onBack}
            >
              <FormattedMessage id="form.button.back" />
            </Button>
          </Col>
          <Col className="mt-2" xs="auto">
            <Button
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-before"
              onClick={onNext}
              data-test-id="seed-display-next-link"
            >
              <FormattedMessage id="form.button.continue" />
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export { BackupSeedDisplay };

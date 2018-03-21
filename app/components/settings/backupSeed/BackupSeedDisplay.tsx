import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { ArrowButton } from "../../shared/ArrowNavigation";
import { ButtonPrimary } from "../../shared/Buttons";

import * as styles from "./BackupSeedDisplay.module.scss";

export const WORDS_PER_PAGE: number = 12;

interface IBackupSeedDisplayProps {
  onNext: () => void;
  onBack: () => void;
  words: string[];
  isModal?: boolean;
  pageNo: number;
}
export const BackupSeedDisplay: React.SFC<IBackupSeedDisplayProps> = props => {
  const wordsNo = props.words.length;
  const startWord = WORDS_PER_PAGE * props.pageNo;
  const endWord = startWord + WORDS_PER_PAGE;
  const showNextButton = endWord >= wordsNo;
  return (
    <>
      <Row>
        <Col xs={{ size: 10, offset: 1 }}>
          <Row className="no-gutters">
            <Col className={cn("text-right", styles.pageStatus)}>
              {`${(props.pageNo + 1) * WORDS_PER_PAGE} / ${wordsNo}`}
            </Col>
          </Row>
          <Row className="justify-content-around no-gutters">
            {props.words.slice(startWord, endWord).map((word, index) => (
              <Col
                className={cn(styles.word, "mt-1 p-2 text-center")}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={word}
                data-test-id="seed-display-word"
              >
                {`${props.pageNo * WORDS_PER_PAGE + index + 1}.`}
                {props.isModal ? <div>{word}</div> : word}
              </Col>
            ))}
          </Row>
          <Row className="my-4 justify-content-center justify-content-sm-between">
            <Col className="mt-2" xs="auto">
              <ButtonPrimary
                data-test-id="seed-display-prev-words"
                disabled={props.pageNo === 0}
                onClick={props.onBack}
              >
                {`previous ${WORDS_PER_PAGE} words`}
              </ButtonPrimary>
            </Col>
            <Col className="mt-2" xs="auto">
              {props.onNext && showNextButton ? (
                <ButtonPrimary data-test-id="seed-display-next-link" onClick={props.onNext}>
                  Go to next step
                </ButtonPrimary>
              ) : (
                <ButtonPrimary
                  data-test-id="seed-display-next-words"
                  disabled={props.pageNo === 1}
                  onClick={props.onNext}
                >
                  {`next ${WORDS_PER_PAGE} words`}
                </ButtonPrimary>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      {!props.isModal && (
        <Row>
          <Col>
            <ArrowButton arrowDirection="left" onClick={props.onBack}>
              Back
            </ArrowButton>
          </Col>
        </Row>
      )}
    </>
  );
};

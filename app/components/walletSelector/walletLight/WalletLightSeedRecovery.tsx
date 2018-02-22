import * as Mnemonic from "bitcore-mnemonic";
import { range } from "lodash";
import * as React from "react";
/* tslint:disable: no-submodule-imports */
import "react-select/dist/react-select.css";
import Select from "react-virtualized-select";
import "react-virtualized-select/styles.css";
import "react-virtualized/styles.css";
/* tslint:enable: no-submodule-imports */
import { Button, Col, Row } from "reactstrap";

import { WalletResetHeader } from "./WalletResetHeader";

export const SEED_LENGTH = 24;
const WORDS_PER_VIEW = 4;
const wordsOptions = Mnemonic.Words.ENGLISH.map((word: string) => ({ value: word, label: word }));

interface ISeedRecoveryProps {
  sendWords: (words: string[]) => void;
}

interface ISeedRecoveryState {
  words: string[];
  page: number;
}

export class WalletLightSeedRecoveryComponent extends React.Component<
  ISeedRecoveryProps,
  ISeedRecoveryState
> {
  constructor(props: ISeedRecoveryProps) {
    super(props);

    this.state = {
      words: Array(SEED_LENGTH).fill(null),
      page: 0,
    };
  }

  updateValueFactory = (wordNumber: number) => (newValue: any): void => {
    const words = this.state.words;
    words[wordNumber] = newValue;
    this.setState({
      words,
    });
  };

  generateSelect = (wordNumber: number): React.ReactNode => (
    <Select
      options={wordsOptions}
      simpleValue
      clearable={false}
      matchPos="start"
      matchProp="value"
      value={this.state.words[wordNumber]}
      onChange={this.updateValueFactory(wordNumber)}
      placeholder={"word " + (wordNumber + 1).toString(10)}
      noResultsText="No matching word"
    />
  );

  handleNextView = () => {
    this.setState({
      page: this.state.page + 1,
    });
  };

  handlePreviousView = () => {
    if (this.state.page > 0) {
      this.setState({
        page: this.state.page - 1,
      });
    }
  };

  handleSendWords = () => {
    this.props.sendWords(this.state.words);
  };

  render(): React.ReactNode {
    const startIndex = this.state.page * WORDS_PER_VIEW;
    const endIndex = startIndex + WORDS_PER_VIEW;

    const canAdvance = this.state.words
      .slice(startIndex, endIndex)
      .reduce((acc: boolean, value: string): boolean => {
        return acc && value !== null;
      }, true);

    const canSubmit = this.state.words.reduce((acc: boolean, value: string): boolean => {
      return acc && value !== null;
    }, true);

    return (
      <>
        <WalletResetHeader
          text={"Use the Recovery Phrase to restore your password."}
          currentStep={this.state.page + 1}
          steps={SEED_LENGTH / WORDS_PER_VIEW}
        />
        <Row className="justify-content-center my-3">
          <div>{this.state.words.filter(word => word !== null).join(" , ")}</div>
        </Row>
        <Row>
          {range(startIndex, endIndex).map(num => (
            <Col xs={{ size: 6, offset: 3 }} sm={{ size: 3, offset: 0 }} key={num} className="my-3">
              {this.generateSelect(num)}
            </Col>
          ))}
        </Row>
        <Row className="d-flex justify-content-between my-3">
          <Button
            data-test-id="btn-previous"
            disabled={startIndex === 0}
            onClick={this.handlePreviousView}
          >
            previous words
          </Button>
          {this.state.page + 1 < SEED_LENGTH / WORDS_PER_VIEW && (
            <Button data-test-id="btn-next" disabled={!canAdvance} onClick={this.handleNextView}>
              next {`${endIndex} / ${SEED_LENGTH}`}
            </Button>
          )}
        </Row>
        <Row className="text-center my-3">
          <Col>
            <Button data-test-id="btn-send" disabled={!canSubmit} onClick={this.handleSendWords}>
              Send words
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export const WalletLightSeedRecovery = () => (
  <WalletLightSeedRecoveryComponent
    // tslint:disable-next-line no-console
    sendWords={(words: string[]) => console.log("sending words", words)}
  />
);

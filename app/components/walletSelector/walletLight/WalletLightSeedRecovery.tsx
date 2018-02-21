import * as Mnemonic from "bitcore-mnemonic";
import { range } from "lodash";
import * as React from "react";
import Select from "react-select";
// tslint:disable-next-line no-submodule-imports
import "react-select/dist/react-select.css";
import { Button, Col, Row } from "reactstrap";

const SEED_LENGTH = 24;
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
      words: Array(SEED_LENGTH).fill("_"),
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
      onBlurResetsInput={false}
      onSelectResetsInput={false}
      simpleValue
      clearable
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
        return acc && value.length > 1;
      }, true);

    const canSubmit = this.state.words.reduce((acc: boolean, value: string): boolean => {
      return acc && value.length > 1;
    }, true);

    return (
      <>
        <Row>
          <div className="text-center">{this.state.words.join(" , ")}</div>
        </Row>
        <Row>
          {range(startIndex, endIndex).map(num => <Col key={num}>{this.generateSelect(num)}</Col>)}
        </Row>
        <Row className="d-flex justify-content-between">
          <Button disabled={startIndex === 0} onClick={this.handlePreviousView}>
            previous words
          </Button>
          {this.state.page + 1 < SEED_LENGTH / WORDS_PER_VIEW && (
            <Button disabled={!canAdvance} onClick={this.handleNextView}>
              next {`${endIndex} / ${SEED_LENGTH}`}
            </Button>
          )}
        </Row>
        {canSubmit && (
          <Row className="text-center">
            <Col>
              <Button onClick={this.handleSendWords}>Send words</Button>
            </Col>
          </Row>
        )}
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

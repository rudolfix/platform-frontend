import { Button, EButtonLayout } from "@neufund/design-system";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../../config/externalRoutes";
import { testWalletSeed } from "../../../../lib/web3/light-wallet/LightWalletUtils";
import { TElementRef } from "../../../../types";
import { englishMnemonics } from "../../../../utils/englishMnemonics";
import { FormError } from "../../../shared/forms/fields/FormFieldError";
import { VirtualizedSelect } from "../../../shared/forms/fields/VirtualizedSelect";

import * as styles from "./SeedRecovery.unsafe.module.scss";

export const SEED_LENGTH = 24;
const wordsOptions = englishMnemonics.map((word: string) => ({ value: word, label: word }));

interface ISeedRecoveryProps {
  onValidSeed: (words: string) => void;
}

interface ISeedRecoveryState {
  words: (string | null)[];
  seedError: boolean;
}

export class LightWalletSeedRecoveryComponent extends React.Component<
  ISeedRecoveryProps,
  ISeedRecoveryState
> {
  verificationSelectRefs: TElementRef<VirtualizedSelect>[] = [];
  nextButtonRef = React.createRef<HTMLButtonElement>();

  state = {
    words: Array(SEED_LENGTH).fill(null),
    seedError: false,
  };

  setWord = (index: number) => (newValue: any): void => {
    const words = [...this.state.words];
    words[index] = newValue;

    this.setState(
      {
        words,
      },
      () => this.focusNext(index),
    );
  };

  focusNext = (current: number) => {
    if (current + 1 < SEED_LENGTH) {
      this.focusSelect(current + 1);
    } else if (this.nextButtonRef.current) {
      this.nextButtonRef.current.focus();
    }
  };

  focusSelect = (index: number) => {
    const selectRef = this.verificationSelectRefs[index];

    if (selectRef) {
      // Typings are not up to date. Below is the link to method in case of any error.
      // https://github.com/bvaughn/react-virtualized-select/blob/b24fb1d59777d0d50cdb77b41a72cca1b58e0c00/source/VirtualizedSelect/VirtualizedSelect.js#L44
      (selectRef as any).focus();
    }
  };

  handleSendWords = () => {
    const words = this.state.words.join(" ");
    if (testWalletSeed(words)) {
      this.props.onValidSeed(words);
    } else {
      this.setState({
        seedError: true,
      });
    }
  };

  render(): React.ReactNode {
    const canSubmit = this.state.words.every(word => word !== null);
    return (
      <>
        <div className={styles.words}>
          {this.state.words.map((_: string, index: number) => (
            <div
              data-test-id={`seed-recovery-word-${index}`}
              className={styles.word}
              key={index.toString()}
            >
              <div className={styles.wordNumber}>{`${(index + 1).toString(10)}. `}</div>
              <VirtualizedSelect
                className={styles.select}
                options={wordsOptions}
                simpleValue
                clearable={true}
                matchPos="start"
                matchProp="value"
                ref={
                  ((ref: VirtualizedSelect | null) =>
                    (this.verificationSelectRefs[index] = ref)) as any
                }
                value={this.state.words[index]}
                onChange={this.setWord(index)}
                placeholder={""}
                noResultsText="No matching word"
              />
            </div>
          ))}
        </div>

        {this.state.seedError && (
          <FormError
            message={<FormattedMessage id="account-recovery.seed-error" />}
            className={styles.seedError}
            name="account-recovery.seed-error"
          />
        )}
        <Button
          layout={EButtonLayout.PRIMARY}
          data-test-id="btn-send"
          disabled={!canSubmit}
          onClick={this.handleSendWords}
          className={styles.button}
        >
          <FormattedMessage id="account-recovery.seed-check.verify-button" />
        </Button>
        <div className={styles.line} />
        <p className={styles.help}>
          <FormattedHTMLMessage
            tagName="span"
            id="account-recovery.seed-check.help"
            values={{ helpUrl: externalRoutes.neufundSupportHome }}
          />
        </p>
      </>
    );
  }
}

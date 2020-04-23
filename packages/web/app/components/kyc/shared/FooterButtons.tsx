import { Button, ButtonGroup, EButtonLayout, EButtonSize } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import * as styles from "../personal/DocumentVerification.module.scss";

type TProps = {
  onBack: () => void;
  onContinue: () => void;
  backButtonId?: string;
  continueButtonId: string;
  continueDisabled?: boolean;
  skip?: boolean;
};

export const FooterButtons: React.FunctionComponent<TProps> = ({
  onBack,
  onContinue,
  backButtonId,
  continueButtonId,
  continueDisabled,
  skip,
}) => (
  <ButtonGroup className={styles.buttons}>
    <Button
      layout={EButtonLayout.SECONDARY}
      size={EButtonSize.NORMAL}
      className={styles.button}
      data-test-id={backButtonId}
      onClick={onBack}
    >
      <FormattedMessage id="form.back" />
    </Button>

    <Button
      disabled={continueDisabled}
      layout={EButtonLayout.PRIMARY}
      size={EButtonSize.NORMAL}
      className={styles.button}
      data-test-id={continueButtonId}
      onClick={onContinue}
      type="submit"
    >
      {skip ? (
        <FormattedMessage id={"form.button.skip"} />
      ) : (
        <FormattedMessage id={"form.button.continue"} />
      )}
    </Button>
  </ButtonGroup>
);

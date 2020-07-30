import { ButtonBase, ButtonGroup } from "@neufund/design-system";
import cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { Heading } from "../../shared/Heading";
import { useCopyClipboard } from "../../shared/hooks/useCopyToClipboard";
import { InlineIcon } from "../../shared/icons/InlineIcon";

import blindIcon from "../../../assets/img/inline_icons/blind.svg";
import eyeIcon from "../../../assets/img/inline_icons/eye.svg";
import clipboardIcon from "../../../assets/img/inline_icons/icon-clipboard.svg";
import * as styles from "./PrivateKeyDisplay.module.scss";

type TProps = {
  privateKey: string;
};

const PrivateKeyDisplay: React.FunctionComponent<TProps> = ({ privateKey }) => {
  const [showPrivateKey, setShowPrivateKey] = React.useState(false);
  const [, copyToClipboard] = useCopyClipboard();

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(show => !show);
  };

  const copyPrivateKeyToClipboard = () => {
    copyToClipboard(privateKey, {
      message: (
        <FormattedMessage id="components.settings.private-key-display.copied-to-clipboard" />
      ),
      "data-test-id": "private-key-display-copied-to-clipboard",
    });
  };

  return (
    <section className="mb-4">
      <Heading level={3} className="mb-3">
        <FormattedMessage id="components.settings.private-key-display.header" />
      </Heading>
      <p>
        <FormattedHTMLMessage
          tagName="span"
          id="components.settings.private-key-display.description"
        />
      </p>
      <ButtonGroup>
        <ButtonBase
          data-test-id="private-key-display.copy-to-clipboard"
          className={styles.button}
          onClick={copyPrivateKeyToClipboard}
          type="button"
        >
          <FormattedMessage id="components.settings.private-key-display.copy-private-key" />
          <InlineIcon svgIcon={clipboardIcon} />
        </ButtonBase>
        <ButtonBase
          aria-live="polite"
          data-test-id="private-key-display.view-private-key"
          className={cn(styles.button, { [styles.buttonActive]: showPrivateKey })}
          onClick={togglePrivateKeyVisibility}
        >
          {showPrivateKey ? (
            process.env.NF_CYPRESS_RUN === "1" ? (
              <div data-test-id="private-key-display.content">{privateKey}</div>
            ) : (
              privateKey
            )
          ) : (
            <FormattedMessage id="components.settings.private-key-display.view-private-key" />
          )}
          <InlineIcon svgIcon={showPrivateKey ? blindIcon : eyeIcon} />
        </ButtonBase>
      </ButtonGroup>
    </section>
  );
};

export { PrivateKeyDisplay };

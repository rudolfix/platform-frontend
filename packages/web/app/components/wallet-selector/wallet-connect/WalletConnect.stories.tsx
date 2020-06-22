import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Content, EContentWidth } from "../../layouts/Content";
import { TestMessage } from "../../translatedMessages/messages";
import { WalletConnectLayout } from "./WalletConnect";

storiesOf("WalletConnect landing page", module)
  .add("default", () => (
    <Content width={EContentWidth.SMALL}>
      <WalletConnectLayout error={undefined} walletConnectStart={action("start")} />
    </Content>
  ))
  .add("with error", () => {
    const error = {
      messageType: TestMessage.TEST_MESSAGE,
      messageData: {
        message:
          "a long and very complicated description of an error that occurred during walletConnect server communication",
      },
    };
    return (
      <Content width={EContentWidth.SMALL}>
        <WalletConnectLayout error={error} walletConnectStart={action("start")} />
      </Content>
    );
  });

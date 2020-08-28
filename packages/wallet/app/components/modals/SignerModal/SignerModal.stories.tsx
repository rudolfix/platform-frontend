import { toEthereumChecksumAddress } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";

import { ESignerUIState, ESignerType } from "modules/signer-ui/module";
import { TSignerSignPayload } from "modules/signer-ui/types";

import { SignerModalLayout } from "./SignerModal";

const signerModalCommonProps = {
  state: ESignerUIState.SIGNING,
  approve: action("approve"),
  reject: action("reject"),
};

const sendTransactionSignerRequest: TSignerSignPayload = {
  type: ESignerType.SEND_TRANSACTION,
  data: {
    transaction: {
      to: toEthereumChecksumAddress("0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988"),
      gasLimit: "0x0",
      gasPrice: "0x0",
      value: "0x0",
    },
  },
};

const signMessageSignerRequest: TSignerSignPayload = {
  type: ESignerType.SIGN_MESSAGE,
  data: {
    digest: "foo",
  },
};

const wcSessionSignerRequest: TSignerSignPayload = {
  type: ESignerType.WC_SESSION_REQUEST,
  data: {
    peerId: "foo",
    peerName: "Neufund",
    peerUrl: "https://platform.neufund.org",
  },
};

storiesOf("Templates|SignerModal", module)
  .add("Send Transaction Signer", () => (
    <SignerModalLayout {...signerModalCommonProps} request={sendTransactionSignerRequest} />
  ))
  .add("Sign Message Signer", () => (
    <SignerModalLayout {...signerModalCommonProps} request={signMessageSignerRequest} />
  ))
  .add("WC Session Request Signer", () => (
    <SignerModalLayout {...signerModalCommonProps} request={wcSessionSignerRequest} />
  ));

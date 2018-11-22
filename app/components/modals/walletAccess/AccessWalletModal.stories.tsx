import { storiesOf } from "@storybook/react";
import * as React from "react";
import { EWalletType } from "../../../modules/web3/types";
import { ModalComponentBody } from "../ModalComponentBody";
import { AccessWalletContainerComponent } from "./AccessWalletModal";

const props = {
  title: "Verify your email",
  message: "By confirming this request, your email will be updated",
  errorMsg: undefined,
  isUnlocked: false,
  onAccept: () => {},
  walletType: EWalletType.LIGHT,
};

storiesOf("AccessWalletModal", module)
  .addDecorator(story => (
    <div style={{ maxWidth: "37.5rem" }}>
      <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
    </div>
  ))
  .add("lightwallet", () => <AccessWalletContainerComponent {...props} />)
  .add("lightwallet-unlocked", () => (
    <AccessWalletContainerComponent {...props} isUnlocked={true} />
  ))
  .add("metamask", () => (
    <AccessWalletContainerComponent {...props} walletType={EWalletType.BROWSER} />
  ))
  .add("ledger", () => (
    <AccessWalletContainerComponent {...props} walletType={EWalletType.LEDGER} />
  ));

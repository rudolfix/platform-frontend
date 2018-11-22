import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Modal } from "reactstrap";
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
    <Modal isOpen={true} toggle={() => {}} centered fade={false}>
      <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
    </Modal>
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

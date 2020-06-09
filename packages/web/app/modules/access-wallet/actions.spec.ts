import { expect } from "chai";

import { TestMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { actions } from "../actions";
import { accessWalletReducer, initialState } from "./reducer";

describe("access-wallet actions", () => {
  const title = createMessage(TestMessage.TEST_MESSAGE);
  const message = createMessage(TestMessage.TEST_MESSAGE);
  const inputLabel = createMessage(TestMessage.TEST_MESSAGE);

  describe("showAccessWalletModal", () => {
    it("showAccessWalletModal with all arguments", () => {
      const action = actions.accessWallet.showAccessWalletModal(title, message, inputLabel);
      const newState = accessWalletReducer(initialState, action);

      expect(newState).to.be.deep.eq({
        isModalOpen: true,
        errorMessage: undefined,
        modalTitle: title,
        modalMessage: message,
        inputLabel: inputLabel,
      });
    });

    it("showAccessWalletModal without optional arguments", () => {
      const action = actions.accessWallet.showAccessWalletModal(title);
      const newState = accessWalletReducer(initialState, action);

      expect(newState).to.be.deep.eq({
        isModalOpen: true,
        errorMessage: undefined,
        modalTitle: title,
        modalMessage: undefined,
        inputLabel: undefined,
      });
    });
  });

  describe("hideAccessWalletModal", () => {
    it("sets isModalOpen to false, leaves the rest intact", () => {
      const action = actions.accessWallet.hideAccessWalletModal();
      const oldState = {
        isModalOpen: true,
        errorMessage: undefined,
        modalTitle: title,
        modalMessage: message,
        inputLabel: inputLabel,
      };

      const newState = accessWalletReducer(oldState, action);

      expect(newState).to.be.deep.eq({
        isModalOpen: false,
        errorMessage: undefined,
        modalTitle: title,
        modalMessage: message,
        inputLabel: inputLabel,
      });
    });
  });
  describe("signingError", () => {
    it("saves an error message", () => {
      const errorMessage = createMessage(TestMessage.TEST_MESSAGE);

      const action = actions.accessWallet.signingError(errorMessage);

      const newState = accessWalletReducer(initialState, action);
      expect(newState).to.be.deep.eq({
        isModalOpen: false,
        errorMessage,
      });
    });
  });

  describe("clearSigningError", () => {
    it("clears the error message, leaves the rest intact", () => {
      const action = actions.accessWallet.clearSigningError();
      const newState = accessWalletReducer(initialState, action);
      expect(newState).to.be.deep.eq({
        isModalOpen: false,
        errorMessage: undefined,
      });
    });
  });
  describe("accept", () => {
    it("clears the error message, leaves the rest intact", () => {
      const action = actions.accessWallet.clearSigningError();
      const newState = accessWalletReducer(initialState, action);
      expect(newState).to.be.deep.eq({
        isModalOpen: false,
        errorMessage: undefined,
      });
    });
  });
});

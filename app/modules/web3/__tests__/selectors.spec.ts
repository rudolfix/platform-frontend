import { expect } from "chai";
import { RouterState } from "react-router-redux";
import { dummyEthereumAddress } from "../../../../test/fixtures";
import { IWeb3State } from "../reducer";
import {
  selectActivationCodeFromQueryString,
  selectIsLightWallet,
  selectLightWalletEmailFromQueryString,
  selectLightWalletFromQueryString,
} from "../selectors";
import { WalletType } from "../types";
import { getDummyLightWalletMetadata } from "./fixtures";

describe("web3 > selectors", () => {
  const salt = "salt";
  const code = "code";
  const vault = "vault";
  const email = "test@example.com";
  const encodedEmail = email.replace("@", "%2540");

  describe("selectIsLightWallet", () => {
    it("should work with connected wallet", () => {
      const state: IWeb3State = {
        connected: true,
        isUnlocked: false,
        wallet: getDummyLightWalletMetadata(),
      };

      const isLightWallet = selectIsLightWallet(state);

      expect(isLightWallet).to.be.true;
    });

    it("should work with not connected wallet", () => {
      const state: IWeb3State = {
        connected: false,
        previousConnectedWallet: {
          walletType: WalletType.LIGHT,
          address: dummyEthereumAddress,
          vault,
          email: "test@example.com",
          salt,
        },
      };

      const isLightWallet = selectIsLightWallet(state);

      expect(isLightWallet).to.be.true;
    });
  });

  describe("selectLightWalletEmailFromQueryString", () => {
    it("should work with activation link", () => {
      const state: RouterState = {
        location: {
          pathname: "/login/light",
          state: undefined,
          hash: "",
          search: `?redirect=%2F%26email%3D${encodedEmail}`,
        },
      };

      expect(selectLightWalletEmailFromQueryString(state) === email).to.be.true;
    });
  });

  describe("selectActivationCodeFromQueryString", () => {
    it("should work with activation link", () => {
      const state: RouterState = {
        location: {
          pathname: "/login/light",
          state: undefined,
          hash: "",
          search: `?redirect=%2F%26code%3D${code}`,
        },
      };

      const result: any = { ...selectActivationCodeFromQueryString(state) };

      expect(result.verificationCode === code).to.be.true;
    });
  });

  describe("selectLightWalletFromQueryString", () => {
    it("should work with activation link", () => {
      const state: any = {
        location: {
          pathname: "/login/light",
          state: undefined,
          hash: "",
          search: `?redirect=%2F%26email%3D${encodedEmail}%26salt%3D${salt}`,
        },
        previousConnectedWallet: {
          walletType: WalletType.LIGHT,
          address: dummyEthereumAddress,
          vault,
          email: "test@example.com",
          salt,
        },
      };

      const result: any = { ...selectLightWalletFromQueryString(state) };

      expect(result.email === email && result.salt === salt).to.be.true;
    });
  });
});

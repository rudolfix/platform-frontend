import { LightWalletWrongPassword } from "../../../lib/web3/LightWallet";

export function mapLightWalletErrorToErrorMessage(e: Error): string {
  if (e instanceof LightWalletWrongPassword) {
    return "Incorrect password";
  }
  return "Light Wallet unavailable";
}

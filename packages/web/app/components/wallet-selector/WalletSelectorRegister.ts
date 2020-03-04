import { EWalletType } from "../../modules/web3/types";
import { branch, compose, renderComponent } from "recompose";

import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { appConnect } from "../../store";
import { selectRegisterWalletType } from "../../modules/wallet-selector/selectors";
import { RegisterLightWallet } from "./light/Register/RegisterLightWallet";
import { RegisterBrowserWallet } from "./browser/Register/RegisterBrowserWallet";
import { shouldNeverHappen } from "../shared/NeverComponent";
import { RegisterLedger } from "./ledger/Register/RegisterLedger";

type TStateProps = { walletType: EWalletType }

export const WalletSelectorRegister = compose<TStateProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TStateProps>({
    stateToProps: s => ({
      walletType: selectRegisterWalletType(s)
    }),
  }),

  branch<TStateProps>(({ walletType }) => walletType === EWalletType.LIGHT,
    renderComponent(RegisterLightWallet)),
  branch<TStateProps>(({ walletType }) => walletType === EWalletType.BROWSER,
    renderComponent(RegisterBrowserWallet)),
  branch<TStateProps>(({ walletType }) => walletType === EWalletType.LEDGER,
    renderComponent(RegisterLedger))
)(shouldNeverHappen("WalletSelectorRegister reached default branch"));

import { EWalletType } from "../../modules/web3/types";
import { branch, compose, renderComponent, withProps } from "recompose";

import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { appConnect } from "../../store";
import { selectRegisterWalletType } from "../../modules/wallet-selector/selectors";
import { withContainer } from "../../../../shared/dist/utils/withContainer.unsafe";
import { TContentExternalProps, TransitionalLayout } from "../layouts/Layout";
import { EContentWidth } from "../layouts/Content";
import { RegisterLightWallet } from "./light/Register/RegisterLightWallet";
import { RegisterBrowserWallet } from "./browser/Register/RegisterBrowserWallet";
import { shouldNeverHappen } from "../shared/NeverComponent";

type TStateProps = {walletType:EWalletType}

export const WalletSelectorRegister = compose<TStateProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TStateProps>({
    stateToProps: s => ({
      walletType:selectRegisterWalletType(s)
    }),
  }),
  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
  branch<TStateProps>(({walletType}) => walletType === EWalletType.LIGHT,
    renderComponent(RegisterLightWallet)),
  branch<TStateProps>(({walletType}) => walletType === EWalletType.BROWSER,
    renderComponent(RegisterBrowserWallet)),
// branch<TStateProps>(({walletType}) => walletType === EWalletType.LEDGER,
//   renderComponent(BrowserWalletRegister))
)(shouldNeverHappen("WalletSelectorRegister reached default branch"));

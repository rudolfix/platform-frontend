import BigNumber from "bignumber.js";
import { branch, compose, renderComponent } from "recompose";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { ImmutableFileId } from "../../lib/api/ImmutableStorage.interfaces";
import { actions } from "../../modules/actions";
import { selectMyAssets, selectMyPendingAssets } from "../../modules/investor-tickets/selectors";
import { selectNeuPriceEur } from "../../modules/shared/tokenPrice/selectors";
import { selectNeuBalance, selectNeuBalanceEuroAmount } from "../../modules/wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { withMetaTags } from "../../utils/withMetaTags";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

export type TStateProps = Partial<TPortfolioLayoutProps>;

export const Portfolio = compose<TPortfolioLayoutProps, {}>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.publicEtos.loadEtos()),
  }),
  appConnect<
    TStateProps,
    { downloadDocument: (immutableFileId: ImmutableFileId, fileName: string) => void }
  >({
    stateToProps: state => {
      const neuPrice = selectNeuPriceEur(state);
      return {
        myAssets: selectMyAssets(state),
        pendingAssets: selectMyPendingAssets(state),
        myNeuBalance: selectNeuBalance(state.wallet),
        myNeuBalanceEuroAmount: selectNeuBalanceEuroAmount(state),
        neuPrice: neuPrice && new BigNumber(neuPrice).toFixed(8),
        walletAddress: selectEthereumAddressWithChecksum(state),
      };
    },
    dispatchToProps: dispatch => ({
      downloadDocument: (immutableFileId: ImmutableFileId, fileName: string) => {
        dispatch(actions.immutableStorage.downloadImmutableFile(immutableFileId, fileName));
      },
      generateTemplateByEtoId: (immutableFileId: IEtoDocument, etoId: string) => {
        dispatch(actions.etoDocuments.generateTemplateByEtoId(immutableFileId, etoId));
      },
    }),
  }),
  withContainer(LayoutAuthorized),
  branch(
    (props: TStateProps) => !props.myAssets && !props.pendingAssets,
    renderComponent(LoadingIndicator),
  ),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.portfolio") })),
)(PortfolioLayout);

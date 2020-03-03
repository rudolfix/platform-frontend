import { branch, compose, renderComponent } from "recompose";

import { selectEtoViewData } from "../../../modules/eto-view/shared/selectors";
import { EEtoViewType, TEtoViewData, TEtoViewState } from "../../../modules/eto-view/shared/types";
import { appConnect } from "../../../store";
import { EProcessState } from "../../../utils/enums/processStates";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { shouldNeverHappen } from "../../shared/NeverComponent";
import { EtoViewInvestor } from "./EtoViewInvestorLayout";
import { EtoViewIssuer } from "./EtoViewIssuerLayout";
import { EtoViewNominee } from "./EtoViewNomineeLayout";
import { EtoViewNonAuthorized } from "./EtoViewNonAuthorizedLayout";

export const EtoViewMain = compose<{}, {}>(
  appConnect<TEtoViewState, {}, {}>({
    stateToProps: state => ({
      ...selectEtoViewData(state),
    }),
  }),
  branch<TEtoViewState>(
    ({ processState }) => processState === EProcessState.ERROR,
    renderComponent(ErrorBoundaryLayout),
  ),
  branch<TEtoViewState>(
    ({ processState }) =>
      processState === EProcessState.NOT_STARTED || processState === EProcessState.IN_PROGRESS,
    renderComponent(LoadingIndicator),
  ),
  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_NOT_AUTHORIZED,
    renderComponent<TEtoViewData>(EtoViewNonAuthorized),
  ),
  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_INVESTOR,
    renderComponent<TEtoViewData>(EtoViewInvestor),
  ),
  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_ISSUER,
    renderComponent<TEtoViewData>(EtoViewIssuer),
  ),
  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_ISSUER_PREVIEW,
    renderComponent<TEtoViewData>(EtoViewInvestor),
  ),
  branch<TEtoViewState>(
    ({ etoViewType }) => etoViewType === EEtoViewType.ETO_VIEW_NOMINEE,
    renderComponent<TEtoViewData>(EtoViewNominee),
  ),
)(shouldNeverHappen("EtoViewMain branched to default branch"));

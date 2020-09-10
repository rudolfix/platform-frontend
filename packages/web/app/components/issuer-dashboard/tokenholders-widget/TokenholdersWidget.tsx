import { Button, EButtonLayout, Eur } from "@neufund/design-system";
import { etoModuleApi } from "@neufund/shared-modules";
import { invariant } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, renderNothing } from "recompose";

import { actions } from "../../../modules/actions";
import { selectIssuerEtoWithCompanyAndContract } from "../../../modules/eto-flow/selectors";
import { appConnect } from "../../../store";
import { EColumnSpan } from "../../layouts/Container";
import {
  DashboardLoadingWidget,
  DashboardWidget,
} from "../../shared/dashboard-widget/DashboardWidget";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";

interface IStateProps {
  eto: ReturnType<typeof selectIssuerEtoWithCompanyAndContract>;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

interface IDispatchProps {
  downloadTokenholdersList: () => void;
}

const TokenholdersWidgetLayout: React.ComponentType<IStateProps &
  IDispatchProps &
  IExternalProps> = ({ columnSpan, eto, downloadTokenholdersList }) => {
  invariant(eto && etoModuleApi.utils.isOnChain(eto), "Invalid eto state");

  return (
    <DashboardWidget
      title={<FormattedMessage id="eto.settings.tokenholders.title" />}
      text={
        <FormattedMessage
          id="eto.settings.tokenholders.text"
          values={{
            totalAmount: <Eur value={eto.contract.totalInvestment.totalEquivEur} />,
            totalInvestors: eto.contract.totalInvestment.totalInvestors,
          }}
        />
      }
      columnSpan={columnSpan}
      data-test-id="eto-settings-tokenholders"
    >
      <div className="m-auto">
        <Button
          layout={EButtonLayout.LINK}
          type="button"
          onClick={downloadTokenholdersList}
          data-test-id="eto-settings-tokenholders.download"
        >
          <FormattedMessage id="eto.settings.tokenholders.download-list" />
        </Button>
      </div>
    </DashboardWidget>
  );
};

const WidgetLoading: React.ComponentType<IExternalProps> = ({ columnSpan }) => (
  <DashboardLoadingWidget
    columnSpan={columnSpan}
    title={<FormattedMessage id="eto.settings.tokenholders.title" />}
  />
);

const TokenholdersWidget = compose<IStateProps & IDispatchProps & IExternalProps, IExternalProps>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      eto: selectIssuerEtoWithCompanyAndContract(state),
    }),
    dispatchToProps: dispatch => ({
      downloadTokenholdersList: () => {
        dispatch(actions.etoFlow.downloadTokenholdersList());
      },
    }),
  }),
  branch<IStateProps>(props => props.eto === undefined, renderComponent(WidgetLoading)),
  branch<IStateProps>(({ eto }) => {
    invariant(eto, "Eto should be defined at this point");

    return !etoModuleApi.utils.isSuccessful(eto);
  }, renderNothing),
)(TokenholdersWidgetLayout);

export { TokenholdersWidgetLayout, TokenholdersWidget };

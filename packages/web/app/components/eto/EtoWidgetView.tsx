import { etoModuleApi, TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/react-connected-components/OnEnterAction";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoOverviewStatus } from "./overview/EtoOverviewStatus/EtoOverviewStatus";

import * as styles from "./overview/EtoOverviewStatus/EtoOverviewStatus.module.scss";

interface IStateProps {
  eto?: TEtoWithCompanyAndContractReadonly;
  widgetError: boolean | undefined;
}

interface IRouterParams {
  previewCode: string;
}

type TProps = {
  eto: TEtoWithCompanyAndContractReadonly;
  widgetError: boolean | undefined;
};

const EtoWidgetError: React.FunctionComponent<{}> = () => (
  <div className={styles.etoOverviewStatus}>
    <div
      className={cn(styles.overviewWrapper, "justify-content-center", "align-items-center")}
      data-test-id="eto-widget-error"
    >
      <FormattedMessage id="shared-component.eto-overview.error.widget" />
    </div>
  </div>
);

const EtoWidget: React.FunctionComponent<TProps> = ({ eto, widgetError }) => (
  <Col xs={12}>
    <div className="mb-3">
      {widgetError ? (
        <EtoWidgetError />
      ) : (
        <EtoOverviewStatus eto={eto} publicView={false} isEmbedded={true} />
      )}
    </div>
  </Col>
);

const EtoWidgetView = compose<TProps, IRouterParams>(
  createErrorBoundary(() => <Col xs={12} />),
  appConnect<IStateProps, {}, IRouterParams>({
    stateToProps: (state, props) => ({
      eto: etoModuleApi.selectors.selectInvestorEtoWithCompanyAndContract(state, props.previewCode),
      widgetError: etoModuleApi.selectors.selectEtoWidgetError(state.eto),
    }),
  }),
  onEnterAction<IRouterParams>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.eto.loadEtoPreview(props.previewCode, true));
    },
  }),
  branch<IStateProps>(props => !props.eto && !props.widgetError, renderComponent(LoadingIndicator)),
)(EtoWidget);

export { EtoWidgetView, EtoWidget };

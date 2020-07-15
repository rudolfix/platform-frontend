import { etoModuleApi, TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { etoWidgetViewLink } from "../../appRouteUtils";

interface IStateProps {
  eto: TEtoWithCompanyAndContractReadonly | undefined;
  widgetError: boolean | undefined;
}

interface IRouterParams {
  previewCode: string;
}

const EmbeddedWidgetLayout: React.FunctionComponent<IStateProps> = ({ eto, widgetError }) => (
  <>
    <h3>Eto widget testing page</h3>
    {eto && eto.previewCode && (
      <iframe width="100%" height={215} src={etoWidgetViewLink(eto.previewCode)} />
    )}

    {widgetError && <iframe width="100%" height={215} src={etoWidgetViewLink("error-id")} />}
  </>
);

const EmbeddedWidget = compose<IStateProps, IRouterParams>(
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
)(EmbeddedWidgetLayout);

export { EmbeddedWidget };

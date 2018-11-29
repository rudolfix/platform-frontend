import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import { selectEtoWithCompanyAndContractById } from "../../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { withParams } from "../../../utils/withParams";
import { appRoutes } from "../../appRoutes";

interface IStateProps {
  eto: TEtoWithCompanyAndContract;
}

interface IRouterParams {
  etoId: string;
}

const TestEmbededWidgetComponent: React.SFC<IStateProps & IRouterParams> = ({ eto }) => {
  return (
    <>
      <h3>This widget testing page</h3>
      {eto &&
        eto.previewCode && (
          <iframe
            width="100%"
            height={215}
            src={withParams(appRoutes.etoWidgetView, { previewCode: eto.previewCode })}
          />
        )}
    </>
  );
};

const TestEmbededWidget = compose<any, any>(
  appConnect<any, any, any>({
    stateToProps: (state, props) => ({
      eto: selectEtoWithCompanyAndContractById(state, props.etoId),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEto(props.etoId));
    },
  }),
)(TestEmbededWidgetComponent);

export { TestEmbededWidget };

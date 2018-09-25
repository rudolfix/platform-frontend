import * as React from "react";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { withContainer } from "../../utils/withContainer";
import { LayoutBase } from "../layouts/LayoutBase";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";
import { selectEtoWithContract } from "../../modules/public-etos/selectors";
import { TEtoWithContract } from "../../modules/public-etos/types";
import { TCompanyEtoData } from "../../lib/api/eto/EtoApi.interfaces";

interface IStateProps {
  eto?: TEtoWithContract;
}

interface IRouterParams {
  previewCode: string;
}

interface IDispatchProps {
  loadEtoPreview: (previewCode: string) => void;
}

type IProps = IStateProps & IDispatchProps & IRouterParams;

class EtoPreviewComponent extends React.Component<IProps> {
  componentDidMount(): void {
    this.props.loadEtoPreview(this.props.previewCode);
  }

  render(): React.ReactNode {
    if (!this.props.eto) {
      return <LoadingIndicator />;
    }

    return (
      <EtoPublicComponent
        companyData={this.props.eto.company as TCompanyEtoData}
        etoData={this.props.eto}
      />
    );
  }
}

export const EtoPreview = compose<React.SFC<IRouterParams>>(
  appConnect<IStateProps, IDispatchProps, IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selectEtoWithContract(state, props.previewCode),
    }),
    dispatchToProps: dispatch => ({
      loadEtoPreview: (previewCode: string) =>
        dispatch(actions.publicEtos.loadEtoPreview(previewCode)),
    }),
  }),
  withContainer(LayoutBase),
)(EtoPreviewComponent);

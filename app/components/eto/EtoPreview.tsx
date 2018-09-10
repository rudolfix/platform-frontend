import * as React from "react";
import { compose } from "redux";

import {
  TCompanyEtoData,
  TEtoSpecsData,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../modules/actions";
import { selectEtoDocumentData } from "../../modules/eto-documents/selectors";
import { appConnect } from "../../store";
import { withContainer } from "../../utils/withContainer";
import { LayoutBase } from "../layouts/LayoutBase";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";

interface IStateProps {
  companyData?: TPartialCompanyEtoData;
  etoData?: TPartialEtoSpecData;
  loading: boolean;
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
    if (this.props.loading || !this.props.companyData || !this.props.etoData) {
      return <LoadingIndicator />;
    }

    return (
      <EtoPublicComponent
        // TODO: type casting needs to be resolved, but EtoPublicComponent required the full data, not the partial type
        companyData={this.props.companyData as TCompanyEtoData}
        etoData={this.props.etoData as TEtoSpecsData}
      />
    );
  }
}

export const EtoPreview = compose<React.SFC<IRouterParams>>(
  appConnect<IStateProps, IDispatchProps, IRouterParams>({
    stateToProps: (state, props) => ({
      companyData: state.eto.previewCompanyData[props.previewCode],
      etoData: state.eto.previewEtoData[props.previewCode],
      loading: state.eto.previewLoading[props.previewCode],
      etoFilesData: selectEtoDocumentData(state.etoDocuments),
    }),
    dispatchToProps: dispatch => ({
      loadEtoPreview: (previewCode: string) =>
        dispatch(actions.eto.loadEtoPreviewStart(previewCode)),
    }),
  }),
  withContainer(LayoutBase),
)(EtoPreviewComponent);

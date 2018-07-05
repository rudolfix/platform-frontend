import * as React from "react";
import { RouteComponentProps } from "react-router";
import Slider, { Settings } from "react-slick";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { LoadingIndicator } from "../shared/LoadingIndicator";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { Accordion, AccordionElement } from "../shared/Accordion";

import { TPartialCompanyEtoData, TPartialEtoSpecData } from "../../lib/api/EtoApi.interfaces";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";

interface IStateProps {
  companyData?: TPartialCompanyEtoData;
  etoData?: TPartialEtoSpecData;
  previewCode: string;
  loading: boolean;
}

interface IDispatchProps {
  loadEtoPreview: (previewCode: string) => void;
}

type IProps = IStateProps & IDispatchProps;

class EtoPreviewComponent extends React.Component<IProps> {
  componentDidMount(): void {
    this.props.loadEtoPreview(this.props.previewCode);
  }

  render(): React.ReactNode {
    if (this.props.loading || !this.props.companyData || !this.props.etoData) {
      return (
        <LayoutAuthorized>
          <LoadingIndicator />
        </LayoutAuthorized>
      );
    }

    return (
      <LayoutAuthorized>
        <EtoPublicComponent companyData={this.props.companyData} etoData={this.props.etoData} />
      </LayoutAuthorized>
    );
  }
}

interface IOwnProps extends RouteComponentProps<{ previewCode: string }> {}

export const EtoPreview = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: (state, connectProps) => ({
      previewCode: connectProps.match.params.previewCode,
      companyData: state.eto.previewCompanyData[connectProps.match.params.previewCode],
      etoData: state.eto.previewEtoData[connectProps.match.params.previewCode],
      loading: state.eto.previewLoading[connectProps.match.params.previewCode],
    }),
    dispatchToProps: dispatch => ({
      loadEtoPreview: (previewCode: string) =>
        dispatch(actions.eto.loadEtoPreviewStart(previewCode)),
    }),
  }),
)(EtoPreviewComponent);

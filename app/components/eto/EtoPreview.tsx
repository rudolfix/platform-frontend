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
    return (
      <LayoutAuthorized>
        <h1> Preview ETO </h1>
        {this.props.loading ? <LoadingIndicator /> : undefined}
        <br />
        <h2>
          Company: {this.props.companyData ? (this.props.companyData as any).name : undefined}
        </h2>
        <h2>ETO Terms: </h2>
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

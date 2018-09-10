import { FormikProps, withFormik } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EtoEquityTokenInfoType,
  TPartialEtoSpecData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button } from "../../../shared/Buttons";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormField } from "../../../shared/forms/forms";
import { EtoFormBase } from "../EtoFormBase";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoSpecData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoSpecData) => void;
}

type IProps = IStateProps & IDispatchProps;

class EtoForm extends React.Component<FormikProps<TPartialEtoSpecData> & IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    return (
      <EtoFormBase
        title={<FormattedMessage id="eto.form.eto-equity-token-info.title" />}
        validator={EtoEquityTokenInfoType.toYup()}
      >
        <FormField
          label={<FormattedMessage id="eto.form.section.equity-token-information.token-name" />}
          placeholder="Token name"
          name="equityTokenName"
        />
        <FormField
          label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
          placeholder="3 - 4 characters"
          maxLength="4"
          name="equityTokenSymbol"
        />
        <div className="form-group">
          <FormLabel>
            <FormattedMessage id="eto.form.section.equity-token-information.token-image" />
          </FormLabel>
          <FormSingleFileUpload
            label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
            name="equityTokenImage"
            acceptedFiles="image/png"
            fileFormatInformation="*200 x 200px png"
          />
        </div>
        <Col>
          <Row className="justify-content-center">
            <Button
              layout="primary"
              type="submit"
              onClick={() => {
                this.props.saveData(this.props.values);
              }}
              isLoading={this.props.savingData}
            >
              <FormattedMessage id="form.button.save" />
            </Button>
          </Row>
        </Col>
      </EtoFormBase>
    );
  }
}

const EtoEnhancedForm = withFormik<IProps, TPartialEtoSpecData>({
  validationSchema: EtoEquityTokenInfoType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoEquityTokenInfoComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoEquityTokenInfo = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: s.etoFlow.etoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialEtoSpecData) => {
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: {},
            etoData: {
              ...data,
            },
          }),
        );
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoEquityTokenInfoComponent);

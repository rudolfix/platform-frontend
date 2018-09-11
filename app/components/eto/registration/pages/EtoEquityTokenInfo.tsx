import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoEquityTokenInfoType,
  TPartialEtoSpecData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/Buttons";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormField } from "../../../shared/forms/forms";
import { EtoFormBase } from "../EtoFormBase";

interface IExternalProps {
  readonly: boolean;
}

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoSpecData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoSpecData) => void;
}

type IProps = IExternalProps & IStateProps & IDispatchProps & FormikProps<TPartialEtoSpecData>;

const EtoEquityTokenInfoComponent: React.SFC<IProps> = ({
  readonly,
  savingData,
  saveData,
  values,
}) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-equity-token-info.title" />}
    validator={EtoEquityTokenInfoType.toYup()}
  >
    <FormField
      label={<FormattedMessage id="eto.form.section.equity-token-information.token-name" />}
      placeholder="Token name"
      name="equityTokenName"
      disabled={readonly}
    />
    <FormField
      label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
      placeholder="3 - 4 characters"
      maxLength="4"
      name="equityTokenSymbol"
      disabled={readonly}
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
        disabled={readonly}
      />
    </div>
    {!readonly && (
      <Col>
        <Row className="justify-content-center">
          <Button
            layout="primary"
            type="submit"
            isLoading={savingData}
            onClick={() => {
              // we need to submit data like this only b/c formik doesnt support calling props.submitForm with invalid form state
              saveData(values);
            }}
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </Row>
      </Col>
    )}
  </EtoFormBase>
);

export const EtoEquityTokenInfo = compose<React.SFC<IExternalProps>>(
  setDisplayName("EtoEquityTokenInfo"),
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
  withFormik<IStateProps & IDispatchProps, TPartialEtoSpecData>({
    validationSchema: EtoEquityTokenInfoType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoEquityTokenInfoComponent);

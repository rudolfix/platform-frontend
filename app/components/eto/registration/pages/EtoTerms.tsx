import { FormikProps, withFormik } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoTermsType, TPartialEtoSpecData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button } from "../../../shared/Buttons";
import { FormCheckbox } from "../../../shared/forms/formField/FormCheckbox";
import {
  FormFieldCheckbox,
  FormFieldCheckboxGroup,
} from "../../../shared/forms/formField/FormFieldCheckboxGroup";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { FormRange } from "../../../shared/forms/formField/FormRange";
import { FormToggle } from "../../../shared/forms/formField/FormToggle";
import { FormField, FormTextArea } from "../../../shared/forms/forms";
import { CURRENCIES } from "../../EtoPublicView";
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

const currencies = ["eur_t", "eth"];

class EtoForm extends React.Component<FormikProps<TPartialEtoSpecData> & IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render (): React.ReactNode {
    return (
      <EtoFormBase
        title={<FormattedMessage id="eto.form.eto-terms.title" />}
        validator={EtoTermsType.toYup()}
      >
        <FormLabel>
          <FormattedMessage id="eto.form.section.eto-terms.fundraising-currency" />
        </FormLabel>
        <div className="form-group">
          <FormFieldCheckboxGroup name="currencies">
            {currencies.map(currency => (
              <FormFieldCheckbox key={currency} label={CURRENCIES[currency]} value={currency} />
            ))}
          </FormFieldCheckboxGroup>
        </div>

        <Row>
          <Col>
            <FormField
              label={<FormattedMessage id="eto.form.section.eto-terms.minimum-ticket-size" />}
              placeholder="1"
              prefix="€"
              name="minTicketEur"
              type="number"
              min="1"
            />
          </Col>
          <Col>
            <FormField
              label={<FormattedMessage id="eto.form.section.eto-terms.maximum-ticket-size" />}
              placeholder="Unlimited"
              prefix="€"
              name="maxTicketEur"
              type="number"
              min="1"
            />
          </Col>
        </Row>

        <div className="form-group">
          <FormCheckbox
            name="notUnderCrowdfundingRegulations"
            label={<FormattedMessage id="eto.form.section.eto-terms.is-crowdfunding" />}
            checked
          />
        </div>


        <div className="form-group">
          <FormLabel>
            <FormattedMessage id="eto.form.section.eto-terms.prospectus-language" />
          </FormLabel>
          <FormToggle
            name="prospectusLanguage"
            trueValue="de"
            falseValue="en"
            disabledLabel={
              <FormattedMessage id="eto.form.section.eto-terms.prospectus-language.disabled-label" />
            }
            enabledLabel={
              <FormattedMessage id="eto.form.section.eto-terms.prospectus-language.enabled-label" />
            }
          />
        </div>

        <div className="form-group">
          <FormLabel>
            <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration" />
          </FormLabel>
          <FormRange
            name="whitelistDurationDays"
            min={1}
            unitMin={
              <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-min" />
            }
            max={14}
            unitMax={
              <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-max" />
            }
          />
        </div>

        <div className="form-group">
          <FormLabel>
            <FormattedMessage id="eto.form.section.eto-terms.public-offer-duration" />
          </FormLabel>
          <FormRange
            name="publicDurationDays"
            min={14}
            unit={<FormattedMessage id="eto.form.section.eto-terms.public-offer-duration.unit" />}
            max={60}
          />
        </div>

        <div className="form-group">
          <FormLabel>
            <FormattedMessage id="eto.form.section.eto-terms.signing-duration" />
          </FormLabel>
          <FormRange
            name="signingDurationDays"
            min={14}
            unit={<FormattedMessage id="eto.form.section.eto-terms.signing-duration.unit" />}
            max={30}
          />
        </div>

        <div className="form-group">
          <FormLabel>
            <FormattedMessage id="eto.form.section.eto-terms.token-tradable" />
          </FormLabel>
          <FormToggle
            name="enableTransferOnSuccess"
            disabledLabel={ <FormattedMessage id="form.select.asap" /> }
            enabledLabel={ <FormattedMessage id="eto.form.eto-terms.future-date" /> }
          />
        </div>

        <FormTextArea
          className="mb-2 mt-2"
          label={<FormattedMessage id="eto.form.other"/>}
          name="additionalTerms"
        />

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
  validationSchema: EtoTermsType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoRegistrationTermsComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationTerms = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: s.etoFlow.etoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialEtoSpecData) => {
        data.notUnderCrowdfundingRegulations = true; // Temporary solution - overrides checked value
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
    actionCreator: _dispatch => { },
  }),
)(EtoRegistrationTermsComponent);

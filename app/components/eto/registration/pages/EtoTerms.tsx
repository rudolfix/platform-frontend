import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import {
  BOOL_FALSE_KEY,
  BOOL_TRUE_KEY,
  FormField,
  FormSelectField,
  FormTextArea,
  NONE_KEY,
} from "../../../shared/forms/forms";

import { EtoTermsType, TPartialEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { FormCheckbox, FormRadioButton } from "../../../shared/forms/formField/FormCheckbox";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { FormRange } from "../../../shared/forms/formField/FormRange";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormSection } from "../../../shared/forms/FormSection";
import { Toggle } from "../../../shared/Toggle";
import { EtoFormBase } from "../EtoFormBase";

// @todo
type IEtoData = any;

const TOKEN_HOLDERS_RIGHTS = {
  [NONE_KEY]: "please select",
  [BOOL_TRUE_KEY]: "1",
  [BOOL_FALSE_KEY]: "2",
};

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoData> & IProps) => (
    <EtoFormBase title={<FormattedMessage id="eto.form.eto-terms.title"/>} validator={EtoTermsType.toYup()}>
      <FormSection title={<FormattedMessage id="eto.form.section.equity-token-information.title" />}>
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-name" />}
        placeholder="Token name"
        name="tokenName"
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
        placeholder="3 - 4 characters"
        name="tokenSymbol"
      />
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.equity-token-information.token-image" />
        </FormLabel>
        <FormSingleFileUpload
          label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
          name="tokenImage"
          acceptedFiles="image/*"
          fileFormatInformation="*200 x 150px png"
        />
      </div>
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.tokens-per-share" />}
        placeholder="1000000"
        name="tokensPerShare"
        disabled
      />
    </FormSection>

    <FormSection title={<FormattedMessage id="eto.form.section.investment-terms.title" />}>
      <FormField
        label={
          <FormattedMessage id="eto.form.section.investment-terms.fully-diluted-pre-money-valuation" />
        }
        placeholder=" "
        prefix="€"
        name="fullyDilutedPreMoneyValuation"
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.investment-terms.existing-shares" />}
        placeholder="Number of existing shares"
        name="numberOfExistingShares"
      />
      <FormField
        label={
          <FormattedMessage id="eto.form.section.investment-terms.minimum-new-shares-to-issue" />
        }
        placeholder="Number of share"
        name="numberOfShares"
      />
      <FormHighlightGroup>
        <FormField
          label={<FormattedMessage id="eto.form.section.investment-terms.new-share-price" />}
          placeholder="1/1000000 of share price auto complete"
          name="newSharePrice"
          disabled
        />
        <Row>
          <Col sm={12} md={6} className="mb-4">
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.minimum-amount" />}
              prefix="€"
              placeholder="read only"
              name="minimumAmount"
              disabled
            />
          </Col>
          <Col sm={12} md={6} className="mb-4">
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.maximum-amount" />}
              prefix="€"
              placeholder="read only"
              name="maximumAmount"
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.minimum-token-cap" />}
              prefix="€"
              placeholder="read only"
              name="minimumTokenCap"
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.maximum-token-cap" />}
              prefix="€"
              placeholder="read only"
              name="maximumTokenCap"
              disabled
            />
          </Col>
        </Row>
      </FormHighlightGroup>
      <FormTextArea
        name="tokenDiscountForWhitelist"
        label={
          <FormattedMessage id="eto.form.section.investment-terms.token-discount-for-whitelisted" />
        }
        placeholder=" "
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.investment-terms.share-nominal-value" />}
        placeholder="1"
        prefix="€"
        name="shareNominalValue"
      />
    </FormSection>

    <FormSection title={<FormattedMessage id="eto.form.section.eto-terms.title" />}>
      <FormLabel>
        <FormattedMessage id="eto.form.section.eto-terms.fundraising-currency" />
      </FormLabel>
      <div className="form-group">
        <FormRadioButton value="nEuro" name="fundraisingCurrency" label="nEuro" />
        <FormRadioButton value="ETH" name="fundraisingCurrency" label="ETH" />
      </div>
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.eto-terms.prospectus-language" />
        </FormLabel>
        <Toggle
          disabledLabel={
            <FormattedMessage id="eto.form.section.eto-terms.prospectus-language.disabled-label" />
          }
          enabledLabel={
            <FormattedMessage id="eto.form.section.eto-terms.prospectus-language.enabled-label" />
          }
          onClick={() => {}}
        />
      </div>
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration" />
        </FormLabel>
        <FormRange
          name="preSaleDuration"
          min={1}
          unitMin={<FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-min" />}
          max={14}
          unitMax={<FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-max" />}
        />
      </div>
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.eto-terms.public-offer-duration" />
        </FormLabel>
        <FormRange
          name="publicOfferDuration"
          min={0}
          unit={
            <FormattedMessage id="eto.form.section.eto-terms.public-offer-duration-duration.unit" />
          }
          max={8}
        />
      </div>
      <FormField
        label={<FormattedMessage id="eto.form.section.eto-terms.minimum-ticket-size" />}
        placeholder="1"
        prefix="€"
        name="minimumTicketSize"
      />
      <div className="form-group">
        <FormCheckbox
          name="tokenTransfersEnabledAfterEto"
          label={
            <FormattedMessage id="eto.form.section.eto-terms.token-transfers-enabled-after-eto" />
          }
        />
      </div>
      <div className="form-group">
        <FormCheckbox
          name="etoIsNotUnderCrowdfundingRegulation"
          label={<FormattedMessage id="eto.form.section.eto-terms.eto-is-under-regulation" />}
        />
      </div>
    </FormSection>

    <FormSection title={<FormattedMessage id="eto.form.section.token-holders-rights.title" />}>
      <FormSelectField
        values={TOKEN_HOLDERS_RIGHTS}
        label={
          <FormattedMessage id="eto.form.section.token-holders-rights.third-party-dependency" />
        }
        name="hasDependencyOnThirdParties"
      />
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.token-holders-rights.liquidation-preference" />
        </FormLabel>
        <FormRange name="liquidationPreference" min={0} unit="%" max={200} />
      </div>
      <div className="form-group">
        <FormCheckbox
          name="hasVotingRightsEnabled"
          label={
            <FormattedMessage id="eto.form.section.token-holders-rights.voting-rights-enabled" />
          }
        />
      </div>
    </FormSection>
  </EtoFormBase>
);

const EtoEnhancedForm = withFormik<IProps, TPartialEtoData>({
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
      stateValues: s.etoFlow.data,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: any) => {
        dispatch(actions.etoFlow.saveDataStart(data));
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationTermsComponent);

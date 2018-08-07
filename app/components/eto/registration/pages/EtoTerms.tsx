import { FormikProps, withFormik } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import {
  BOOL_TRUE_KEY,
  FormField,
  FormSelectField,
  FormTextArea,
} from "../../../shared/forms/forms";

import { EtoTermsType, TPartialEtoSpecData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { Button } from "../../../shared/Buttons";
import { FormCheckbox } from "../../../shared/forms/formField/FormCheckbox";
import {
  FormFieldCheckbox,
  FormFieldCheckboxGroup,
} from "../../../shared/forms/formField/FormFieldCheckboxGroup";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { FormRange } from "../../../shared/forms/formField/FormRange";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormToggle } from "../../../shared/forms/formField/FormToggle";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormSection } from "../../../shared/forms/FormSection";
import { CURRENCIES } from "../../EtoPublicView";
import { EtoFormBase } from "../EtoFormBase";

const TOKEN_HOLDERS_RIGHTS = {
  [BOOL_TRUE_KEY]: "Neumini UG",
};

const GENERAL_VOTING_RULE = {
  positive: <FormattedMessage id="form.select.yes" />,
  no_voting_rights: <FormattedMessage id="form.select.no" />,
};

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoSpecData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoSpecData) => void;
}

type IProps = IStateProps & IDispatchProps;

const currencies = ["eth", "eur_t"];

class EtoForm extends React.Component<FormikProps<TPartialEtoSpecData> & IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { stateValues } = this.props;
    const fullyDilutedPreMoneyValuationEur = stateValues.fullyDilutedPreMoneyValuationEur || 1;
    const existingCompanyShares = stateValues.existingCompanyShares || 1;
    const newSharesToIssue = stateValues.newSharesToIssue || 1;
    const equityTokensPerShare = stateValues.equityTokensPerShare || 1;
    const minimumNewSharesToIssue = stateValues.minimumNewSharesToIssue || 1;

    const computedNewSharePrice = fullyDilutedPreMoneyValuationEur / existingCompanyShares;
    const computedMinNumberOfTokens = newSharesToIssue * equityTokensPerShare;
    const computedMaxNumberOfTokens = minimumNewSharesToIssue * equityTokensPerShare;
    const computedMinCapEur = computedNewSharePrice * newSharesToIssue;
    const computedMaxCapEur = computedNewSharePrice * minimumNewSharesToIssue;

    return (
      <EtoFormBase
        title={<FormattedMessage id="eto.form.eto-terms.title" />}
        validator={EtoTermsType.toYup()}
      >
        <FormSection
          title={<FormattedMessage id="eto.form.section.equity-token-information.title" />}
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
            pattern=".{3,4}"
            name="equityTokenSymbol"
          />
          <div className="form-group">
            <FormLabel>
              <FormattedMessage id="eto.form.section.equity-token-information.token-image" />
            </FormLabel>
            <FormSingleFileUpload
              label={
                <FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />
              }
              name="equityTokenImage"
              acceptedFiles="image/png"
              fileFormatInformation="*200 x 200px png"
            />
          </div>
          <FormField
            label={
              <FormattedMessage id="eto.form.section.equity-token-information.tokens-per-share" />
            }
            placeholder="1000000"
            name="equityTokensPerShare"
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
            name="fullyDilutedPreMoneyValuationEur"
            type="number"
            min="1"
          />
          <FormField
            label={<FormattedMessage id="eto.form.section.investment-terms.existing-shares" />}
            placeholder="Number of existing shares"
            name="existingCompanyShares"
            type="number"
            min="1"
          />
          <FormField
            label={
              <FormattedMessage id="eto.form.section.investment-terms.minimum-new-shares-to-issue" />
            }
            placeholder="Number of share"
            name="minimumNewSharesToIssue"
            type="number"
            min="1"
          />
          <FormField
            label={
              <FormattedMessage id="eto.form.section.investment-terms.maximum-new-shares-to-issue" />
            }
            placeholder="Number of share"
            name="newSharesToIssue"
            type="number"
            min="1"
          />

          <FormHighlightGroup>
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.new-share-price" />}
              placeholder="1/1000000 of share price auto complete"
              name="newSharePrice"
              value={computedNewSharePrice}
              disabled
            />
            <Row>
              <Col sm={12} md={6} className="mb-4">
                <FormField
                  label={<FormattedMessage id="eto.form.section.investment-terms.minimum-amount" />}
                  placeholder="read only"
                  name="minNumberOfTokens"
                  value={computedMinNumberOfTokens}
                  disabled
                />
              </Col>
              <Col sm={12} md={6} className="mb-4">
                <FormField
                  label={<FormattedMessage id="eto.form.section.investment-terms.maximum-amount" />}
                  prefix="€"
                  placeholder="read only"
                  name="maxNumberOfTokens"
                  value={computedMaxNumberOfTokens}
                  disabled
                />
              </Col>
              <Col sm={12} md={6}>
                <FormField
                  label={
                    <FormattedMessage id="eto.form.section.investment-terms.minimum-token-cap" />
                  }
                  prefix="€"
                  placeholder="read only"
                  name="minCapEur"
                  value={computedMinCapEur}
                  disabled
                />
              </Col>
              <Col sm={12} md={6}>
                <FormField
                  label={
                    <FormattedMessage id="eto.form.section.investment-terms.maximum-token-cap" />
                  }
                  prefix="€"
                  placeholder="read only"
                  name="maxCapEur"
                  value={computedMaxCapEur}
                  disabled
                />
              </Col>
            </Row>
          </FormHighlightGroup>

          <FormTextArea
            name="discountScheme"
            label={
              <FormattedMessage id="eto.form.section.investment-terms.token-discount-for-whitelisted" />
            }
            placeholder=" "
            charactersLimit={250}
          />
          <FormField
            label={<FormattedMessage id="eto.form.section.investment-terms.share-nominal-value" />}
            placeholder="1"
            prefix="€"
            name="shareNominalValueEur"
            type="number"
            min="1"
          />
        </FormSection>

        <FormSection title={<FormattedMessage id="eto.form.section.eto-terms.title" />}>
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
              min={0}
              unit={<FormattedMessage id="eto.form.section.eto-terms.public-offer-duration.unit" />}
              max={14}
            />
          </div>

          <div className="form-group">
            <FormLabel>
              <FormattedMessage id="eto.form.section.eto-terms.signing-duration" />
            </FormLabel>
            <FormRange
              name="signingDurationDays"
              min={0}
              unit={<FormattedMessage id="eto.form.section.eto-terms.signing-duration.unit" />}
              max={30}
            />
          </div>

          <FormField
            label={<FormattedMessage id="eto.form.section.eto-terms.minimum-ticket-size" />}
            placeholder="1"
            prefix="€"
            name="minTicketEur"
            type="number"
            min="1"
          />

          <FormField
            label={<FormattedMessage id="eto.form.section.eto-terms.maximum-ticket-size" />}
            placeholder="1"
            prefix="€"
            name="maxTicketEur"
            type="number"
            min="1"
          />

          <div className="form-group">
            <FormCheckbox
              name="isCrowdfunding"
              label={<FormattedMessage id="eto.form.section.eto-terms.is-crowdfunding" />}
              checked
            />
          </div>

          <div className="form-group">
            <FormCheckbox
              name="enableTransferOnSuccess"
              label={
                <FormattedMessage id="eto.form.section.eto-terms.token-transfers-enabled-after-eto" />
              }
            />
          </div>
        </FormSection>

        <FormSection
          title={<FormattedMessage id="eto.form.section.token-holder-representative.title" />}
        >
          <FormSelectField
            values={TOKEN_HOLDERS_RIGHTS}
            label={
              <FormattedMessage id="eto.form.section.token-holders-rights.third-party-dependency" />
            }
            name="nominee"
          />
          <div className="form-group">
            <FormLabel>
              <FormattedMessage id="eto.form.section.token-holders-rights.liquidation-preference" />
            </FormLabel>
            <FormRange name="liquidationPreferenceMultiplier" min={0} unit="x" max={2} step={0.5} />
          </div>

          <FormSelectField
            values={GENERAL_VOTING_RULE}
            label={
              <FormattedMessage id="eto.form.section.token-holders-rights.general-voting-rule" />
            }
            name="generalVotingRule"
          />
        </FormSection>
        <Col>
          <Row className="justify-content-end">
            <Button
              layout="primary"
              className="mr-4"
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
        data.isCrowdfunding = false; // Temporary solution - overrides checked value
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
)(EtoRegistrationTermsComponent);

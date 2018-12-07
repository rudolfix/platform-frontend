import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

export const getDocumentTitles = (isRetailEto: boolean) => ({
  company_token_holder_agreement: <FormattedMessage id="eto.documents.tokenholder-agreement" />,
  reservation_and_acquisition_agreement: (
    <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement" />
  ),
  investment_and_shareholder_agreement_template: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />
  ),
  pamphlet_template: <FormattedMessage id="eto.documents.pamphlet_template" />,
  prospectus_template: <FormattedMessage id="eto.documents.prospectus-template" />,
  termsheet_template: <FormattedMessage id="eto.documents.termsheet-template" />,
  investment_memorandum_template: (
    <FormattedMessage id="eto.documents.investment-memorandum-template" />
  ),
  // in document collection
  investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement" />
  ),
  signed_investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement" />
  ),
  approved_investor_offering_document: isRetailEto ? (
    <FormattedMessage id="eto.documents.approved-investor-prospectus-document" />
  ) : (
    <FormattedMessage id="eto.documents.approved-investment-memorandum-document" />
  ),
  signed_termsheet: <FormattedMessage id="eto.documents.signed-termsheet" />,
});

export const getDocumentTemplateTitles = (isRetailEto: boolean) => ({
  company_token_holder_agreement: (
    <FormattedMessage id="eto.documents.tokenholder-agreement-template" />
  ),
  reservation_and_acquisition_agreement: (
    <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement-template" />
  ),
  investment_and_shareholder_agreement_template: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement-template" />
  ),
  pamphlet_template: <FormattedMessage id="eto.documents.pamphlet_template" />,
  prospectus_template: <FormattedMessage id="eto.documents.prospectus-template" />,
  termsheet_template: <FormattedMessage id="eto.documents.termsheet-template" />,
  investment_memorandum_template: (
    <FormattedMessage id="eto.documents.investment-memorandum-template" />
  ),
  // in document collection
  investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement-template" />
  ),
  approved_investor_offering_document: isRetailEto ? (
    <FormattedMessage id="eto.documents.investor-prospectus-document-template" />
  ) : (
    <FormattedMessage id="eto.documents.investment-memorandum-document-template" />
  ),
  signed_termsheet: null,
  signed_investment_and_shareholder_agreement: null,
});

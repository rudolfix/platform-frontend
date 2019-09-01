import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { DashboardHeading } from "../../eto/shared/DashboardHeading";
import { Container, EColumnSpan } from "../../layouts/Container";
import { EEtoStep } from "../utils";
import { LinkNomineeStep } from "./LinkNomineeStep";

interface IEtoStep {
  etoStep: EEtoStep;
}

const selectStepComponent = (props: IEtoStep) => {
  switch (props.etoStep) {
    case EEtoStep.VERIFICATION:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.verification" />}
          data-test-id="eto-dashboard-verification"
        />
      );
    case EEtoStep.FILL_INFORMATION_ABOUT_COMPANY:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.company-informations" />}
          data-test-id="eto-dashboard-company-informations"
        />
      );
    case EEtoStep.PUBLISH_LISTING_PAGE:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.publish-listing" />}
          data-test-id="eto-dashboard-publish-listing"
        />
      );
    case EEtoStep.LINK_NOMINEE:
      return <LinkNomineeStep />;
    case EEtoStep.LISTING_PAGE_IN_REVIEW:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.listing-review" />}
            data-test-id="eto-dashboard-listing-review"
          />
          <FormattedMessage id="eto-dashboard.listing-review.description" />
        </>
      );
    case EEtoStep.UPLOAD_SIGNED_TERMSHEET:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.setup-eto" />}
            data-test-id="eto-dashboard-setup-eto"
          />
          <FormattedMessage id="eto-dashboard.setup-eto.description" />
        </>
      );
    case EEtoStep.PUBLISH_INVESTMENT_OFFER:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.publish" />}
          data-test-id="eto-dashboard-publish"
        />
      );
    case EEtoStep.SEVEN:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.review" />}
            data-test-id="eto-dashboard-review"
          />
          <FormattedMessage id="eto-dashboard.review.description" />
        </>
      );
    case EEtoStep.EIGHT:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.live" />}
          data-test-id="eto-dashboard-live"
        />
      );
    case EEtoStep.NINE:
      return <DashboardHeading title={<FormattedMessage id="eto-dashboard.start-fundraising" />} />;
    default:
      return null;
  }
};

const DashboardStep: React.FunctionComponent<IEtoStep> = props => (
  <Container columnSpan={EColumnSpan.ONE_AND_HALF_COL}>{selectStepComponent(props)}</Container>
);

export { DashboardStep };

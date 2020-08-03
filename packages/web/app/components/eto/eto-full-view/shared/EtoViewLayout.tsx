import { EtoCompanyInformationType, EtoPitchType } from "@neufund/shared-modules";
import * as React from "react";

import { TEtoViewData } from "../../../../modules/eto-view/shared/types";
import { WidgetGrid } from "../../../layouts/WidgetGrid";
import { PersonProfileModal } from "../../../modals/person-profile-modal/PersonProfileModal";
import { FieldSchemaProvider } from "../../../shared/Field";
import { EtoOverviewStatus } from "../../overview/EtoOverviewStatus/EtoOverviewStatus";
import { CampaignOverview } from "../shared/campaign-overview/CampaignOverview";
import { Cover } from "../shared/cover/Cover";

import * as styles from "../shared/EtoView.module.scss";

const EtoViewSchema = EtoCompanyInformationType.toYup().concat(EtoPitchType.toYup());

const EtoViewLayout: React.FunctionComponent<TEtoViewData & { publicView: boolean }> = ({
  children,
  eto,
  userIsFullyVerified,
  campaignOverviewData,
  publicView, //TODO this is for backwards compatibility, should go after component refactoring
}) => {
  const { categories, brandName, companyOneliner, companyLogo, companyBanner } = eto.company;

  return (
    <FieldSchemaProvider value={EtoViewSchema}>
      <PersonProfileModal />
      <WidgetGrid className={styles.etoLayout} data-test-id="eto.public-view">
        {children}
        <Cover
          companyName={brandName}
          companyOneliner={companyOneliner}
          companyJurisdiction={eto.product.jurisdiction}
          companyLogo={
            companyLogo
              ? {
                  alt: brandName,
                  srcSet: {
                    "1x": companyLogo,
                  },
                }
              : undefined
          }
          companyBanner={{
            alt: brandName,
            srcSet: {
              "1x": companyBanner as string,
            },
          }}
          tags={categories}
        />
        <EtoOverviewStatus eto={eto} publicView={publicView} isEmbedded={false} />
        <CampaignOverview
          eto={eto}
          userIsFullyVerified={userIsFullyVerified}
          campaignOverviewData={campaignOverviewData}
        />
      </WidgetGrid>
    </FieldSchemaProvider>
  );
};

export { EtoViewLayout };

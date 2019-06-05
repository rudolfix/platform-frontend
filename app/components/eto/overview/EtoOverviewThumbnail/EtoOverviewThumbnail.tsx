import { push } from "connected-react-router";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { EEtoSubState, TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import { appConnect } from "../../../../store";
import { CommonHtmlProps } from "../../../../types";
import { etoPublicViewLink } from "../../../appRouteUtils";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { FUNDING_ROUNDS } from "../../constants";
import { ETOState } from "../../shared/ETOState";
import { Cover } from "./Cover";
import { EtoCardPanelButton } from "./EtoCardPanel";
import { EtoStatusManager } from "./EtoStatusManager";

import * as styles from "./EtoOverviewThumbnail.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

interface IDispatchProps {
  navigateToEto: () => void;
}

interface IWithProps {
  showQuote: boolean;
}

const defaultEmpty = "-";

const EtoOverviewStatusLayout: React.FunctionComponent<
  IExternalProps & CommonHtmlProps & IDispatchProps & IWithProps
> = ({ eto, navigateToEto }) => (
  <EtoCardPanelButton data-test-id={`eto-overview-${eto.etoId}`} onClick={navigateToEto}>
    <Cover
      className={styles.cover}
      companyBanner={{
        alt: eto.company.brandName,
        srcSet: {
          "1x": eto.company.companyPreviewCardBanner,
        },
      }}
      tags={eto.company.categories}
      jurisdiction={eto.product.jurisdiction}
    />

    <ETOState className={styles.statusOfEto} eto={eto} />

    <section className={styles.content}>
      <Heading titleClassName="text-truncate" decorator={false} level={2} size={EHeadingSize.HUGE}>
        {eto.company.brandName}
      </Heading>

      {eto.subState === EEtoSubState.COMING_SOON ? (
        <p data-test-id="eto-overview-status-founders-quote" className={styles.quote}>
          {eto.company.keyQuoteFounder}
        </p>
      ) : (
        <>
          <div className={styles.groupWrapper}>
            <div className={styles.group}>
              <span className={styles.label}>
                <FormattedMessage id="eto-overview-thumbnail.token-name" />
              </span>
              <span className={styles.value}>
                {eto.equityTokenName} ({eto.equityTokenSymbol})
              </span>
            </div>

            <div className={styles.group}>
              <span className={styles.label}>
                <FormattedMessage id="eto-overview-thumbnail.funding-round" />
              </span>
              <span className={styles.value}>
                {eto.company.companyStage ? FUNDING_ROUNDS[eto.company.companyStage] : defaultEmpty}
              </span>
            </div>

            <div className={styles.group}>
              <span className={styles.label}>
                <FormattedMessage id="eto-overview-thumbnail.headquarters" />
              </span>
              <span className={styles.value}>{eto.company.city || defaultEmpty}</span>
            </div>
          </div>

          <EtoStatusManager eto={eto} />
        </>
      )}
    </section>
  </EtoCardPanelButton>
);

const EtoOverviewThumbnail = compose<
  IExternalProps & CommonHtmlProps & IDispatchProps & IWithProps,
  IExternalProps & CommonHtmlProps
>(
  appConnect<{}, IDispatchProps, IExternalProps>({
    dispatchToProps: (dispatch, { eto }) => ({
      navigateToEto: () =>
        dispatch(push(etoPublicViewLink(eto.previewCode, eto.product.jurisdiction))),
    }),
  }),
)(EtoOverviewStatusLayout);

export { EtoOverviewStatusLayout, EtoOverviewThumbnail };

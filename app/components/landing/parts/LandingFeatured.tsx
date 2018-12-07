import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl";

import { externalRoutes } from "../../../config/externalRoutes";
import { appRoutes } from "../../appRoutes";
import { EtoWidgetView } from "../../eto/EtoWidgetView";
import { ButtonLink, ButtonSize, EButtonLayout } from "../../shared/buttons";
import { ENeonHeaderSize, NeonHeader } from "../shared/NeonHeader";

import * as styles from "./LandingFeatured.module.scss";

const LandingFeatured: React.SFC = () => (
  <section className={styles.landingFeaturedWrapper}>
    <NeonHeader size={ENeonHeaderSize.BIG}>
      <FormattedHTMLMessage id="platform.landing.featured.header" tagName="span" />
    </NeonHeader>
    <p className={styles.landingFeaturedDescription}>
      <FormattedHTMLMessage
        values={{ href: externalRoutes.issueEto }}
        id="platform.landing.featured.description"
        tagName="span"
      />
    </p>
    <section className={cn(styles.landingFeaturesContainer, "pure")}>
      <h3 className={cn(styles.landingFeaturesHeader)}>
        <FormattedMessage id="platform.landing.list.header" />
      </h3>
      <ul className={styles.landingFeatures}>
        <li>
          <FormattedMessage id="platform.landing.list.first" />
        </li>
        <li>
          <FormattedMessage id="platform.landing.list.second" />
        </li>
        <li>
          <FormattedMessage id="platform.landing.list.third" />
        </li>
        <li>
          <FormattedMessage id="platform.landing.list.fourth" />
        </li>
        <li>
          <FormattedMessage id="platform.landing.list.fifth" />
        </li>
      </ul>
      <div className="my-5">
        <span className="mr-5">
          <ButtonLink
            theme="neon"
            layout={EButtonLayout.SECONDARY}
            size={ButtonSize.HUGE}
            to={appRoutes.register}
          >
            <FormattedMessage id="wallet-selector.register" />
          </ButtonLink>
        </span>
        <ButtonLink
          size={ButtonSize.HUGE}
          theme="graphite"
          layout={EButtonLayout.PRIMARY}
          to={appRoutes.login}
        >
          <FormattedMessage id="wallet-selector.login" />
        </ButtonLink>
      </div>
      {process.env.NF_FEATURED_ETO_PREVIEW_CODE && (
        <EtoWidgetView previewCode={process.env.NF_FEATURED_ETO_PREVIEW_CODE} />
      )}
    </section>
  </section>
);

export { LandingFeatured };

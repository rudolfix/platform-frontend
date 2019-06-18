import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { externalRoutes } from "../../config/externalRoutes";
import { etoMockCompanies } from "../../data/etoCompanies";
import { withContainer } from "../../utils/withContainer.unsafe";
import { appRoutes } from "../appRoutes";
import { EtoList } from "../dashboard/eto-list/EtoList";
import { Container, EColumnSpan, EContainerType } from "../layouts/Container";
import { Content } from "../layouts/Content";
import { WidgetGridLayout } from "../layouts/Layout";
import { LayoutUnauthorized } from "../layouts/LayoutUnauthorized";
import {
  ButtonGroup,
  ButtonLink,
  ButtonSize,
  EButtonLayout,
  EButtonTheme,
  EIconPosition,
} from "../shared/buttons";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutUnauthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutUnauthorized";

import * as arrowRight from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./Landing.module.scss";

const LandingLayout: React.FunctionComponent = () => (
  <div className={styles.landingWrapper} data-test-id="landing-page">
    <section className={styles.landing}>
      <div className={styles.neon} />

      <WidgetGridLayout>
        <Container columnSpan={EColumnSpan.ONE_AND_HALF_COL} type={EContainerType.GRID}>
          <h1 className={styles.header}>
            <FormattedMessage id="platform.landing.featured.header" />
          </h1>
          <p className={styles.description}>
            <FormattedMessage id="platform.landing.featured.description" />
          </p>
        </Container>

        <Container
          className={styles.featuresContainer}
          columnSpan={EColumnSpan.ONE_AND_HALF_COL}
          type={EContainerType.GRID}
        >
          <ul className={cn(styles.features, "pure")}>
            <li className={cn(styles.featuresItem, styles.featuresItemInvest)}>
              <FormattedMessage id="platform.landing.list.first" />
            </li>
            <li className={cn(styles.featuresItem, styles.featuresItemMinTicket)}>
              <FormattedMessage id="platform.landing.list.second" />
            </li>
            <li className={cn(styles.featuresItem, styles.featuresItemTradable)}>
              <FormattedMessage id="platform.landing.list.third" />
            </li>
          </ul>
        </Container>
      </WidgetGridLayout>
    </section>

    <Content>
      <section className={styles.investmentOpportunities}>
        <h2 className={cn(styles.investmentOpportunitiesHeader)}>Investment opportunities</h2>

        <EtoList mockedEtos={etoMockCompanies} shouldOpenInNewWindow={true} />

        <ButtonGroup className={styles.investmentOpportunitiesCallToAction}>
          <ButtonLink
            theme={EButtonTheme.NEON}
            layout={EButtonLayout.SECONDARY}
            size={ButtonSize.HUGE}
            to={appRoutes.register}
          >
            <FormattedMessage id="wallet-selector.register" />
          </ButtonLink>
          <ButtonLink
            iconPosition={EIconPosition.ICON_AFTER}
            layout={EButtonLayout.SECONDARY}
            size={ButtonSize.HUGE}
            svgIcon={arrowRight}
            target={"_blank"}
            theme={EButtonTheme.SILVER}
            to={externalRoutes.neufundInvest}
          >
            <FormattedMessage id="common.text.read-more" />
          </ButtonLink>
        </ButtonGroup>
      </section>
    </Content>
  </div>
);

const Landing = compose(
  createErrorBoundary(ErrorBoundaryLayoutUnauthorized),
  withContainer(LayoutUnauthorized),
)(LandingLayout);

export { Landing };

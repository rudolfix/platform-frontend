import { EButtonLayout, EButtonSize } from "@neufund/design-system";
import { withContainer } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { externalRoutes } from "../../config/externalRoutes";
import { etoMockCompanies } from "../../data/etoCompanies";
import { appRoutes } from "../appRoutes";
import { EtoList } from "../dashboard/eto-list/EtoList";
import { Container, EColumnSpan, EContainerType } from "../layouts/Container";
import { Content, EContentWidth } from "../layouts/Content";
import { Layout } from "../layouts/Layout";
import { WidgetGrid } from "../layouts/WidgetGrid";
import { ButtonLink } from "../shared/buttons/ButtonLink";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";

import fish from "../../assets/img/neufund_landing_visual.png";
import * as styles from "./Landing.module.scss";

const LandingLayout: React.FunctionComponent = () => (
  <section className={styles.landing} data-test-id="landing-page">
    <Content>
      <WidgetGrid>
        <Container columnSpan={EColumnSpan.ONE_AND_HALF_COL} type={EContainerType.GRID}>
          <div className={styles.neon} />
          <h1 className={styles.header}>
            <FormattedMessage id="platform.landing.featured.header" />
          </h1>
          <p className={styles.description}>
            <FormattedMessage id="platform.landing.description" />
          </p>

          <div className={styles.buttonGroup}>
            <ButtonLink
              layout={EButtonLayout.PRIMARY}
              size={EButtonSize.NORMAL}
              to={externalRoutes.neufundBlogChangeIsComing}
              className={styles.button}
            >
              <FormattedMessage id="common.text.read-more" />
            </ButtonLink>
            <ButtonLink
              layout={EButtonLayout.SECONDARY}
              size={EButtonSize.NORMAL}
              to={appRoutes.register}
            >
              <FormattedMessage id="wallet-selector.register" />
            </ButtonLink>
          </div>
        </Container>

        <Container
          className={styles.image}
          columnSpan={EColumnSpan.ONE_AND_HALF_COL}
          type={EContainerType.GRID}
        >
          <img src={fish} alt="" />
        </Container>
      </WidgetGrid>

      <section className={styles.investmentOpportunities}>
        <EtoList mockedEtos={etoMockCompanies} shouldOpenInNewWindow={true} />
      </section>
    </Content>
  </section>
);

const Landing = compose(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(
    withProps<React.ComponentProps<typeof Layout>, {}>({
      width: EContentWidth.FULL,
    })(Layout),
  ),
)(LandingLayout);

export { Landing };

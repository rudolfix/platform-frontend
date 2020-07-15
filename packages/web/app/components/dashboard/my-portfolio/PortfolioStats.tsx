import { Button, EButtonLayout, EButtonWidth, Eur, TokenIcon } from "@neufund/design-system";
import {
  etoModuleApi,
  investorPortfolioModuleApi,
  TETOWithTokenData,
} from "@neufund/shared-modules";
import {
  convertFromUlps,
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  multiplyBigNumbers,
  nonNullable,
  OmitKeys,
} from "@neufund/shared-utils";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../modules/actions";
import { selectIsVerifiedInvestor } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { DataRowSeparated } from "../../shared/DataRow";
import { withContainer } from "../../shared/hocs/withContainer";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget/MoneySuiteWidget";
import { ESize } from "../../shared/transaction/TransactionData";
import { WarningAlert } from "../../shared/WarningAlert";

import * as styles from "./PortfolioStats.module.scss";

type TStateProps = {
  myAssets: TETOWithTokenData[] | undefined;
  myAssetsEurEquivTotal: string | undefined;
  hasError: boolean;
  isVerifiedInvestor: boolean;
  isLoading: boolean;
};

type TDispatchProps = {
  goToPortfolio: () => void;
  goToProfile: () => void;
};

type TPortfolioStatsProps = TStateProps & TDispatchProps;

const PortfolioStatsLayoutContainer: React.FunctionComponent<Pick<
  TStateProps,
  "myAssetsEurEquivTotal"
>> = ({ children, myAssetsEurEquivTotal }) => (
  <section data-test-id="dashboard.portfolio-stats" className={styles.container}>
    <DataRowSeparated
      className={styles.header}
      caption={
        <h4 className={styles.title}>
          <FormattedMessage id="dashboard.portfolio-stats.title" />
        </h4>
      }
      value={myAssetsEurEquivTotal && <Eur value={myAssetsEurEquivTotal} />}
    />
    {children}
  </section>
);

const PortfolioStatsErrorLayout: React.FunctionComponent = () => (
  <WarningAlert className="m-auto" data-test-id="portfolio-stats-error">
    <FormattedMessage id="common.error" values={{ separator: <br /> }} />
  </WarningAlert>
);

const PortfolioStatsNoAssetsLayout: React.FunctionComponent<Pick<
  TDispatchProps,
  "goToPortfolio"
>> = ({ goToPortfolio }) => (
  <>
    <p className={styles.noAssets} data-test-id="dashboard.portfolio-stats.no-assets">
      <FormattedMessage id="dashboard.portfolio-stats.no-assets" />
    </p>
    <Button
      className={styles.button}
      layout={EButtonLayout.PRIMARY}
      width={EButtonWidth.NORMAL}
      onClick={goToPortfolio}
    >
      <FormattedMessage id="dashboard.portfolio-stats.view-portfolio" />
    </Button>
  </>
);

const PortfolioStatsLayout: React.FunctionComponent<OmitKeys<
  TPortfolioStatsProps,
  "hasError" | "isLoading"
>> = ({ myAssets, goToPortfolio }) => {
  const assets = nonNullable(myAssets);

  return (
    <>
      {assets.slice(0, 3).map(eto => (
        <DataRowSeparated
          key={eto.equityTokenName}
          className={styles.row}
          data-test-id={`portfolio.stats.token-${eto.equityTokenName}`}
          caption={
            <>
              <TokenIcon
                srcSet={{ "1x": eto.equityTokenImage }}
                alt=""
                className={cn("mr-2", styles.token)}
              />
              <span className={styles.tokenName}>{eto.equityTokenName}</span>
            </>
          }
          value={
            <MoneySuiteWidget
              outputFormat={ENumberOutputFormat.FULL}
              currency={eto.equityTokenSymbol}
              largeNumber={convertFromUlps(
                eto.tokenData.balanceUlps,
                eto.tokenData.balanceDecimals,
              ).toString()}
              value={multiplyBigNumbers([
                eto.tokenData.tokenPrice,
                convertFromUlps(
                  eto.tokenData.balanceUlps,
                  eto.tokenData.balanceDecimals,
                ).toString(),
              ])}
              currencyTotal={ECurrency.EUR}
              size={ESize.MEDIUM}
              inputFormat={ENumberInputFormat.DECIMAL}
            />
          }
        />
      ))}
      <Button
        className={styles.button}
        layout={EButtonLayout.PRIMARY}
        width={EButtonWidth.NORMAL}
        onClick={goToPortfolio}
      >
        {assets.length > 3 ? (
          <FormattedMessage id="dashboard.portfolio-stats.view-more" />
        ) : (
          <FormattedMessage id="dashboard.portfolio-stats.view-portfolio" />
        )}
      </Button>
    </>
  );
};

const PortfolioStats = compose<TPortfolioStatsProps, {}>(
  appConnect<TStateProps, TDispatchProps, {}>({
    stateToProps: state => ({
      myAssets: investorPortfolioModuleApi.selectors.selectMyAssetsWithTokenData(state),
      myAssetsEurEquivTotal: investorPortfolioModuleApi.selectors.selectMyAssetsEurEquivTotal(
        state,
      ),
      hasError: etoModuleApi.selectors.selectEtosError(state),
      isVerifiedInvestor: selectIsVerifiedInvestor(state),
      isLoading: etoModuleApi.selectors.selectTokensLoading(state),
    }),
    dispatchToProps: dispatch => ({
      goToPortfolio: () => dispatch(actions.routing.goToPortfolio()),
      goToProfile: () => dispatch(actions.routing.goToProfile()),
    }),
  }),
  withContainer(PortfolioStatsLayoutContainer),
  branch<TStateProps>(state => state.hasError, renderComponent(PortfolioStatsErrorLayout)),
  branch<TStateProps>(state => state.isLoading, renderComponent(LoadingIndicator)),
  branch<TStateProps>(
    state => !state.myAssets || state.myAssets.length === 0,
    renderComponent(PortfolioStatsNoAssetsLayout),
  ),
)(PortfolioStatsLayout);

export {
  PortfolioStatsLayout,
  PortfolioStats,
  PortfolioStatsNoAssetsLayout,
  PortfolioStatsErrorLayout,
  PortfolioStatsLayoutContainer,
};

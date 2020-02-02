import { convertToUlps, multiplyBigNumbers, OmitKeys } from "@neufund/shared";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectEtos } from "../../modules/eto/selectors";
import {
  selectMyAssetsEurEquivTotal,
  selectMyAssetsWithTokenData,
} from "../../modules/investor-portfolio/selectors";
import { TETOWithTokenData } from "../../modules/investor-portfolio/types";
import { appConnect } from "../../store";
import { DataRow } from "../modals/tx-sender/shared/DataRow";
import { Button, EButtonLayout, EButtonSize, EButtonWidth } from "../shared/buttons/Button";
import { Money } from "../shared/formatters/Money";
import { ECurrency, ENumberInputFormat, ENumberOutputFormat } from "../shared/formatters/utils";
import { TokenIcon } from "../shared/icons/TokenIcon";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";
import { MoneySuiteWidget } from "../shared/MoneySuiteWidget/MoneySuiteWidget";
import { ESize } from "../shared/TransactionData";
import { WarningAlert } from "../shared/WarningAlert";

import styles from "./PortfolioStats.module.scss";

type TStateProps = {
  myAssets: TETOWithTokenData[] | undefined;
  myAssetsEurEquivTotal: string | undefined;
  hasError: boolean | undefined;
};

type TDispatchProps = {
  goToPortfolio: () => void;
};

type PortfolioStatsProps = TStateProps & TDispatchProps;

const PortFolioStatsLayoutContainer: React.FunctionComponent<Pick<
  TStateProps,
  "myAssetsEurEquivTotal"
>> = ({ children, myAssetsEurEquivTotal }) => (
  <section data-test-id="dashboard.portfolio-stats" className={styles.container}>
    <DataRow
      className={styles.header}
      caption={
        <h4 className={styles.title}>
          <FormattedMessage id="dashboard.portfolio-stats.title" />
        </h4>
      }
      value={
        myAssetsEurEquivTotal && (
          <Money
            value={myAssetsEurEquivTotal}
            inputFormat={ENumberInputFormat.ULPS}
            valueType={ECurrency.EUR}
            outputFormat={ENumberOutputFormat.FULL}
          />
        )
      }
    />
    {children}
  </section>
);

const PortfolioStatsLoadingLayout: React.FunctionComponent = () => (
  <PortFolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
    <LoadingIndicator />
  </PortFolioStatsLayoutContainer>
);

const PortfolioStatsErrorLayout: React.FunctionComponent = () => (
  <PortFolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
    <WarningAlert className="m-auto" data-test-id="portfolio-stats-error">
      <FormattedMessage id="common.error" values={{ separator: <br /> }} />
    </WarningAlert>
  </PortFolioStatsLayoutContainer>
);

const PortfolioStatsNoAssetsLayout: React.FunctionComponent<TDispatchProps> = ({
  goToPortfolio,
}) => (
  <PortFolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
    <span className={styles.noAssets}>
      <FormattedMessage id="dashboard.portfolio-stats.no-assets" />
    </span>
    <Button
      className={styles.button}
      layout={EButtonLayout.PRIMARY}
      size={EButtonSize.SMALL}
      width={EButtonWidth.NORMAL}
      onClick={goToPortfolio}
    >
      <FormattedMessage id="dashboard.portfolio-stats.view-portfolio" />
    </Button>
  </PortFolioStatsLayoutContainer>
);

const PortfolioStatsLayout: React.FunctionComponent<OmitKeys<PortfolioStatsProps, "hasError">> = ({
  myAssets,
  goToPortfolio,
  myAssetsEurEquivTotal,
}) => (
  <PortFolioStatsLayoutContainer myAssetsEurEquivTotal={myAssetsEurEquivTotal}>
    {myAssets &&
      myAssets.slice(0, 2).map(eto => (
        <DataRow
          key={eto.equityTokenName}
          className={styles.row}
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
              largeNumber={convertToUlps(eto.tokenData.balance)}
              value={multiplyBigNumbers([eto.tokenData.tokenPrice, eto.tokenData.balance])}
              currencyTotal={ECurrency.EUR}
              size={ESize.MEDIUM}
              inputFormat={ENumberInputFormat.ULPS}
            />
          }
        />
      ))}
    <Button
      className={styles.button}
      layout={EButtonLayout.PRIMARY}
      size={EButtonSize.SMALL}
      width={EButtonWidth.NORMAL}
      onClick={goToPortfolio}
    >
      <FormattedMessage id="dashboard.portfolio-stats.view-portfolio" />
    </Button>
  </PortFolioStatsLayoutContainer>
);

const PortfolioStats = compose<PortfolioStatsProps, {}>(
  appConnect<TStateProps, TDispatchProps, {}>({
    stateToProps: state => {
      const etos = selectEtos(state);

      return {
        myAssets: selectMyAssetsWithTokenData(state),
        myAssetsEurEquivTotal: selectMyAssetsEurEquivTotal(state),
        //  If etos exists and array lengt is 0 we assume that there was an error
        hasError: etos && etos.length === 0,
      };
    },
    dispatchToProps: dispatch => ({
      goToPortfolio: () => dispatch(actions.routing.goToPortfolio()),
    }),
  }),
  branch<TStateProps>(state => !!state.hasError, renderComponent(PortfolioStatsErrorLayout)),
  branch<TStateProps>(state => !state.myAssets, renderComponent(PortfolioStatsLoadingLayout)),
  branch<TStateProps>(
    state => !!state.myAssets && state.myAssets.length === 0,
    renderComponent(PortfolioStatsNoAssetsLayout),
  ),
)(PortfolioStatsLayout);

export {
  PortfolioStatsLayout,
  PortfolioStats,
  PortfolioStatsNoAssetsLayout,
  PortfolioStatsLoadingLayout,
  PortfolioStatsErrorLayout,
};

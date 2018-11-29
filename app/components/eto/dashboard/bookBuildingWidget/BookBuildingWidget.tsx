import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import {selectBookBuildingStats, selectIsBookBuilding} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Panel } from "../../../shared/Panel";
import { actions } from "../../../../modules/actions";
import {onEnterAction} from "../../../../utils/OnEnterAction";
import {onLeaveAction} from "../../../../utils/OnLeaveAction";
import {ECurrencySymbol, EMoneyFormat, Money} from "../../../shared/Money";
import {DocumentLink, DocumentTemplateButton} from "../../../shared/DocumentLink";
import {TBookbuildingStatsType} from "../../../../lib/api/eto/EtoApi.interfaces";

import * as styles from "../../etoContentWidget.module.scss";
import {Document} from "../../../shared/Document";

//FIXME move it somewhere
const INVESTORS_LIMIT = 500;
const countMoney = (bookBuildingStats:any) => bookBuildingStats.reduce((acc:number, element:TBookbuildingStatsType) => {
  acc += element.amountEur;
  return acc
}, 0);
// end FIXME

interface IDispatchProps {
  startBookBuilding: () => void;
  stopBookBuilding: () => void;
  downloadCSV: () => void
}

interface IStateProps {
  bookBuildingState?: boolean;
  bookBuildingStats?: any
}

type IProps = IDispatchProps & IStateProps;

interface IStartBookBuilding {
  startBookBuilding: () => void;
  downloadCSV: () => void;
}

interface IStopBookBuilding {
  stopBookBuilding: () => void;
  downloadCSV: () => void;
}

const BookBuildingStats = ({bookBuildingStats, downloadCSV}:any) => (
  <>
    <div className={styles.groupWrapper}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.amount-backed"/>
      </span>
      <span className={styles.value}>
        <Money
          value={countMoney(bookBuildingStats)}
          currency="eur"
          format={EMoneyFormat.FLOAT}
          currencySymbol={ECurrencySymbol.SYMBOL}
        />
      </span>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.investors-backed"/>
      </span>
      <span className={styles.value} data-test-id="eto-bookbuilding-investors-backed">
            {INVESTORS_LIMIT - bookBuildingStats.length} out of{" "}{INVESTORS_LIMIT} slots remaining
        {/* TODO: Move to translations once the format is stable */}
          </span>
    </div>
    { bookBuildingStats.length > 0
      ? <DocumentTemplateButton
          onClick={downloadCSV}
          title={<FormattedMessage id="eto-bookbuilding-widget.download-bookbuilding-stats"/>}
          altIcon={<Document extension="csv"/>}
        />
      : null
    }
  </>
);

const StartBookBuildingComponent: React.SFC<IStartBookBuilding & IStateProps> = ({
    startBookBuilding,
    bookBuildingStats,
    downloadCSV
  }) => {
  return (
  <Panel headerText={<FormattedMessage id="settings.book-building-widget.start-book-building"/>}>
    <div className={styles.content}>
      <p className={cn(styles.text)}>
        <FormattedMessage id="settings.book-building-widget.proposal-accepted" />
      </p>
      {<BookBuildingStats bookBuildingStats={bookBuildingStats} downloadCSV={downloadCSV} />}
      <div className={styles.button}>
      <ButtonArrowRight onClick={startBookBuilding} data-test-id="eto-flow-start-bookbuilding">
        <FormattedMessage id="settings.book-building-widget.start-book-building" />
      </ButtonArrowRight>
      </div>
    </div>
  </Panel>
)};

const StopBookBuildingComponent: React.SFC<IStopBookBuilding & IStateProps> = ({
  stopBookBuilding,
  bookBuildingStats,
  downloadCSV
}) => {
  console.log("bookBuildingStats:",bookBuildingStats);
  return (
  <Panel headerText={<FormattedMessage id="settings.book-building-widget.stop-book-building"/>}>
    <div className={styles.content}>
      <p className={cn(styles.text)}>
        <FormattedMessage id="settings.book-building-widget.manually-stop" />
      </p>
      {<BookBuildingStats bookBuildingStats={bookBuildingStats} downloadCSV={downloadCSV} />}
      <ButtonArrowRight onClick={stopBookBuilding}>
        <FormattedMessage id="settings.book-building-widget.stop-book-building" />
      </ButtonArrowRight>
    </div>
  </Panel>
)};

export const BookBuildingWidgetComponent: React.SFC<IProps> = ({
  startBookBuilding,
  bookBuildingState,
  stopBookBuilding,
  bookBuildingStats,
  downloadCSV
}) => {
  return bookBuildingState ? (
    <StopBookBuildingComponent stopBookBuilding={stopBookBuilding} bookBuildingStats={bookBuildingStats} downloadCSV={downloadCSV}/>
  ) : (
    <StartBookBuildingComponent startBookBuilding={startBookBuilding} bookBuildingStats={bookBuildingStats} downloadCSV={downloadCSV}/>
  );
};

export const BookBuildingWidget = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      bookBuildingState: selectIsBookBuilding(state),
      bookBuildingStats: selectBookBuildingStats(state)
    }),
    dispatchToProps: dispatch => ({
      startBookBuilding: () => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(true));
        dispatch(actions.etoFlow.bookBuildingStartWatch())
      },
      stopBookBuilding: () => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(false));
        dispatch(actions.etoFlow.bookBuildingStopWatch())
      },
      downloadCSV: () => {
        dispatch(actions.etoFlow.downloadBookBuildingStats())
      }
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch,props) => {
      if(props.bookBuildingState){
        dispatch(actions.etoFlow.bookBuildingStartWatch())
      } else {
        dispatch(actions.etoFlow.loadDetailedBookBuildingStats())
      }
    }
  }),
  onLeaveAction({
    actionCreator: (dispatch,props) => {
      if(props.bookBuildingState){
        dispatch(actions.etoFlow.bookBuildingStopWatch())
      }
    }
  })
)(BookBuildingWidgetComponent);

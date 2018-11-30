import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import {selectBookBuildingStats, selectIsBookBuilding, selectMaxPledges} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Panel } from "../../../shared/Panel";
import { actions } from "../../../../modules/actions";
import {onEnterAction} from "../../../../utils/OnEnterAction";
import {onLeaveAction} from "../../../../utils/OnLeaveAction";
import {ECurrencySymbol, EMoneyFormat, Money} from "../../../shared/Money";
import { DocumentTemplateButton} from "../../../shared/DocumentLink";
import {TBookbuildingStatsType} from "../../../../lib/api/eto/EtoApi.interfaces";
import {Document} from "../../../shared/Document";

import * as styles from "../../etoContentWidget.module.scss";

//FIXME move it somewhere
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
  bookBuildingEnabled?: boolean;
  bookBuildingStats: TBookbuildingStatsType[];
  maxPledges: number | null;
}

interface IBookBuildingEnabled {
  stopBookBuilding: () => void;
}

interface IBookBuildingDisabled {
  startBookBuilding: () => void;
}


interface IBookBuildingStats {
  bookBuildingStats: TBookbuildingStatsType[];
  downloadCSV: () => void;
  maxPledges: number | null
}

type IProps = IDispatchProps & IStateProps;

const BookBuildingStats = ({bookBuildingStats, maxPledges, downloadCSV}:IBookBuildingStats) => (
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
        {maxPledges !== null
          ? <FormattedMessage id="settings.book-building-stats-widget.number-of-pledges"
                              values={{pledges: bookBuildingStats.length, maxPledges}}
            />
          : null
        }
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

const BookBuildingNotStarted: React.SFC<IBookBuildingDisabled> = ({
   startBookBuilding,
 }) => {
  return (
    <Panel headerText={<FormattedMessage id="settings.book-building-widget.start-book-building"/>}>
      <div className={styles.content}>
        <p className={cn(styles.text)}>
          <FormattedMessage id="settings.book-building-widget.proposal-accepted" />
        </p>
        <div className={styles.button}>
          <ButtonArrowRight onClick={startBookBuilding} data-test-id="eto-flow-start-bookbuilding">
            <FormattedMessage id="settings.book-building-widget.start-book-building" />
          </ButtonArrowRight>
        </div>
      </div>
    </Panel>
  )};

const BookBuildingPaused: React.SFC<IBookBuildingDisabled & IBookBuildingStats> = ({
    startBookBuilding,
    bookBuildingStats,
    maxPledges,
    downloadCSV
  }) => {
  return (
  <Panel headerText={<FormattedMessage id="settings.book-building-widget.book-building-diabled"/>}>
    <div className={styles.content}>
      <p className={cn(styles.text)}>
        <FormattedMessage id="settings.book-building-widget.book-building-disabled-text" />
      </p>
      {<BookBuildingStats bookBuildingStats={bookBuildingStats} downloadCSV={downloadCSV} maxPledges={maxPledges}/>}
      <div className={styles.button}>
      <ButtonArrowRight onClick={startBookBuilding} data-test-id="eto-flow-start-bookbuilding">
        <FormattedMessage id="settings.book-building-widget.reactivate-book-building" />
      </ButtonArrowRight>
      </div>
    </div>
  </Panel>
)};

const BookBuildingEnabled: React.SFC<IBookBuildingEnabled & IBookBuildingStats> = ({
  stopBookBuilding,
  bookBuildingStats,
  maxPledges,
  downloadCSV
}) => {
  console.log("bookBuildingStats:", bookBuildingStats);
  return (
  <Panel headerText={<FormattedMessage id="settings.book-building-widget.book-building-enabled"/>}>
    <div className={styles.content}>
      <p className={cn(styles.text)}>
        <FormattedMessage id="settings.book-building-widget.book-building-enabled-text" />
      </p>
      {<BookBuildingStats bookBuildingStats={bookBuildingStats} downloadCSV={downloadCSV} maxPledges={maxPledges}/>}
      <ButtonArrowRight onClick={stopBookBuilding}>
        <FormattedMessage id="settings.book-building-widget.stop-book-building" />
      </ButtonArrowRight>
    </div>
  </Panel>
)};

export const BookBuildingWidgetComponent: React.SFC<IProps> = ({
  startBookBuilding,
  bookBuildingEnabled,
  maxPledges,
  stopBookBuilding,
  bookBuildingStats,
  downloadCSV
}) => {
  if (!bookBuildingEnabled && !bookBuildingStats.length) {
    return (
      <BookBuildingNotStarted
        startBookBuilding={startBookBuilding}
      />
    )
  } else if (!bookBuildingEnabled && bookBuildingStats.length) {
    return (
      <BookBuildingPaused
        startBookBuilding={startBookBuilding}
        bookBuildingStats={bookBuildingStats}
        maxPledges={maxPledges}
        downloadCSV={downloadCSV}
      />
    )
  } else {
    return (<BookBuildingEnabled
      stopBookBuilding={stopBookBuilding}
      bookBuildingStats={bookBuildingStats}
      maxPledges={maxPledges}
      downloadCSV={downloadCSV}
    />)
  }
};

export const BookBuildingWidget = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      bookBuildingEnabled: selectIsBookBuilding(state),
      bookBuildingStats: selectBookBuildingStats(state) ,
      maxPledges: selectMaxPledges(state)
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
      if(props.bookBuildingEnabled){
        dispatch(actions.etoFlow.bookBuildingStartWatch())
      } else {
        dispatch(actions.etoFlow.loadDetailedBookBuildingStats())
      }
    }
  }),
  onLeaveAction({
    actionCreator: (dispatch,props) => {
      if(props.bookBuildingEnabled){
        dispatch(actions.etoFlow.bookBuildingStopWatch())
      }
    }
  })
)(BookBuildingWidgetComponent);

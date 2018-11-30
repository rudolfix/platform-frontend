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
import {countPledgeMoney } from "./utils";

import * as styles from "../../etoContentWidget.module.scss";
import {TTranslatedString} from "../../../../types";

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

interface ILayoutProps {
  onClick: () => void;
  headerText: TTranslatedString;
  text: TTranslatedString;
  buttonText: TTranslatedString;
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
          value={countPledgeMoney(bookBuildingStats)}
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
          ? <FormattedMessage
              id="settings.book-building-stats-widget.number-of-pledges"
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

const BookBuildingWidgetLayout:React.SFC<ILayoutProps> = ({children, onClick, headerText, text, buttonText}) => (
  <Panel headerText={headerText}>
    <div className={styles.content}>
      <p className={cn(styles.text)}>{text}</p>
      {children}
      <div className={styles.widgetButton}>
        <ButtonArrowRight
          onClick={onClick}
          data-test-id="eto-flow-start-bookbuilding"
          className={styles.buttonOverride}
        >
          {buttonText}
        </ButtonArrowRight>
      </div>
    </div>
  </Panel>
);

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
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.start-book-building"/>}
        text={<FormattedMessage id="settings.book-building-widget.proposal-accepted" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
        onClick={startBookBuilding}
      />
    )
  } else if (!bookBuildingEnabled && bookBuildingStats.length) {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.book-building-diabled"/>}
        text={<FormattedMessage id="settings.book-building-widget.book-building-disabled-text" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.reactivate-book-building" />}
        onClick={startBookBuilding}
      >
        <BookBuildingStats
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
        />
      </BookBuildingWidgetLayout>
    )
  } else {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.book-building-enabled"/>}
        text={<FormattedMessage id="settings.book-building-widget.book-building-enabled-text" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.stop-book-building" />}
        onClick={stopBookBuilding}
      >
        <BookBuildingStats
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
        />
      </BookBuildingWidgetLayout>
    )
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
  }),
)(BookBuildingWidgetComponent);

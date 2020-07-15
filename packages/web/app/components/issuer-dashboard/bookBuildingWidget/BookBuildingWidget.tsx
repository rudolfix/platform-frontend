import {
  bookbuildingModuleApi,
  EETOStateOnChain,
  EWhitelistingState,
  IBookBuildingStats,
  TEtoInvestmentCalculatedValues,
} from "@neufund/shared-modules";
import { assertNever, InvariantError, nonNullable } from "@neufund/shared-utils";
import * as React from "react";
import { branch, compose, renderComponent, renderNothing, withProps } from "recompose";

import { actions } from "../../../modules/actions";
import { selectIsAuthorized, selectIsInvestor } from "../../../modules/auth/selectors";
import {
  selectCanEnableBookBuilding,
  selectIsBookBuilding,
  selectIssuerEtoDateToWhitelistMinDuration,
  selectIssuerEtoId,
  selectIssuerEtoOnChainState,
  selectMaxPledges,
} from "../../../modules/eto-flow/selectors";
import { selectIssuerEtoInvestmentCalculatedValues } from "../../../modules/eto/selectors";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { onLeaveAction } from "../../../utils/react-connected-components/OnLeaveAction";
import { EColumnSpan } from "../../layouts/Container";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { Panel } from "../../shared/Panel";
import { BookBuildingActiveWidget } from "./BookBuildingActiveWidget";
import { BookBuildingNotActiveWidget } from "./BookBuildingNotActiveWidget";
import { BookBuildingStoppedWidget } from "./BookBuildingStoppedWidget";
import { BookBuildingSuspendedWidget } from "./BookBuildingSuspendedWidget";

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

interface IDispatchProps {
  startBookBuilding: (etoId: string) => void;
  stopBookBuilding: (etoId: string) => void;
  downloadCSV: () => void;
}

interface IStateProps {
  bookBuildingEnabled?: boolean;
  bookBuildingStats: IBookBuildingStats;
  maxPledges: number | null;
  etoId: string;
  canEnableBookbuilding: boolean;
  onChainState: EETOStateOnChain | undefined;
  minOffsetPeriod: number;
  isAuthorized: boolean;
  investmentCalculatedValues: TEtoInvestmentCalculatedValues | undefined;
  isInvestor: boolean;
}

interface IWithProps {
  whitelistingState: EWhitelistingState;
}

interface IPanelProps {
  headerText?: TTranslatedString;
  columnSpan?: EColumnSpan;
}

type TProps = IWithProps &
  IDispatchProps &
  Omit<IStateProps, "onChainState" | "canEnableBookbuilding" | "bookBuildingEnabled"> &
  IExternalProps;

export const BookBuildingWidgetComponent: React.FunctionComponent<TProps> = ({
  startBookBuilding,
  maxPledges,
  stopBookBuilding,
  bookBuildingStats,
  downloadCSV,
  minOffsetPeriod,
  etoId,
  columnSpan,
  whitelistingState,
}) => {
  switch (whitelistingState) {
    case EWhitelistingState.ACTIVE:
      return (
        <BookBuildingActiveWidget
          columnSpan={columnSpan}
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
          minOffsetPeriod={minOffsetPeriod}
          stopBookBuilding={stopBookBuilding}
          etoId={etoId}
        />
      );
    case EWhitelistingState.NOT_ACTIVE:
      return (
        <BookBuildingNotActiveWidget
          etoId={etoId}
          startBookBuilding={startBookBuilding}
          columnSpan={columnSpan}
        />
      );
    case EWhitelistingState.SUSPENDED:
      return (
        <BookBuildingSuspendedWidget
          columnSpan={columnSpan}
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
          startBookBuilding={startBookBuilding}
          etoId={etoId}
        />
      );
    case EWhitelistingState.STOPPED:
    case EWhitelistingState.LIMIT_REACHED:
      return (
        <BookBuildingStoppedWidget
          columnSpan={columnSpan}
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
        />
      );
    case EWhitelistingState.LOADING:
      return <LoadingIndicator />;
    default:
      return assertNever(whitelistingState);
  }
};

const WidgetLoading: React.ComponentType<IPanelProps> = ({ columnSpan }) => (
  <Panel columnSpan={columnSpan}>
    <LoadingIndicator />
  </Panel>
);

export const BookBuildingWidget = compose<TProps, IExternalProps>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = nonNullable(selectIssuerEtoId(state));

      return {
        etoId,
        investmentCalculatedValues: selectIssuerEtoInvestmentCalculatedValues(state),
        bookBuildingEnabled: selectIsBookBuilding(state),
        bookBuildingStats: bookbuildingModuleApi.selectors.selectBookbuildingStats(state, etoId),
        maxPledges: selectMaxPledges(state),
        canEnableBookbuilding: selectCanEnableBookBuilding(state),
        onChainState: selectIssuerEtoOnChainState(state),
        minOffsetPeriod: selectIssuerEtoDateToWhitelistMinDuration(state),
        isAuthorized: selectIsAuthorized(state),
        isInvestor: selectIsInvestor(state),
      };
    },
    dispatchToProps: dispatch => ({
      startBookBuilding: etoId => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(true));
        dispatch(actions.bookBuilding.bookBuildingStartWatch(etoId));
      },
      stopBookBuilding: etoId => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(false));
        dispatch(actions.bookBuilding.bookBuildingStopWatch(etoId));
      },
      downloadCSV: () => {
        dispatch(actions.etoFlow.downloadBookBuildingStats());
      },
    }),
  }),
  onEnterAction<IStateProps>({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStartWatch(props.etoId));
      } else {
        dispatch(actions.bookBuilding.loadBookBuildingStats(props.etoId));
      }
    },
  }),
  onLeaveAction<IStateProps>({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStopWatch(props.etoId));
      }
    },
  }),
  branch<IStateProps>(props => !props.bookBuildingStats, renderComponent(WidgetLoading)),
  withProps<IWithProps, IStateProps>(
    ({
      bookBuildingStats,
      maxPledges,
      canEnableBookbuilding,
      bookBuildingEnabled,
      isAuthorized,
      investmentCalculatedValues,
      isInvestor,
    }) => {
      if (maxPledges === null || bookBuildingEnabled === undefined) {
        throw new InvariantError(
          "Max pledges and bookbuilding status should be defined at this point",
        );
      }

      const bookbuildingLimitReached = maxPledges - bookBuildingStats.investorsCount <= 0;

      return {
        whitelistingState: bookbuildingModuleApi.utils.calculateWhitelistingState({
          canEnableBookbuilding: canEnableBookbuilding,
          whitelistingIsActive: bookBuildingEnabled,
          bookbuildingLimitReached,
          investmentCalculatedValues,
          investorsCount: bookBuildingStats.investorsCount,
          isAuthorized,
          isInvestor,
        }),
      };
    },
  ),
  branch<IStateProps & IWithProps>(props => {
    // show widget when bookbuilding can be enabled
    if (props.canEnableBookbuilding) {
      return false;
    }

    // show widget when limit reached or stopped up until end of presale
    if (
      [EWhitelistingState.LIMIT_REACHED, EWhitelistingState.STOPPED].includes(
        props.whitelistingState,
      )
    ) {
      return ![undefined, EETOStateOnChain.Setup, EETOStateOnChain.Whitelist].includes(
        props.onChainState,
      );
    }

    return true;
  }, renderNothing),
)(BookBuildingWidgetComponent);

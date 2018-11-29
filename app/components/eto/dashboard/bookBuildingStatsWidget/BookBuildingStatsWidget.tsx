import {appConnect} from "../../../../store";
import {selectIsBookBuilding} from "../../../../modules/eto-flow/selectors";
import {compose} from "recompose";
import * as React from "react";
import * as cn from "classnames";
import {Col} from "reactstrap";

import {actions} from "../../../../modules/actions";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../../utils/OnLeaveAction";
import {IIntlProps, injectIntlHelpers} from "../../../../utils/injectIntlHelpers";
import {Panel} from "../../../shared/Panel";
import {ButtonArrowRight} from "../../../shared/buttons";
import {CommonHtmlProps} from "../../../../types";
import { FormattedMessage , FormattedHTMLMessage } from "react-intl-phraseapp";

import * as styles from "../../etoContentWidget.module.scss";
import {Tooltip} from "../../../shared/Tooltip";
import {ECurrencySymbol, EMoneyFormat, Money} from "../../../shared/Money";
import {CampaigningActivatedInvestorApprovedWidget} from "../../overview/EtoOverviewStatus/CampaigningWidget/CampaigningActivatedInvestorApprovedWidget";

interface IDispatchProps {}

interface IComponentProps {}

interface IStateProps {
  bookBuildingStats: any;
}

export const BookBuildingStatsWidgetLayout:React.SFC<IStateProps & IDispatchProps & IIntlProps> = ({
  intl: { formatIntlMessage },
  }) => {
  const investorsCount = 25;
  const investorsLimit = 500
  return (
    <Panel headerText={formatIntlMessage("settings.book-building-stats-widget.title")}>
      <div className={styles.content}>
        <div className={styles.groupWrapper}>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview.amount-backed"/>
            </span>
            <span className={styles.value}>
              <Money
                value={34523}
                currency="eur"
                format={EMoneyFormat.FLOAT}
                currencySymbol={ECurrencySymbol.SYMBOL}
              />
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview.investors-backed"/>
            </span>
            <span className={styles.value} data-test-id="eto-bookbuilding-investors-backed">
              {investorsCount !== null ? investorsLimit - investorsCount : investorsLimit} out of{" "}
              {investorsLimit} slots remaining
              {/* TODO: Move to translations once the format is stable */}
            </span>
          </div>
        </div>
      </div>
    </Panel>
  )};

export const BookBuildingStatsWidget = compose<IStateProps & IDispatchProps & IIntlProps, CommonHtmlProps>(
  appConnect<IStateProps, IDispatchProps, IIntlProps>({
    stateToProps: state => ({
      bookBuildingStats: selectIsBookBuilding(state), //FIXME
    }),
    dispatchToProps: dispatch => ({
      //downloadStats
    })
  }),
  onEnterAction({
    actionCreator: d => d(actions.publicEtos.bookbuildingStartWatch())
  }),
  onLeaveAction({
    actionCreator: d => d(actions.publicEtos.bookbuildingStopWatch())
  }),
  injectIntlHelpers
)(BookBuildingStatsWidgetLayout);

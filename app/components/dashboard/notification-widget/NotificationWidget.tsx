import * as React from "react";

import { INotification } from "../../../modules/notifications/reducer";
import { appConnect, AppDispatch } from "../../../store";
import { Notification } from "./Notification";

interface IExternalProps {
  notifications?: INotification[];
}

interface IStateProps {
  stateNotifications: INotification[];
}

interface IDispatchProps {
  dispatch: AppDispatch;
}

type IProps = IStateProps & IDispatchProps & IExternalProps;

export class NotificationWidgetComponent extends React.Component<IProps> {
  render(): React.ReactNode {
    const mergedNotifications = this.props.stateNotifications.concat(
      this.props.notifications || [],
    );

    return mergedNotifications.map((notification, index) => (
      <Notification
        key={notification.text + index.toString(10)}
        type={notification.type}
        text={notification.text}
        actionLinkText={notification.actionLinkText}
        onClick={() => this.props.dispatch(notification.onClickAction)}
      />
    ));
  }
}

export const NotificationWidget = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({ stateNotifications: s.notifications.notifications }),
  dispatchToProps: dispatch => ({
    dispatch,
  }),
})(NotificationWidgetComponent);

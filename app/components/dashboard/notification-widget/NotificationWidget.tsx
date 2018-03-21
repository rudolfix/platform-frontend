import * as React from "react";

import { INotification } from "../../../modules/notifications/reducer";
import { appConnect, AppDispatch } from "../../../store";
import { Notification } from "./Notification";

interface IStateProps {
  notifications: INotification[];
}

interface IDispatchProps {
  dispatch: AppDispatch;
}

export class NotificationWidgetComponent extends React.Component<IStateProps & IDispatchProps> {
  render(): React.ReactNode {
    return this.props.notifications.map((notification, index) => (
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
  stateToProps: s => ({ notifications: s.notifications.notifications }),
  dispatchToProps: dispatch => ({
    dispatch,
  }),
})(NotificationWidgetComponent);

import * as React from "react";

import { INotification, seedNotBackedUpNotification } from "../../../modules/notifications/reducer";
import { appConnect, AppDispatch } from "../../../store";
import { Notification } from "./Notification";

interface IStateProps {
  notifications: INotification[];
}

interface IDispatchProps {
  dispatch: AppDispatch;
}

type IProps = IStateProps & IDispatchProps;

const NotificationWidgetComponent: React.SFC<IProps> = ({ notifications, dispatch }) => {
  return (
    <>
      {notifications.map((notification, index) => (
        <Notification
          key={notification.text + index.toString(10)}
          type={notification.type}
          text={notification.text}
          actionLinkText={notification.actionLinkText}
          onClick={() => dispatch(notification.onClickAction)}
        />
      ))}
    </>
  );
};

export const NotificationWidget = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => {
    const notifications = s.notifications.notifications;
    const appStateDerivedNotifications =
      s.auth.user && s.auth.user.backupCodesVerified ? [] : [seedNotBackedUpNotification()];

    return {
      notifications: [...notifications, ...appStateDerivedNotifications],
    };
  },
  dispatchToProps: dispatch => ({
    dispatch,
  }),
})(NotificationWidgetComponent);

import * as React from "react";
import { INotification, Notification } from "./Notification";

interface INotificationWidgetComponentProps {
  notifications: INotification[];
}

export const NotificationWidgetComponent: React.SFC<INotificationWidgetComponentProps> = ({
  notifications,
}) => {
  return (
    <div>
      {notifications.map(notification => <Notification key={notification.id} {...notification} />)}
    </div>
  );
};

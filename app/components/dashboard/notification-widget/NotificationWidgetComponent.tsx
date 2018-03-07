import * as React from "react";
import { INotification, Notification } from "./Notification";

interface IProps {
  notifications: INotification[];
}

export const NotificationWidgetComponent: React.SFC<IProps> = ({
  notifications,
}) => {
  return (
    <div>
      {notifications.map(notification => <Notification key={notification.id} {...notification} />)}
    </div>
  );
};

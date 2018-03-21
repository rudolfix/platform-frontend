import * as React from "react";
import { INotification, Notification } from "./Notification";
import * as styles from "./NotificationWidgetComponent.module.scss";

interface IProps {
  notifications: INotification[];
}

export const NotificationWidgetComponent: React.SFC<IProps> = ({ notifications }) => {
  return (
    <div className={styles.notificationWidgetComponent}>
      {notifications.map(notification => (
        <Notification key={notification.id} {...notification} className={styles.notification} />
      ))}
    </div>
  );
};

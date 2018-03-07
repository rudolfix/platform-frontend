import * as React from "react";
import { INotification, NotificationType } from "./Notification";
import { NotificationWidgetComponent } from "./NotificationWidgetComponent";

// mocked data
const notificationInfo: INotification = {
  id: 1,
  type: NotificationType.INFO,
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  onClose: () => alert("closing"),
};

const notificationWarning: INotification = {
  id: 2,
  type: NotificationType.WARNING,
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  actionLink: "some/route/1",
  actionLinkText: "go to Some Route 1",
};

const notifications: INotification[] = [notificationInfo, notificationWarning];

export class NotificationWidget extends React.Component {
  render(): React.ReactNode {
    return <NotificationWidgetComponent notifications={notifications} />;
  }
}

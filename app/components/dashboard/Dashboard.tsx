import * as React from "react";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MessageSignModal } from "../modals/SignMessageModal";
import { NotificationWidget } from "./notification-widget/NotificationWidget";
import { UserInfo } from "./UserInfo";

export const Dashboard = () => (
  <LayoutAuthorized>
    <NotificationWidget />
    <MessageSignModal />
    <h2>Dashboard</h2>
    <UserInfo />
  </LayoutAuthorized>
);

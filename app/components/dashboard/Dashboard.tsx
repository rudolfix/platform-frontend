import * as React from "react";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MessageSignModal } from "../modals/SignMessageModal";
import { UserInfo } from "./UserInfo";

export const Dashboard = () => (
  <LayoutAuthorized>
    <MessageSignModal />
    <h2>Dashboard</h2>
    <UserInfo />
  </LayoutAuthorized>
);

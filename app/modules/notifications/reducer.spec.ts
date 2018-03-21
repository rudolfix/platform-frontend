import { expect } from "chai";

import { actions } from "../actions";
import { INewNotification, notificationActions } from "./actions";
import { notificationsInitState, notificationsReducer, NotificationType } from "./reducer";

describe("notifications > reducer", () => {
  it("should act on NOTIFICATIONS_ADD", () => {
    const notification: INewNotification = {
      actionLinkText: "actionLinkText",
      text: "text",
      type: NotificationType.WARNING,
    };
    const action = actions.notifications.notificationAdd(notification);

    const newState = notificationsReducer(notificationsInitState, action);

    expect(newState.id).to.be.eq(1);
    expect(newState.notifications).to.be.deep.eq([
      {
        ...notification,
        id: 1,
        onClickAction: notificationActions.notificationRemove(1),
      },
    ]);
  });

  it("should act on NOTIFICATIONS_REMOVE", () => {
    const notification = {
      id: null,
      actionLinkText: "actionLinkText",
      text: "text",
      type: NotificationType.WARNING,
    };
    const actionAdd = actions.notifications.notificationAdd(notification);
    const actionRemove = actions.notifications.notificationRemove(1);

    const state = notificationsReducer(notificationsInitState, actionAdd);
    const newState = notificationsReducer(state, actionRemove);

    expect(newState.id).to.be.eq(1);
    expect(newState.notifications).to.be.deep.eq([]);
  });
});

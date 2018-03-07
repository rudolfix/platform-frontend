import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { Notification, NotificationType } from "./Notification";

import { tid } from "../../../../test/testUtils";

const defaultProps = () => ({
  id: 1,
  type: NotificationType.INFO,
  text: "test notification",
  onClose: spy(),
  actionLink: "dashboard",
  actionLinkText: "link text",
});


describe("<Notification />", () => {
  let props: any;

  beforeEach(() => {
    props = defaultProps();
  });


  it("should be of correct type", () => {
    const componentInfo = shallow(<Notification {...props} type={NotificationType.INFO} />);

    expect(componentInfo.hasClass(NotificationType.INFO)).to.be.true;

    const componentWarning = shallow(<Notification {...props} type={NotificationType.WARNING} />);

    expect(componentWarning.hasClass(NotificationType.WARNING)).to.be.true;
  });


  it("should call correct click handlers for close button", () => {
    const component = shallow(<Notification {...props} />);

    component.find(tid("notification-close")).simulate("click");

    expect(props.onClose).to.be.calledOnce;
  });
});

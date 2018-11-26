import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { withMockStore } from "../../../utils/storeDecorator";
import { Button, EButtonLayout } from "./Button";
import { ButtonLink } from "./ButtonLink";

describe("<ButtonLink />", () => {
  it("should pass isActive prop as true to Button when path matches", () => {
    const path = "/register";

    const { node } = withMockStore({
      router: {
        location: {
          pathname: path,
        },
      },
    })(<ButtonLink to={path} />);

    const layout = mount(node);
    const button = layout.find(Button);

    expect(button.prop("isActive")).to.be.true;
  });

  it("should pass isActive prop as false to Button when custom logic is used", () => {
    const path = "/register";

    const { node } = withMockStore({
      router: {
        location: {
          pathname: path,
        },
      },
    })(<ButtonLink to={path} isActive={false} />);

    const layout = mount(node);
    const button = layout.find(Button);

    expect(button.prop("isActive")).to.be.false;
  });

  it("should pass isActive prop as false to Button when path doesn't math", () => {
    const { node } = withMockStore({
      router: {
        location: {
          pathname: "/register",
        },
      },
    })(<ButtonLink to={"/login"} />);

    const layout = mount(node);
    const button = layout.find(Button);

    expect(button.prop("isActive")).to.be.false;
  });

  it("should pass props trough to Button", () => {
    const { node } = withMockStore({
      router: {
        location: null,
      },
    })(<ButtonLink to={"/login"} disabled={true} layout={EButtonLayout.INLINE} />);

    const layout = mount(node);
    const button = layout.find(Button);

    // should not pass "to" to underling component
    // as it can generate DOM errors
    expect(button.prop("to")).to.be.undefined;
    expect(button.prop("disabled")).to.be.true;
    expect(button.prop("layout")).to.equal(EButtonLayout.INLINE);
  });
});

import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import { Authorized, Header, UnAuthorized } from "../../app/components/Header";
import { tid } from "../testUtils";

describe("<Header />", () => {
  const name = "moe";
  const balanceEuro = 0;
  const balanceNeu = 0;
  describe("<Header />", () => {
    it("should render UnAuthorized Navbar", () => {
      const component = shallow(<Header isAuthorized={false} />);
      expect(component.find(UnAuthorized)).to.have.length(1);
    });
    it("should render Authorized Navbar", () => {
      const component = shallow(
        <Header
          isAuthorized={true}
          name={name}
          balanceEuro={balanceEuro}
          balanceNeu={balanceNeu}
        />,
      );
      expect(component.find(Authorized)).to.have.length(1);
    });
  });
  describe("<Authorized />", () => {
    it("should call callback", () => {
      const toggle = sinon.spy();
      const component = shallow(
        <Authorized
          name={name}
          balanceEuro={balanceEuro}
          balanceNeu={balanceNeu}
          toggle={toggle}
          isOpen={false}
        />,
      );
      component.find(tid("button-toggle")).simulate("click");
      expect(toggle.calledOnce).to.equal(true);
    });
  });
});

import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { tid } from "../../../../../test/testUtils";
import { LightWalletSeedRecoveryComponent, SEED_LENGTH } from "./SeedRecovery.unsafe";

const defaultProps = {
  onValidSeed: spy(),
};

describe("<WalletLightSeedRecoveryComponent />", () => {
  it("buttons should be disabled for initial state", () => {
    const component = shallow(<LightWalletSeedRecoveryComponent {...defaultProps} />);

    expect(component.find(tid("btn-send")).prop("disabled")).to.be.true;
  });

  it("'Validate' button active only when all words on page are filled in", () => {
    const state = {
      words: Array(SEED_LENGTH).fill("bla"),
      seedError: false,
    };

    const component = shallow(<LightWalletSeedRecoveryComponent {...defaultProps} />);
    component.setState(state);

    expect(component.find(tid("btn-send")).prop("disabled")).to.be.false;
  });

  it("send button should call correct method", () => {
    const props = defaultProps;
    const state = {
      words: [
        "rare",
        "work",
        "reason",
        "ladder",
        "hurdle",
        "junior",
        "moment",
        "sad",
        "lens",
        "panic",
        "random",
        "photo",
        "cave",
        "essence",
        "simple",
        "better",
        "merit",
        "stage",
        "road",
        "that",
        "humor",
        "term",
        "assist",
        "arrange",
      ],
      seedError: false,
    };

    const component = shallow<LightWalletSeedRecoveryComponent>(
      <LightWalletSeedRecoveryComponent {...props} />,
    );
    component.setState(state);

    component.find(tid("btn-send")).simulate("click");

    expect(props.onValidSeed).to.be.calledWith(component.state().words.join(" "));
  });
});

import { tid } from "@neufund/shared/tests";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { testCompany, testEto } from "../../../../../../../test/fixtures";
import { Individuals } from "./Individuals";

const member = {
  name: "Mocha",
  socialChannels: [
    {
      type: "medium",
      url: "",
    },
    {
      type: "twitter",
      url: "",
    },
    {
      type: "linkedin",
      url: "",
    },
  ],
};

const emptyEto = {
  ...testEto,
  company: {
    ...testCompany,
    advisors: {
      members: [],
    },
    boardMembers: {
      members: [],
    },
    keyAlliances: {
      members: [],
    },
    keyCustomers: {
      members: [],
    },
    notableInvestors: {
      members: [],
    },
    partners: {
      members: [],
    },
    team: {
      members: [],
    },
  },
};

type TAssertConfig = {
  team?: boolean;
  partners?: boolean;
  notableInvestors?: boolean;
  advisors?: boolean;
  keyCustomers?: boolean;
  boardMembers?: boolean;
  keyAlliances?: boolean;
};

const assertSections = (
  component: ShallowWrapper,
  {
    team,
    partners,
    notableInvestors,
    advisors,
    keyCustomers,
    boardMembers,
    keyAlliances,
  }: TAssertConfig,
) => {
  expect(component.find(tid("eto.individuals.team"))).to.have.length(team ? 1 : 0);
  expect(component.find(tid("eto.individuals.partners"))).to.have.length(partners ? 1 : 0);
  expect(component.find(tid("eto.individuals.notable-investors"))).to.have.length(
    notableInvestors ? 1 : 0,
  );
  expect(component.find(tid("eto.individuals.advisors"))).to.have.length(advisors ? 1 : 0);
  expect(component.find(tid("eto.individuals.key-customers"))).to.have.length(keyCustomers ? 1 : 0);
  expect(component.find(tid("eto.individuals.board-members"))).to.have.length(boardMembers ? 1 : 0);
  expect(component.find(tid("eto.individuals.key-alliances"))).to.have.length(keyAlliances ? 1 : 0);
};

describe("Individuals", () => {
  it("Should not render any individuals", () => {
    const component = shallow(<Individuals eto={emptyEto} />);

    assertSections(component, {});
  });

  it("Should render team", () => {
    const eto = {
      ...emptyEto,
      company: {
        ...emptyEto.company,
        team: {
          members: [member],
        },
      },
    } as any;

    const component = shallow(<Individuals eto={eto} />);

    assertSections(component, { team: true });
  });

  it("Should render partners", () => {
    const eto = {
      ...emptyEto,
      company: {
        ...emptyEto.company,
        partners: {
          members: [member],
        },
      },
    } as any;

    const component = shallow(<Individuals eto={eto} />);

    assertSections(component, { partners: true });
  });

  it("Should render notable investors", () => {
    const eto = {
      ...emptyEto,
      company: {
        ...emptyEto.company,
        notableInvestors: {
          members: [member],
        },
      },
    } as any;

    const component = shallow(<Individuals eto={eto} />);

    assertSections(component, { notableInvestors: true });
  });

  it("Should render advisors", () => {
    const eto = {
      ...emptyEto,
      company: {
        ...emptyEto.company,
        advisors: {
          members: [member],
        },
      },
    } as any;

    const component = shallow(<Individuals eto={eto} />);

    assertSections(component, { advisors: true });
  });

  it("Should render key customers", () => {
    const eto = {
      ...emptyEto,
      company: {
        ...emptyEto.company,
        keyCustomers: {
          members: [member],
        },
      },
    } as any;

    const component = shallow(<Individuals eto={eto} />);

    assertSections(component, { keyCustomers: true });
  });

  it("Should render board members", () => {
    const eto = {
      ...emptyEto,
      company: {
        ...emptyEto.company,
        boardMembers: {
          members: [member],
        },
      },
    } as any;

    const component = shallow(<Individuals eto={eto} />);

    assertSections(component, { boardMembers: true });
  });

  it("Should render key alliances", () => {
    const eto = {
      ...emptyEto,
      company: {
        ...emptyEto.company,
        keyAlliances: {
          members: [member],
        },
      },
    } as any;

    const component = shallow(<Individuals eto={eto} />);

    assertSections(component, { keyAlliances: true });
  });

  it("Should render all sections", () => {
    const eto = {
      ...emptyEto,
      company: {
        ...emptyEto.company,
        team: {
          members: [member],
        },
        partners: {
          members: [member],
        },
        notableInvestors: {
          members: [member],
        },
        advisors: {
          members: [member],
        },
        keyCustomers: {
          members: [member],
        },
        boardMembers: {
          members: [member],
        },
        keyAlliances: {
          members: [member],
        },
      },
    } as any;

    const component = shallow(<Individuals eto={eto} />);

    assertSections(component, {
      team: true,
      partners: true,
      notableInvestors: true,
      advisors: true,
      keyCustomers: true,
      boardMembers: true,
      keyAlliances: true,
    });
  });
});

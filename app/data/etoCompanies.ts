import { IEtoOfferingProps } from "../components/shared/EtoOfferingCard";
import { IEtoOfferingSoonProps } from "../components/shared/EtoOfferingSoon";

import * as logo from "../assets/img/logo_capitalized.svg";

export type EtoData =
  | { type: "offering"; data: IEtoOfferingProps }
  | { type: "teaser"; data: IEtoOfferingSoonProps };

export const etoCompaniesCards: Array<EtoData> = [
  {
    type: "offering",
    data: {
      roundName: "seed round",
      tags: [
        {
          text: "fintech",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "Neufund",
      description:
        "Neufund is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      logo,
      to: "#0",
    },
  },
  {
    type: "offering",
    data: {
      roundName: "seed round",
      tags: [
        {
          text: "fintech",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "XYZ Company",
      description:
        "XYZ Company is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      logo,
      to: "#0",
    },
  },
  {
    type: "offering",
    data: {
      roundName: "seed round",
      tags: [
        {
          text: "fintech",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "Example",
      description:
        "Example is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      logo,
      to: "#0",
    },
  },
  {
    type: "teaser",
    data: {
      description:
        "The most exciting company working with the creative community to create original content generation for the worlds leading brands.",
    },
  },
  {
    type: "offering",
    data: {
      roundName: "seed round",
      tags: [
        {
          text: "fintech",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "Neufund",
      description:
        "Neufund is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      logo,
      to: "#0",
    },
  },
  {
    type: "offering",
    data: {
      roundName: "seed round",
      tags: [
        {
          text: "fintech",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "XYZ Company",
      description:
        "XYZ Company is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      logo,
      to: "#0",
    },
  },
  {
    type: "offering",
    data: {
      roundName: "seed round",
      tags: [
        {
          text: "fintech",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "Example",
      description:
        "Example is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: ""
      },
      logo,
      to: "#0",
    },
  },
  {
    type: "teaser",
    data: {
      description:
        "The most exciting company working with the creative community to create original content generation for the worlds leading brands.",
    },
  },
];

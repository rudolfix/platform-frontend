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
      roundName: "series d",
      tags: [
        {
          text: "eyetech",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "Brille24 GMBH",
      description:
        "Eyewear pioneer aiming to change the way people access eye care with smart AI-applications. Founded 10 years ago, Brille24 has sold more than 2 million glasses and is currently serving one million customers.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "lorem",
        position: "ipsum",
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
      roundName: "seed",
      tags: [
        {
          text: "automotive",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "sweden",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "Uniti",
      description:
        "Swedish startup developing an electric city car. Optimised for high performance and agility in urban environments. Holistic safety, sustainability, and scalability in manufacturing. Unveiling 2017 - first deliveries 2019.",
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
      roundName: "series b",
      tags: [
        {
          text: "re-commerce",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "mySwoop",
      description:
        "Online re-commerce platform buying and selling new and used electronics. With tailored software technology, mySWOOOP automatically determines current market prices in real-time assuring attractive resale-margins.",
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
      roundName: "series a",
      tags: [
        {
          text: "iot",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "Next big thing",
      description:
        "As Europe's premier startup incubator for IOT & blockchain and Germany's chosenDigital Hub for IoT, Next Big Thing drives European innovation. NBT leverages its technological and economic ecosystem to enable disruptive business models",
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
      roundName: "series a",
      tags: [
        {
          text: "mobility",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "india",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "emflux motors",
      description:
        "Electric superbike changing the landscape of transportation & mobility. India-based venture backed by both crypto and traditional investors with a mission to power 10 million electric bikes in India by 2027.",
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
      roundName: "seed",
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
      name: "blockstate",
      description:
        "Creating products for the future of finance. BlockState builds efficient, transparent and compliant products for Asset Management, Debt Issuance and Derivatives based on Blockchain technology.",
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

import { IEtoOfferingProps } from "../components/shared/EtoOfferingCard";

import * as blockstate from "../assets/img/eto_offers/blockstate.png";
import * as brile24 from "../assets/img/eto_offers/brille24.png";
import * as emflux_motors from "../assets/img/eto_offers/emflux_motors.png";
import * as myswoop from "../assets/img/eto_offers/myswoop.png";
import * as next_big_thing from "../assets/img/eto_offers/next_big_thing.png";
import * as uniti from "../assets/img/eto_offers/uniti.gif";

export type EtoData = { data: IEtoOfferingProps };

export const etoCompaniesCards: Array<EtoData> = [
  {
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
        src: brile24,
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
    },
  },
  {
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
        src: uniti,
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
    },
  },
  {
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
        src: myswoop,
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
    },
  },
  {
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
        src: next_big_thing,
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
    },
  },
  {
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
        src: emflux_motors,
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
    },
  },
  {
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
        src: blockstate,
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
    },
  },
  {
    data: {
      tags: [
        {
          text: "community",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "banking",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "crypto",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      description:
        "Founders focused bank empowering tech and crypto. Progressive banking solutions for investors and inventors.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
      teaser: true,
    },
  },
  {
    data: {
      tags: [
        {
          text: "biotech",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      description:
        "German biotech startup introducing precision prevention with DNA healthcare applications. Featuring genome sequencing technologies.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
      teaser: true,
    },
  },
  {
    data: {
      tags: [
        {
          text: "blockchain",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      description:
        "Fintech developing solutions for transacting fiat currencies over blockchains – Smart Money. Coming to Ethereum in 2018.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
      teaser: true,
    },
  },
  {
    data: {
      tags: [
        {
          text: "energy",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      description:
        "Creating renewable energy solutions for a clean and sustainable world. Algorithm-based technology utilizing waste.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        person: "John",
        position: "founder",
      },
      topImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      quoteImage: {
        src: "",
        srcSet: "",
        alt: "",
      },
      to: "#0",
      teaser: true,
    },
  },
];

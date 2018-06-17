import * as React from "react";
import { Row, Col } from "reactstrap";
import Slider, { Settings } from "react-slick";
import { Button } from "../../../shared/Buttons";

import * as styles from "./People.module.scss";
import * as image1 from "../../../../assets/img/landing/testimonials/people/soundcloud.png";

interface IPersonInfoProps {
  imageSrc: string;
  fullName: string;
  description: string;
  link: string;
}

const people: Array<IPersonInfoProps> = [
  {
    imageSrc: image1,
    description:
      "Europe needs more innovation. When I see Neufund, it's a platform to finance innovation.",
    fullName: "Christophe Maire",
    link: "#",
  },
  {
    imageSrc: image1,
    description:
      "Europe needs more innovation. When I see Neufund, it's a platform to finance innovation.",
    fullName: "Christophe Maire",
    link: "#",
  },
  {
    imageSrc: image1,
    description:
      "Europe needs more innovation. When I see Neufund, it's a platform to finance innovation.",
    fullName: "Christophe Maire",
    link: "#",
  },
  {
    imageSrc: image1,
    description:
      "Europe needs more innovation. When I see Neufund, it's a platform to finance innovation.",
    fullName: "Christophe Maire",
    link: "#",
  },
  {
    imageSrc: image1,
    description:
      "Europe needs more innovation. When I see Neufund, it's a platform to finance innovation.",
    fullName: "Christophe Maire",
    link: "#",
  },
  {
    imageSrc: image1,
    description:
      "Europe needs more innovation. When I see Neufund, it's a platform to finance innovation.",
    fullName: "Christophe Maire",
    link: "#",
  },
  {
    imageSrc: image1,
    description:
      "Europe needs more innovation. When I see Neufund, it's a platform to finance innovation.",
    fullName: "Christophe Maire",
    link: "#",
  },
  {
    imageSrc: image1,
    description:
      "Europe needs more innovation. When I see Neufund, it's a platform to finance innovation.",
    fullName: "Christophe Maire",
    link: "#",
  },
];

const PersonBox: React.SFC<IPersonInfoProps> = ({ imageSrc, fullName, description, link }) => (
  <a href={link}>
    <img src={imageSrc} className={styles.personImage} />
    <h3>{fullName}</h3>
    <p>{description}</p>
  </a>
);

const settings: Settings = {
  dots: false,
  infinite: true,
  autoplay: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  arrows: true,
};

export const PeopleSlider: React.SFC = () => (
  <Slider {...settings}>
    {people.map((p, i) => (
      <div key={i}>
        <PersonBox {...p} />
      </div>
    ))}
  </Slider>
);

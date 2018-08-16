import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { InlineIcon } from "../../shared/InlineIcon";

import * as externalLinkIcon from "../../../assets/img/inline_icons/link_out.svg";
import * as styles from "./LinkColumns.module.scss";

interface ILink {
  title: string;
  url: string;
}

interface ICategory {
  name: string;
  links: ILink[];
}

interface IProps {
  categories: ICategory[];
}

export const LinkColumns: React.SFC<IProps> = ({ categories }) => {
  return (
    <Row className={styles.partnersAndCustomers}>
      {categories.map(({ name, links }) => (
        <Col xs={12} md={6} key={name}>
          <h4 className={styles.title}>{name}</h4>
          {links.map(({ title, url }, index) => (
            <div className={cn(styles.linkWrapper, "pt-3")} key={index}>
              <Link to={url} target="_blank" key={title}>
                {title}
                <InlineIcon svgIcon={externalLinkIcon} />
              </Link>
            </div>
          ))}
        </Col>
      ))}
    </Row>
  );
};

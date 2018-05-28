import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { InlineIcon } from "../../shared/InlineIcon";
import { PanelWhite } from "../../shared/PanelWhite";

import * as styles from "./FounderTeam.module.scss";

interface ITeamMemeberSocialProfile {
  svgIcon: string;
  url: string;
}

interface ITeamMemeber {
  name: string;
  title: string;
  bioLink: string;
  socialProfilesLinks: ITeamMemeberSocialProfile[];
  imageSrc: string;
}

interface IProps {
  teamMembers: ITeamMemeber[];
}

export const FounderTeam: React.SFC<IProps> = ({ teamMembers }) => {
  return (
    <PanelWhite>
      <Container>
        <Row>
          {teamMembers.map(({ name, title, bioLink, socialProfilesLinks, imageSrc }) => (
            <Col xs={12} md={6} key={imageSrc} className={styles.founderTeam}>
              <div className={styles.background}>
                <div className={styles.profileWrapper}>
                  <img className={styles.image} src={imageSrc} />
                  <div className={styles.textWrapper}>
                    <h4 className={styles.name}>{name}</h4>
                    <h5 className={styles.title}>{title}</h5>
                    <Link className={styles.link} to={bioLink}>
                      <FormattedMessage id="eto.dashboard.founder-team.bio" />
                    </Link>
                  </div>
                </div>
                {socialProfilesLinks.map(({ svgIcon, url }, index) => (
                  <Link to={url} key={index}>
                    <InlineIcon svgIcon={svgIcon} />
                  </Link>
                ))}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </PanelWhite>
  );
};

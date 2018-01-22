import * as React from "react";
import { NavLink } from "react-router-dom";
import { Col, Collapse, Navbar, NavbarBrand, NavbarToggler, Row } from "reactstrap";
import * as styles from "./Header.module.scss";

type IHeaderProps = IUnAuthProps | IAuthProps;

interface IUnAuthProps {
  isAuthorized: false;
}

interface IAuthProps {
  isAuthorized: true;
  name: string;
  balanceEuro: number;
  balanceNeu: number;
}

interface IHeaderState {
  isOpen: boolean;
}

interface IReducedHTML {
  className?: string;
}

interface IAuthorized {
  balanceEuro: number;
  balanceNeu: number;
  name: string;
  toggle: () => {};
  isOpen: boolean;
}

export const NeufundBrand: React.SFC<IReducedHTML> = props => {
  //TODO: change to HiResImage once a three size assets logo is provided
  const image = require("!file-loader?publicPath=/!../assets/img/" + "header/social_logo" + ".png");
  return (
    <Row>
      <img src={image} className={styles.brand} alt="" />
      <div className={`${styles.title} pl-3 align-self-center font-weight-bold ${props.className}`}>
        Neufund Platform
      </div>
    </Row>
  );
};

export const Separator: React.SFC<{}> = () => {
  return (
    <Row>
      <Col sm="12" className="d-none d-sm-block mt-2 md-2">
        <div className={styles.separator} />
      </Col>
    </Row>
  );
};

export const Authorized: React.SFC<IAuthorized> = ({
  name,
  balanceEuro,
  balanceNeu,
  toggle,
  isOpen,
}) => {
  return (
    <div>
      <Navbar expand="sm" dark className={`${styles.authorizedNavbar}`}>
        <Col sm="12" className="mt-2">
          <Row className=" d-flex justify-content-between">
            <Col lg="3">
              <NavbarBrand>
                <NeufundBrand className="text-white" />
              </NavbarBrand>
            </Col>
            <NavbarToggler onClick={toggle} data-test-id="button-toggle" />
            <Col sm="2" className="align-self-center d-none d-lg-block">
              <div className={styles.miniHeader}>Account balance</div>
              <div className={styles.text} data-test-id="eur-balance">
                nEUR {balanceEuro}
              </div>
            </Col>
            <Col sm="3" lg="2" className="align-self-center d-none d-md-block">
              <div className={styles.miniHeader}>Neumark balance</div>
              <div className={styles.text} data-test-id="neu-balance">
                NEU {balanceNeu}
              </div>
            </Col>
            <Col sm="2" className="align-self-center d-none d-lg-block">
              <div className={styles.miniHeader}>Alert</div>
              <div className={styles.text}>Fund your account</div>
            </Col>
            <Col lg="2" sm="3" className="align-self-center offset-sm-1 d-none d-sm-block">
              <Row className="d-flex justify-content-end">
                <div className={styles.text}>{name}</div>
                <Col lg="2" sm="3">
                  <i className="fa fa-lg fa-user text-white" aria-hidden="true" />
                </Col>
              </Row>
            </Col>
          </Row>
          <Separator />
          <Row>
            <Col sm="12" className="mt-2">
              <Collapse isOpen={isOpen} navbar>
                <Col className="offset-sm-1">
                  <NavLink
                    className={styles.text}
                    to="/dashboard"
                    activeClassName={`${styles.active} font-weight-bold`}
                  >
                    Dashboard
                  </NavLink>
                </Col>
                <Col>
                  <NavLink
                    className={styles.text}
                    to="/accounts"
                    activeClassName={`${styles.active} font-weight-bold`}
                  >
                    Accounts
                  </NavLink>
                </Col>
                <Col>
                  <NavLink
                    className={styles.text}
                    to="/portfolio"
                    activeClassName={`${styles.active} font-weight-bold`}
                  >
                    Portfolio
                  </NavLink>
                </Col>
                <Col sm="3">
                  <NavLink
                    className={styles.text}
                    to="/info"
                    activeClassName={`${styles.active} font-weight-bold`}
                  >
                    Public Info
                  </NavLink>
                </Col>
                <Col sm="1" className="offset-sm-1">
                  <div
                    color="link"
                    className="fa fa-lg fa-cog text-white"
                    aria-hidden="true"
                    onClick={() => {
                      alert("settings button clicked!");
                    }}
                  />
                </Col>
              </Collapse>
            </Col>
          </Row>
        </Col>
      </Navbar>
    </div>
  );
};

export const UnAuthorized: React.SFC<{}> = () => {
  return (
    <div>
      <Navbar expand="sm" className={styles.unAuthorizedNavbar}>
        <NavbarBrand>
          <NeufundBrand />
        </NavbarBrand>
      </Navbar>
    </div>
  );
};

export class Header extends React.Component<IHeaderProps, IHeaderState> {
  constructor(props: IHeaderProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  toggle(): void {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render(): React.ReactNode {
    return this.props.isAuthorized ? (
      <Authorized
        balanceEuro={this.props.balanceEuro}
        balanceNeu={this.props.balanceNeu}
        name={this.props.name}
        toggle={this.toggle.bind(this)}
        isOpen={this.state.isOpen}
      />
    ) : (
      <UnAuthorized />
    );
  }
}

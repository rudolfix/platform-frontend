import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink as reactStrapNavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Container,
  Row,
} from "reactstrap";

import * as styles from "./Header.module.scss";

interface MyComponentProps {
  isAuthorized: boolean;
}
interface MyComponentState {
  isOpen: boolean;
}

export class Header extends React.Component<MyComponentProps, MyComponentState> {
  constructor(props: MyComponentProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  notLogged() {
    return (
      <div>
        <Navbar expand className={styles.bar}>
          <NavbarBrand className={styles.brand}>
            <img src="https://neufund.org/img/social_logo.png" width="60" height="30" alt="" />
          </NavbarBrand>
          <div className={styles.text}>Neufund Platform</div>
        </Navbar>
      </div>
    );
  }
  logged() {
    return (
      <div>
        <Navbar expand className={styles.bar}>
          <NavbarBrand className={styles.brand}>
            <img src="https://neufund.org/img/social_logo.png" width="60" height="30" alt="" />
          </NavbarBrand>
          <div className={styles.text}>Your logged</div>
        </Navbar>
      </div>
    );
  }
  render() {
    console.log(this.props.isAuthorized);
    return this.props.isAuthorized ? this.logged() : this.notLogged();
  }
}

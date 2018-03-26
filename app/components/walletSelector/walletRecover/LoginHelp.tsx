import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { Button } from "../../shared/Buttons";
import { walletRoutes } from "../walletRoutes";
import { recoverRoutes } from "./recoverRoutes";

export const LoginHelp: React.SFC<void> = () => (
  <div>
    <Col className="mt-5 mb-5">
      <h2 className="font-weight-bold mx-auto text-center">Having some troubles to login?</h2>
    </Col>
    <Col md={10} className="mb-5 mt-5 offset-md-1 ">
      <h5 className="font-weight-bold mb-2">I can't find my wallet ID </h5>
      <p className=""> Please Check your email Neufund for the Login link</p>
      <div className="border-bottom pb-4" />
    </Col>
    <Col md={10} className="mb-5 mt-5 offset-md-1">
      <Row className="justify-content-between" noGutters>
        <div>
          <h5 className="font-weight-bold">I don't remember my wallet password.</h5>
          <p>
            Recover with 24 words passphrase <i className="fa fa-question" />
          </p>
        </div>
        <Col xs={12} md={4}>
          <Link to={recoverRoutes.seed}>
            <Button>Recover Wallet</Button>
          </Link>
        </Col>
      </Row>
      <div className="border-bottom pb-4" />
    </Col>
    <Col md={10} className="mt-5 mb-5 offset-md-1">
      <Row className="justify-content-between" noGutters>
        <h5 className="font-weight-bold">I've lost my Nano Ledger device. </h5>
        <Col xs={12} md={4}>
          <Link to="/">
            <Button>View Tutorial</Button>
          </Link>
        </Col>
      </Row>
    </Col>
    <Col md={12}>
      <Row className="ml-2 mt-5 pt-5 mr-2 justify-content-between align-items-center">
        <Link className="" to={walletRoutes.light}>
          <i className="fa fa-lg fa-angle-left mr-1" /> BACK
        </Link>
        <Link className="" to={recoverRoutes.help}>
          Contact for help <i className="fa fa-lg fa-angle-right ml-1" />
        </Link>
      </Row>
    </Col>
  </div>
);

//TODO: change <p> to <Navlink> once routing is done

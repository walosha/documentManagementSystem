// import 'whatwg-fetch';
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import '../../main.scss';


export default class NotFound extends Component {

  render() {
    return (
      <div className="Main">
        <Row>
          <Col s={12}>
            <Row>
              <Col s={8} className="bkg">
                <h2>Document Management System</h2>
                <p className="text">Document Management System helps you to manage your documents in an organized way. You can create a document, edit it and share it with other users. </p>
              </Col>
              <Col s={4} className="login">
                <div className=" shadow">
                <h3 className="logo"> Page Not Found </h3>
                <p className="logo">Whoops! Sorry there is nothing to see here</p>
              </div>
              </Col>

            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

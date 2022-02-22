import React, { useState, useEffect, useContext } from "react";
import {
  Col,
  Row,
  Form,
  Container,
  Button,
  Modal,
} from "@themesberg/react-bootstrap";
import { useHistory, useLocation } from "react-router";
import { TabTitle } from "../constants/generalFunctions";
import { AppContext } from "./AppContext";

export default () => {
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { fetchRequest } = useContext(AppContext);
  const history = useHistory();

  const handleChangePassword = () => {
    if (newPassword == confirmedPassword) {
      fetchRequest(
        `core/change-password/`,
        "POST",
        JSON.stringify({
          userName: localStorage.getItem("userName"),
          confirmedPassword: confirmedPassword,
        })
      )
        .then((data) => {
          if (data.message)
            alert(data.message)
          else {
            alert("Change new password successfully");
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            history.push("/sign-in");
          }
        })
        .catch((err) => alert(err));
    } else {
      alert("Confirmed password must be matched new password")
    }
  }

  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <article>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3">
          <Col className="d-block mb-2 mb-md-0">
            <h1 className="h2">Change Password</h1>
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-3">
          <Form className="row" onSubmit={(e) => handleOpenModal(e)}>
            <Col xs={12} className="mb-4">
              <Form.Group className="mb-3 col-6">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  minlength="5"
                  type="password"
                  defaultValue={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} className="mb-4">
                <Form.Group className="mb-3 col-6">
                  <Form.Label>Confirmed Password</Form.Label>
                  <Form.Control
                    minlength="5"
                    type="password"
                    defaultValue={confirmedPassword}
                    onChange={(e) => setConfirmedPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className="row">
                  <div className="col text-center">
                    <React.Fragment>
                      <Button variant="primary" className="m-1" type="submit">
                        Submit
                      </Button>
                      <Modal
                        as={Modal.Dialog}
                        centered
                        show={showModal}
                        onHide={handleCloseModal}
                      >
                        <Modal.Header>
                          <Modal.Title className="h6">Submit</Modal.Title>
                          <Button
                            variant="close"
                            aria-label="Close"
                            onClick={handleCloseModal}
                          />
                        </Modal.Header>
                        <Modal.Body>
                          <p>
                            Do you want to change new password?
                          </p>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={(e) => {
                              handleCloseModal();
                              handleChangePassword(e);
                            }}
                          >
                            Yes
                          </Button>
                          <Button
                            variant="link"
                            className="text-gray ms-auto"
                            onClick={handleCloseModal}
                          >
                            No
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </React.Fragment>
                  </div>
                </div>
            </Col>
          </Form>
        </Row>
      </Container>
    </article>
  )
};

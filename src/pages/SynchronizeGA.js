import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Col,
  Row,
  Form,
  Container,
  Button,
  Modal,
} from "@themesberg/react-bootstrap";
import { useHistory } from "react-router";
import { TabTitle } from "../constants/generalFunctions";
import { AppContext } from "./AppContext";


export default () => {  
  const {fetchRequest} = useContext(AppContext);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('2021-01-01');
  const [endDate, setEndDate] = useState((new Date()).toISOString().split('T')[0]);

  TabTitle(`Synchronize Google Analytic Data`);

  useEffect(() => {
    fetchRequest(`dimadb/get-synchronize-end-date/`, 'GET')
    .then((data) => {
      if (data !== undefined) {
        setStartDate(data.endDate);
      }
    }).catch((err) => alert(err));
  }, []);

  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {setShowModal(false)};


  const handleSynchronizeGA = (e) => {
    if (startDate < endDate) {
        fetchRequest(`dimadb/synchronize-google-analytic/?startDate=${startDate}&endDate=${endDate}`, 'GET')
        .then((data) => {
            if (data !== undefined) {
                alert("Finished synchronizing Google Analytics data")
            }
          history.go(0);
        }).catch((err) => alert(err));
    } else {
        alert("End date must be after start date")
    }
  };

  return (
    <article>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3">
          <Col className="d-block mb-2 mb-md-0">
            <h1 className="h2">Synchronize Google Analytic Data</h1>
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-3">
          <Col xs={12} className="mb-4">
          <Form className="row" onSubmit={(e) => handleOpenModal(e)}>
                <Form.Group className="mb-3 col-6">
                    <Form.Label>Date de début</Form.Label>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                        setStartDate(e.target.value);
                        }}
                        max={endDate}
                    />
                    </Form.Group>
                <Form.Group className="mb-3 col-6">
                    <Form.Label>Date de fin</Form.Label>
                    <Form.Control type="date" 
                        value={endDate}
                        onChange={(e) => {
                        setEndDate(e.target.value);
                        }}
                        min={startDate}/>
                </Form.Group>
                <div className="row">   
                    <div className="col text-center">
                        <React.Fragment>
                        <Button variant="primary" className="m-1" type="submit">
                            Synchronize
                        </Button>
                        <Modal
                            as={Modal.Dialog}
                            centered
                            show={showModal}
                            onHide={handleCloseModal}
                        >
                            <Modal.Header>
                            <Modal.Title className="h6">Synchronize</Modal.Title>
                            <Button
                                variant="close"
                                aria-label="Close"
                                onClick={handleCloseModal}
                            />
                            </Modal.Header>
                            <Modal.Body>
                            <p>Do you want to synchronize data with Google Analytics?</p>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={(e) => {
                                handleCloseModal();
                                handleSynchronizeGA(e);
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
              </Form>
          </Col>
        </Row>
      </Container>
    </article>
  );
};

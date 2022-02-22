import React, { useEffect, useState, useContext } from "react";
import { Row, Container, Form, Button } from "@themesberg/react-bootstrap";
import Chart from "./components/Chart";
import { TabTitle } from "../constants/generalFunctions";
import { AppContext } from "./AppContext";

export default () => {
  TabTitle("Data Analytics");

  const listGroupTypes = ['daily', 'weekly', 'monthly', 'yearly', 'none'];
  const {fetchRequest} = useContext(AppContext);
  const [startDate, setStartDate] = useState('2021-01-01');
  const [endDate, setEndDate] = useState((new Date()).toISOString().split('T')[0]);
  const [groupType, setGroupType] = useState('daily');
  const [charts, setCharts] = useState([]);

  const getQueryParams = () => {
    return `startDate=${startDate}&endDate=${endDate}&groupBy=${groupType}`
  }

  useEffect(() => {
    fetchRequest(`dimadb/get-reports/?${getQueryParams()}`, 'GET')
    .then((data) => {
      if (data != undefined)
        setCharts(data.reports);
    }).catch((err) => alert(err));
  }, []);

  const handleSubmitForm = (e) => {
    e.preventDefault();

    fetchRequest(`dimadb/get-reports/?${getQueryParams()}`, 'GET')
    .then((data) => {
      if (data != undefined)
        setCharts(data.reports);
    }).catch((err) => alert(err));
  }

  return (
    <article>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
          <Form className='row' onSubmit={(e) => handleSubmitForm(e)}>
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
            <Form.Group className="mb-3 col-6">
              <Form.Label>Rapports par</Form.Label>
              <Form.Control
                as="select"
                value={groupType}
                onChange={(e) => {
                  setGroupType(e.target.value);
                }}
                required
              >
                {listGroupTypes.map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Row className="d-flex justify-content-center flex-nowrap">
              <Button
                variant="primary"
                className="m-1 mb-3"
                type="submit"
                style={{ width: 200 }}
              >
                Obtenir des rapports
              </Button>
            </Row>
          </Form>
        </Row>
        <Row className="mt-3">
          {charts.map((chart, index) => (
            <Chart key={chart.random} rawChart={chart} />
          ))}
        </Row>
      </Container>
    </article>
  );
};

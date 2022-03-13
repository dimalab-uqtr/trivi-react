import React, { useState, useEffect, useContext } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Container,
  Button,
  Tab,
  Nav,
} from "@themesberg/react-bootstrap";
import ProcessTables from "./tables/ProcessTables";
import { TabTitle } from "../constants/generalFunctions";
import { AppContext } from "./AppContext";
import { itemTypeFrench } from "../constants/utils";

export default () => {
  TabTitle("Recommendation");

  const { fetchRequest } = useContext(AppContext);
  const [listRecommendLevels, setRecommendLevels] = useState({});
  const [level, setLevel] = useState("");
  const [itemType, setItemType] = useState("");
  const [recommendType, setRecommendType] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [listDomains, setListDomains] = useState([]);
  const [listItemInfos, setItemInfos] = useState({});
  const [listItems, setListItems] = useState([]);
  const [domain, setDomain] = useState("");
  const [item, setItem] = useState("");
  const [isSubmitted, setSubmit] = useState(false);
  const [listResults, setListResults] = useState([]);
  const [api, setAPI] = useState("");
  const [apiKey, setAPIKey] = useState("");
  const [embeddedFixedLinks, setembeddedFixedLinks] = useState([]);
  const [embeddedDynamicLinks, setembeddedDynamicLinks] = useState([]);

  const columns = listResults.length
    ? Object.keys(listResults[0]).map((key) => {
        return { Header: key, accessor: key };
      })
    : [];

  useEffect(() => {
    fetchRequest(`dimadb/get-recommend-info/`, "GET")
      .then((data) => {
        if (data != undefined) {
          setRecommendLevels(data.recommendLevels);
          setItemInfos(data.listItemInfos);
          setembeddedFixedLinks(data.embeddedFixedLinks);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRequest(
      `dimadb/get-recommend-api/`,
      "POST",
      JSON.stringify({
        level: level,
        itemType: itemType,
        recommendType: recommendType,
        quantity: quantity,
        domain: domain,
        itemUrl: item,
      })
    )
      .then((data) => {
        if (data != undefined) {
          if (data.items) {
            setSubmit(true);
            setListResults(data.items);
            setAPI(data.api);
            setAPIKey(data.apiKey);
            setembeddedDynamicLinks(data.embeddedDynamicLinks);
          } else {
            setSubmit(false);
          }
        }
      })
      .catch((err) => {
        setSubmit(false);
        alert(err);
      });
  };

  const handleChangeItemType = (item) => {
    if (level === "Domain") {
      if (item !== "") {
        setListDomains(listItemInfos[item]["types"]);
      } else {
        setListDomains([]);
      }
    } else if (level === "Item") {
      if (item !== "") {
        setListItems(listItemInfos[item]["items"]);
      } else {
        setListItems([]);
      }
    } else {
      setListDomains([]);
      setListItems([]);
    }

    setItemType(item);
  };

  const handleChangeRecommendLevel = (item) => {
    if (item === "Domain") {
      setItem("");
      if (itemType !== "") {
        setListDomains(listItemInfos[itemType]["types"]);
      } else {
        setListDomains([]);
      }
    } else if (item === "Item") {
      setDomain("");
      if (itemType !== "") {
        setListItems(listItemInfos[itemType]["items"]);
      } else {
        setListItems([]);
      }
    } else {
      setDomain("");
      setItem("");
      setListDomains([]);
      setListItems([]);
    }

    setLevel(item);
  };

  return (
    <product>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
          <Col className="d-block mb-4 mb-md-0">
            <h1 className="h2">Génération d'API</h1>
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-md-nowrap justify-content-center align-items-center py-4">
          <Col xs={12} className="d-block mb-4 mb-md-0">
            <Card>
              <Card.Body>
                <Tab.Container defaultActiveKey="fixedlink">
                  <Nav fill variant="pills" className="flex-column flex-sm-row">
                    <Nav.Item>
                      <Nav.Link eventKey="fixedlink" className="mb-sm-3 mb-md-0">
                        Lien fixé de recommendation intégré dans le site Web
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="dynamiclink"
                        className="mb-sm-3 mb-md-0"
                      >
                        Lien dynamique de recommendation intégré dans le site Web
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="fixedlink" className="py-4">
                      {embeddedFixedLinks.map((item, index) => (
                        <Form.Group className="mb-3 col-12" key={index}>
                          <Form.Label className="h2">
                            {item.name}
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            value={item.link}
                            rows={15}
                            readOnly
                          />
                        </Form.Group>
                      ))}
                    </Tab.Pane>
                    <Tab.Pane eventKey="dynamiclink" className="py-4">
                      <Form className="row" onSubmit={(e) => handleSubmit(e)}>
                        <Form.Group className="mb-3 col-6">
                          <Form.Label>Types d’items</Form.Label>
                          <Form.Control
                            as="select"
                            value={itemType}
                            onChange={(e) =>
                              handleChangeItemType(e.target.value)
                            }
                            required
                          >
                            <option value="">
                              Dérouler ce menu de sélection
                            </option>
                            {listItemInfos ? (
                              Object.keys(listItemInfos).map((item, index) => (
                                <option value={item} key={index}>
                                  {listItemInfos[item]["name"]}
                                </option>
                              ))
                            ) : (
                              <></>
                            )}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3 col-6">
                          <Form.Label>Niveau de recommandation</Form.Label>
                          <Form.Control
                            as="select"
                            value={level}
                            onChange={(e) =>
                              handleChangeRecommendLevel(e.target.value)
                            }
                            required
                          >
                            <option value="">
                              Dérouler ce menu de sélection
                            </option>
                            {Object.keys(listRecommendLevels).map(
                              (item, index) => (
                                <option value={item} key={index}>
                                  {item}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Form.Group>
                        {level === "Domain" ? (
                          <Form.Group className="mb-3 col-6">
                            <Form.Label>Domain</Form.Label>
                            <Form.Control
                              as="select"
                              value={domain}
                              onChange={(e) => setDomain(e.target.value)}
                              required
                            >
                              <option value="">
                                Dérouler ce menu de sélection
                              </option>
                              {listDomains.map((item, index) => (
                                <option value={item} key={index}>
                                  {item}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                        ) : (
                          <></>
                        )}
                        {level === "Item" ? (
                          <Form.Group className="mb-3 col-6">
                            <Form.Label>{itemType}</Form.Label>
                            <Form.Control
                              as="select"
                              value={item}
                              onChange={(e) => setItem(e.target.value)}
                              required
                            >
                              <option value="">
                                Dérouler ce menu de sélection
                              </option>
                              {listItems.map((item, index) => (
                                <option value={item["url"]} key={index}>
                                  {itemType === "events"
                                    ? item["event_id"] +
                                      " - " +
                                      item["event_name"]
                                    : item["product_id"] +
                                      " - " +
                                      item["product_name"]}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                        ) : (
                          <></>
                        )}
                        <Form.Group className="mb-3 col-6">
                          <Form.Label>Types de recommandation</Form.Label>
                          <Form.Control
                            as="select"
                            value={recommendType}
                            onChange={(e) => setRecommendType(e.target.value)}
                            required
                          >
                            <option value="">
                              Dérouler ce menu de sélection
                            </option>
                            {listRecommendLevels[level] ? (
                              listRecommendLevels[level].map((item, index) => (
                                <option value={item} key={index}>
                                  {item}
                                </option>
                              ))
                            ) : (
                              <></>
                            )}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3 col-6">
                          <Form.Label>Quantité</Form.Label>
                          <Form.Control
                            type="number"
                            value={quantity}
                            min={1}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Row className="d-flex flex-wrap flex-md-nowrap justify-content-center align-items-center">
                          <Col
                            xs={4}
                            className="d-flex flex-wrap flex-md-nowrap justify-content-center align-items-center"
                          >
                            <Button
                              variant="primary"
                              className="m-1"
                              type="submit"
                            >
                              Générer une API
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                      {isSubmitted ? (
                        <>
                          <Container className="px-0">
                            <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
                              <Col className="d-block mb-4 mb-md-0">
                                <h1 className="h2">Items recommandés</h1>
                              </Col>
                            </Row>
                            {columns.length ? (
                              <ProcessTables
                                columns={columns}
                                data={listResults}
                                isDelete={false}
                              />
                            ) : (
                              <></>
                            )}
                          </Container>
                          <Form>
                            {/* <Form.Group className="mb-3 col-6">
                        <Form.Label className="h2">
                          API d'intégration
                        </Form.Label>
                        <Form.Control type="text" value={api} readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3 col-6">
                        <Form.Label className="h2">
                          Clé d'API
                        </Form.Label>
                        <Form.Control type="text" value={apiKey} readOnly />
                      </Form.Group> */}
                            {embeddedDynamicLinks.map((item, index) => (
                              <Form.Group className="mb-3 col-12" key={index}>
                                <Form.Label className="h2">
                                  {item.name}
                                </Form.Label>
                                <Form.Control
                                  as="textarea"
                                  value={item.link}
                                  rows={15}
                                  readOnly
                                />
                              </Form.Group>
                            ))}
                          </Form>
                        </>
                      ) : (
                        <></>
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </product>
  );
};

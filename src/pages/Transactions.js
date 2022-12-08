import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Button,
  Card,
  Table,
  Alert,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useTransactions } from "../contexts/TransactionsContext";
import axios from "axios";
import TransactionRow from "../components/TransactionRow";
import StockAutocomplete from "../components/StockAutocomplete";

export default function Transactions() {
  const currencyRef = useRef();
  const quantityRef = useRef();
  const priceRef = useRef();
  const transactionDateRef = useRef();
  const [action, setAction] = useState("Buy");
  const [error, setError] = useState("");
  const [stockInput, setStockInput] = useState("");
  const [stockSelected, setStockSelected] = useState("");
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useAuth();
  const { transactions, saveTransaction } = useTransactions();
  const createTransaction = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const today = new Date();
      const selectedDate = new Date(transactionDateRef.current.value);
      if (!stockInput) {
        setError("Error: Invalid Stock / ETF code");
        setLoading(false);
        return;
      }
      if (priceRef.current.value === "" || priceRef.current.value <= 0) {
        setError("Error: Invalid price value");
        setLoading(false);
        return;
      }
      if (quantityRef.current.value === "" || quantityRef.current.value <= 0) {
        setError("Error: Invalid quantity");
        setLoading(false);
        return;
      }
      if (!transactionDateRef.current.value || selectedDate >= today) {
        setError("Error: Invalid transaction date");
        setLoading(false);
        return;
      }
      const transaction = {
        action,
        stock_code: stockInput,
        price: Number(priceRef.current.value),
        quantity: Number(quantityRef.current.value),
        transaction_date: transactionDateRef.current.value,
        userId: user.currentUser.uid,
      };
      await saveTransaction(transaction);
    } catch (error) {
      console.log("error at creating a transaction", error);
      setError("Failed to create a transaction.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // input same as selected
    if (stockInput === stockSelected) {
      setStockList([]);
      return;
    }
    // input is empty
    if (!stockInput) {
      currencyRef.current.value = "";
      setStockList([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      axios
        .get(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockInput}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
        )
        .then((res) => {
          setStockList(res.data.bestMatches);
          // if (res.data.bestMatches.length === 0) {
          //   setStockList([
          //     <ListGroupItem>
          //       <span>No results found</span>
          //     </ListGroupItem>,
          //   ]);
          // } else {
          //   const parseStockList = res.data.bestMatches.map((stock) => (
          //     <ListGroupItem
          //       style={{
          //         display: "flex",
          //         justifyContent: "space-between",
          //         gap: "2rem",
          //       }}
          //       onClick={() =>
          //         handleClickStock(stock["1. symbol"], stock["8. currency"])
          //       }
          //       key={stock["1. symbol"]}
          //     >
          //       <span>{stock["1. symbol"]}</span>
          //       <span style={{ color: "gray", fontSize: ".8rem" }}>
          //         {stock["2. name"]}
          //       </span>
          //     </ListGroupItem>
          //   ));
          //   setStockList(parseStockList);
          // }
        })
        .catch((e) => console.log("error at search input", e));
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [stockInput]);

  const handleClickStock = (symbol, currency) => {
    console.log("on click");
    clearTimeout(blurTimer);
    currencyRef.current.value = currency;
    setStockInput(symbol);
    setStockSelected(symbol);
    setStockList([]);
  };
  let blurTimer = null;
  return (
    <div>
      <h4 className="text-center mb-4">Add Transactions</h4>
      <Card className="mb-4">
        <Card.Body style={{ padding: 0 }}>
          <Form style={{ width: "90%", margin: "auto" }}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="signup__form-group" id="email">
              <Form.Label>Stock code</Form.Label>
              <Form.Control
                list="stockInput"
                type="text"
                value={stockInput}
                onChange={(e) => {
                  setStockInput(e.target.value);
                  setStockSelected("");
                  currencyRef.current.value = "";
                }}
                onBlur={() => {
                  blurTimer = setTimeout(function () {
                    setStockList([]);
                  }, 50);
                }}
                required
              />
              <ListGroup
                id="stockInput"
                style={{ position: "absolute", width: "90%" }}
              >
                {stockInput &&
                  stockInput.toLowerCase() !== stockSelected.toLowerCase() && (
                    <StockAutocomplete
                      stockList={stockList}
                      handleOnClick={handleClickStock}
                    />
                  )}
              </ListGroup>
            </Form.Group>
            <Form.Group className="signup__form-group" id="email">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" ref={quantityRef} required />
            </Form.Group>
            <Form.Group className="signup__form-group" id="email">
              <Form.Label>Price</Form.Label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "1rem",
                }}
              >
                <Form.Control type="number" ref={priceRef} required />
                <Form.Control
                  type="text"
                  ref={currencyRef}
                  value={currencyRef.current && currencyRef.current.value}
                  disabled
                />
              </div>
            </Form.Group>
            <Form.Group className="signup__form-group" id="email">
              <Form.Label>Transaction Type:</Form.Label>
              <Form.Check type="radio">
                <Form.Check
                  inline
                  name="action"
                  type="radio"
                  value="Buy"
                  label="Buy"
                  checked={action === "Buy"}
                  onChange={(e) => setAction(e.target.value)}
                />
                <Form.Check
                  inline
                  name="action"
                  type="radio"
                  value="Sell"
                  label="Sell"
                  checked={action === "Sell"}
                  onChange={(e) => setAction(e.target.value)}
                />
              </Form.Check>
            </Form.Group>
            <Form.Group className="signup__form-group" id="email">
              <Form.Label>Transaction Date</Form.Label>
              <Form.Control type="date" ref={transactionDateRef} required />
            </Form.Group>
            <Button
              className="my-3"
              variant="success"
              type="submit"
              onClick={(e) => createTransaction(e)}
              disabled={loading}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Stocks / ETFs</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Transaction Date</th>
            <th>Type</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {transactions.list.map((transaction, index) => (
            <TransactionRow
              key={index}
              index={index}
              transaction={transaction}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

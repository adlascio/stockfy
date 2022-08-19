import React, { useEffect, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Form,
  Button,
  Card,
  Table,
  Alert,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function Transactions() {
  const transactionsCollectionRef = collection(db, 'Transactions');
  const [transactions, setTransactions] = useState({
    list: [],
    isLoading: false,
  });
  const stockCodeRef = useRef();
  const currencyRef = useRef();

  const quantityRef = useRef();
  const priceRef = useRef();
  const transactionDateRef = useRef();
  const [action, setAction] = useState('Buy');
  const [error, setError] = useState('');
  const [stockInput, setStockInput] = useState('');
  const [stockList, setStockList] = useState([]);
  const user = useAuth();
  const createTransaction = (e) => {
    e.preventDefault();
    setTransactions({ ...transactions, isLoading: true });
    const today = new Date();
    const selectedDate = new Date(transactionDateRef.current.value);
    if (stockCodeRef.current.value === '') {
      setError('Error: Invalid Stock / ETF code');
      setTransactions({ ...transactions, isLoading: false });
      return;
    }
    if (priceRef.current.value === '' || priceRef.current.value <= 0) {
      setError('Error: Invalid price value');
      setTransactions({ ...transactions, isLoading: false });
      return;
    }
    if (quantityRef.current.value === '' || quantityRef.current.value <= 0) {
      setError('Error: Invalid quantity');
      setTransactions({ ...transactions, isLoading: false });
      return;
    }
    if (!transactionDateRef.current.value || selectedDate >= today) {
      setError('Error: Invalid transaction date');
      setTransactions({ ...transactions, isLoading: false });
      return;
    }
    const transaction = {
      action,
      stock_code: stockCodeRef.current.value,
      price: Number(priceRef.current.value),
      quantity: Number(quantityRef.current.value),
      transaction_date: transactionDateRef.current.value,
      userId: user.currentUser.uid,
    };
    console.log('transaction', transaction);
    addDoc(transactionsCollectionRef, transaction)
      .then((res) => {
        console.log('id', res.id);

        setTransactions({
          list: [...transactions.list, { ...transaction, id: res.id }],
          isLoading: false,
        });
        console.log('error', error);
        error && setError('');
      })
      .catch((err) => console.log('err', err));
    // try {
    //   const response = await addDoc(transactionsCollectionRef, transaction);
    //   console.log('response', response);
    //   // await getTransactions();
    // } catch (e) {
    //   console.log('error at adding new transaction', e);
    // }
  };

  const getTransactions = async () => {
    const data = await getDocs(transactionsCollectionRef);
    const updatedTransactionsList = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log('updatedTransactionsList', updatedTransactionsList);
    setTransactions({
      ...transactions,
      list: updatedTransactionsList,
    });
  };

  const deleteTransaction = async (index, id) => {
    try {
      const transactionDoc = doc(db, 'Transactions', id);
      await deleteDoc(transactionDoc);
      await getTransactions();
    } catch (e) {
      console.log('error at deleting transaction', e);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    if (!stockInput) {
      setStockList([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      axios
        .get(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockInput}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
        )
        .then((res) => {
          console.log('res alpha', res.data.bestMatches);
          if (res.data.bestMatches.length === 0) {
            setStockList([
              <ListGroupItem>
                <span>No results found</span>
              </ListGroupItem>,
            ]);
          } else {
            const parseStockList = res.data.bestMatches.map((stock) => (
              <ListGroupItem
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '2rem',
                }}
                onClick={() =>
                  handleClickStock(stock['1. symbol'], stock['8. currency'])
                }
                key={stock['1. symbol']}>
                <span>{stock['1. symbol']}</span>
                <span style={{ color: 'gray', fontSize: '.8rem' }}>
                  {stock['2. name']}
                </span>
              </ListGroupItem>
            ));
            setStockList(parseStockList);
          }
        })
        .catch((e) => console.log('error at search input', e));
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [stockInput]);

  const handleClickStock = (symbol, currency) => {
    currencyRef.current.value = currency;
    setStockInput(symbol);
    setStockList([]);
  };

  return (
    <div>
      <h4 className='text-center mb-4'>Add Transactions</h4>
      <Card className='mb-4'>
        <Card.Body style={{ padding: 0 }}>
          <Form style={{ width: '90%', margin: 'auto' }}>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form.Group className='signup__form-group' id='email'>
              <Form.Label>Stock code</Form.Label>
              <Form.Control
                list='stockInput'
                type='text'
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
                required
              />
              <ListGroup
                id='stockInput'
                style={{ position: 'absolute', width: '90%' }}>
                {stockList}
              </ListGroup>
            </Form.Group>
            <Form.Group className='signup__form-group' id='email'>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type='number' ref={quantityRef} required />
            </Form.Group>
            <Form.Group className='signup__form-group' id='email'>
              <Form.Label>Price</Form.Label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '1rem',
                }}>
                <Form.Control type='number' ref={priceRef} required />
                <Form.Control
                  type='text'
                  ref={currencyRef}
                  value={currencyRef.current && currencyRef.current.value}
                  disabled
                />
              </div>
            </Form.Group>
            <Form.Group className='signup__form-group' id='email'>
              <Form.Label>Transaction Type:</Form.Label>
              <Form.Check type='radio'>
                <Form.Check
                  inline
                  name='action'
                  type='radio'
                  value='Buy'
                  label='Buy'
                  checked={action === 'Buy'}
                  onChange={(e) => setAction(e.target.value)}
                />
                <Form.Check
                  inline
                  name='action'
                  type='radio'
                  value='Sell'
                  label='Sell'
                  checked={action === 'Sell'}
                  onChange={(e) => setAction(e.target.value)}
                />
              </Form.Check>
            </Form.Group>
            <Form.Group className='signup__form-group' id='email'>
              <Form.Label>Transaction Date</Form.Label>
              <Form.Control type='date' ref={transactionDateRef} required />
            </Form.Group>
            <Button
              className='my-3'
              variant='success'
              type='submit'
              onClick={(e) => createTransaction(e)}
              disabled={transactions.isLoading}>
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
            <tr key={index} className='slices__row'>
              <td>{index + 1}</td>
              <td>{transaction.stock_code}</td>
              <td>{transaction.quantity}</td>
              <td>{transaction.price}</td>
              <td>{transaction.transaction_date}</td>
              <td>{transaction.action}</td>
              <td>
                {' '}
                <i
                  className='uil uil-trash-alt'
                  onClick={() => deleteTransaction(index, transaction.id)}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

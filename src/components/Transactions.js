import React, { useEffect, useRef, useState } from 'react'
import {addDoc, collection, deleteDoc, getDocs, doc} from 'firebase/firestore'
import { db } from '../firebase';
import { Container, Form, Button, Card, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

export default function Transactions() {
  const transactionsCollectionRef = collection(db, "Transactions");
  const [transactions, setTransactions] = useState({
    list:[],
    isLoading:false
  });
  const stockCodeRef = useRef();
  const quantityRef = useRef();
  const priceRef = useRef();
  const transactionDateRef = useRef();
  const [action, setAction] = useState("Buy");
  const [error, setError] = useState("");
  const user = useAuth();
  const createTransaction = async (e) => {
    e.preventDefault();
    setTransactions({...transactions, isLoading:true})
    const today = new Date();
    const selectedDate = new Date(transactionDateRef.current.value);
    if(stockCodeRef.current.value === "") {
      setError("Error: Invalid Stock / ETF code")
      setTransactions({...transactions, isLoading:false})
      return
    }
    if(priceRef.current.value === "" || priceRef.current.value<=0) {
      setError("Error: Invalid price value")
      setTransactions({...transactions, isLoading:false})
      return
    }
    if(quantityRef.current.value === "" || quantityRef.current.value<=0) {
      setError("Error: Invalid quantity")
      setTransactions({...transactions, isLoading:false})
      return
    }
    if(selectedDate > today) {
      setError("Error: Invalid transaction date")
      setTransactions({...transactions, isLoading:false})
      return
    }
    const transaction = {
      action,
      stock_code: stockCodeRef.current.value,
      price: priceRef.current.value,
      quantity: quantityRef.current.value,
      transaction_date: transactionDateRef.current.value,
      userId: user.currentUser.uid,
    }
    console.log("transaction",transaction)
    try{
      await addDoc(transactionsCollectionRef, transaction);
      await getTransactions();
    } catch(e){
      console.log("error at adding new transaction", e);
    }
    
  }

  const getTransactions = async () => {
    const data = await getDocs(transactionsCollectionRef);
    const updatedTransactionsList = data.docs.map(doc => ({...doc.data(), id:doc.id}))
    setTransactions({
      ...transactions,
      list:updatedTransactionsList
    });
  };

  const deleteTransaction = async(index, id) => {
    try{
      const transactionDoc = doc(db, "Transactions", id);
      await deleteDoc(transactionDoc);
      await getTransactions();
    }catch(e){
      console.log("error at deleting transaction", e);
    }
  }

  useEffect(() => {
    getTransactions();
  }, [])

  return (
    <div>
      <h4 className='text-center mb-4'>Add Transactions</h4>
      <Card className='mb-4'>
        <Card.Body>
          <Form>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form.Group className='signup__form-group' id='email'>
                <Form.Label>Stock code</Form.Label>
                <Form.Control type='text' ref={stockCodeRef} required />
            </Form.Group>
            <Form.Group className='signup__form-group' id='email'>
                <Form.Label>Quantity</Form.Label>
                <Form.Control type='number' ref={quantityRef} required />
            </Form.Group>
            <Form.Group className='signup__form-group' id='email'>
                <Form.Label>Price</Form.Label>
                <Form.Control type='number' ref={priceRef} required />
            </Form.Group>
            <Form.Group className='signup__form-group' id='email'>
              <Form.Label>Transaction Type:</Form.Label>
              <Form.Check type='radio'>
                <Form.Check inline name='action' type="radio" value="Buy" label="Buy" checked={action === "Buy"} onChange={e => setAction(e.target.value)}/>
                <Form.Check inline name='action' type="radio" value="Sell" label="Sell" checked={action === "Sell"} onChange={e => setAction(e.target.value)}/>
              </Form.Check>
            </Form.Group>
            <Form.Group className='signup__form-group' id='email'>
                <Form.Label>Transaction Date</Form.Label>
                <Form.Control type='date' ref={transactionDateRef} required />
            </Form.Group>
          </Form>
          <Button className='mt-4' variant='success' type='submit' onClick={e => createTransaction(e)} disabled={transactions.isLoading}>Submit</Button>
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
            <tr key={index} className="slices__row">
              <td>{index+1}</td>
              <td>{transaction.stock_code}</td>    
              <td>{transaction.quantity}</td>    
              <td>{transaction.price}</td>    
              <td>{transaction.transaction_date}</td>    
              <td>{transaction.action}</td>
              <td> <i className="uil uil-trash-alt" onClick={() => deleteTransaction(index, transaction.id)}></i></td>
            </tr>
              ))}
            </tbody>
        </Table>    
    </div>
  )
}

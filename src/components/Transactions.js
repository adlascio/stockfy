import React, { useRef, useState } from 'react'
import {addDoc, collection} from 'firebase/firestore'
import { db } from '../firebase';
import { Container, Form, Button, Card } from 'react-bootstrap';

export default function Transactions() {
  const transactionsCollectionRef = collection(db, "Transactions");
  const stockCodeRef = useRef();
  const quantityRef = useRef();
  const priceRef = useRef();
  const transactionDateRef = useRef();
  const [action, setAction] = useState("Buy");
  const createTransaction = async (e) => {
    e.preventDefault();
    const transaction = {
      action,
      stock_code: stockCodeRef.current.value,
      price: priceRef.current.value,
      quantity: quantityRef.current.value,
      transaction_date: transactionDateRef.current.value,
    }
    try{  
      await addDoc(transactionsCollectionRef, transaction)
    } catch(e){
      console.log("error at adding new transaction", e);
    }
    
  }

  return (
    <Container>
      <h4>Add Transactions</h4>
      <Card>
        <Card.Body>
          <Form>
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
          <Button className='mt-4' variant='success' type='submit' onClick={e => createTransaction(e)}>Submit</Button>
        </Card.Body>
      </Card>     
    </Container>
  )
}

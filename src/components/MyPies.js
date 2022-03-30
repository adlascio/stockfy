import React , { useRef, useState } from 'react'
import { Container, Form, Button, Card, Table } from 'react-bootstrap';
import { db } from '../firebase';
import {addDoc, collection} from 'firebase/firestore'

export default function MyPies() {
  const nameRef = useRef();
  const stockNameRef = useRef();
  const [selectedPie, setSelectedPie] = useState();
  const [alocated, setAlocated] = useState(0);
  const [slicesArr, setSlicesArr] = useState([]);
  const [selectedOption, setSelectedOption] = useState("stocks/etfs");
  const piesCollectionRef = collection(db, "Pies");

  const increaseTarget = (e, index) => {
    let slicesArrCopy = [...slicesArr];
    slicesArrCopy[index].target += 1;
    setSlicesArr(slicesArrCopy);
    setAlocated(alocated+1);  
  }

  const decreaseTarget = (e, index) => {
    if(slicesArr[index].target === 0) return;
    let slicesArrCopy = [...slicesArr];
    slicesArrCopy[index].target -= 1;
    setSlicesArr(slicesArrCopy);
    setAlocated(alocated-1);  
  }
  
  const handleSelectedOption = (e) => {
    setSelectedOption(e.target.value);
  }

  const handleSelectPie = (e) => {
    setSelectedPie(e.target.value);
  }

  const addPie = (e) => {
    e.preventDefault();
    setSelectedPie(e.target.value);
    const newSlice = {
      name: e.target.value,
      target: 0,
      pieId: "test"
    }
    setSlicesArr([...slicesArr, newSlice]);
  }

  const addSlice = (e) => {
    e.preventDefault();
    const newSlice = {
      name: stockNameRef.current.value,
      target: 0,
      pieId:null
    }
    stockNameRef.current.value = "";
    setSlicesArr([...slicesArr, newSlice]);
  }

  const deleteSlice = (e, index) => {
    let slicesArrCopy = [...slicesArr];
    setAlocated(alocated-slicesArrCopy[index].target);
    slicesArrCopy.splice(index, 1);
    setSlicesArr(slicesArrCopy);
  }

  const createPie = async (e) => {
    e.preventDefault();
    const pie = {
      name:nameRef
    }
    try{  
      await addDoc(piesCollectionRef, pie)
    } catch(e){
      console.log("error at adding new pie", e);
    }
    
  }
  return (
    <div>
      <h3 className='text-center mb-4'>My Pies</h3>
      <Card>
        <Card.Body>
        <h4 className='text-center mb-4'>Create a new Pie</h4>
          <Form>
            <Form.Group className='signup__form-group' id='email'>
                <Form.Label>Name:</Form.Label>
                <Form.Control type='text' ref={nameRef} required />
            </Form.Group>
          </Form>
          <h4 className='text-center mb-4 mt-4'>My Slices</h4>
          <div className='slices__options'>
            <button className='slices__option' value="stocks/etfs" onClick={e => handleSelectedOption(e)}>Stocks / ETF</button>
            <button className='slices__option' value="myPies" onClick={e => handleSelectedOption(e)}>My Pies</button>
          </div>
          <Form>
            {selectedOption === "myPies"? 
              (
                <>
                  <Form.Group className='signup__form-group' id='email'>
                    <Form.Label>Add an existing pie: </Form.Label>
                    <Form.Select onChange={(e) => handleSelectPie(e)}>
                      <option>Open this select menu</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                  </Form.Group>
                  <Button className='mt-4' variant='success' type='submit' onClick={e => {if(e.target.value !== "") addPie(e)}}>Add Pie</Button>
                </>
                
              ): 
              (
                <>
                  <Form.Group className='signup__form-group' id='email'>
                    <Form.Label>Choose a stock or ETF to add:</Form.Label>
                    <Form.Control type='text' ref={stockNameRef} required />
                  </Form.Group>
                  <Button className='mt-4' variant='success' type='submit' onClick={e => addSlice(e)}>Add Stock / ETF</Button>
                </>
              )} 
          </Form>
          <p style={{float:"right"}}>Total Alocated: {alocated}/100</p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Slice</th>
                <th>Target</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {slicesArr.map((slice, index) => (
                <tr key={index} className="slices__row">
                  <td>{index+1}</td>
                  <td>{slice.name}</td>
                  <td>
                    <div className='target'>
                      <div>
                        {slice.target} %
                      </div>
                      <div className='targetHandler'>
                        <i className="uil uil-plus-circle" onClick={e =>  increaseTarget(e,index)}></i>
                        <i className="uil uil-minus-circle" onClick={e => decreaseTarget(e,index)}></i>
                      </div> 
                    </div>
                    </td>
                    <td>
                      <i className="uil uil-trash-alt" onClick={e => deleteSlice(e, index)}></i>
                    </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button className='mt-4' variant='success' type='submit' onClick={e => createPie(e)}>Create new Pie</Button>
        </Card.Body>
      </Card>  
    </div>
  )
}

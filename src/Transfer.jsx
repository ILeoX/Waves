import {Button, Container, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

const Transfer = ({transfer, changeRec, changeVal}) => {

      return (

            <Container style={{maxWidth: '550px' }} className='py-3' > 

            <h5><code>Transfer Your Tokens  </code> </h5>
            <Form style={{ padding:'5%' }} > 
            
            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label><b> Address To </b></Form.Label>
            <Form.Control type="text" onChange={changeRec} placeholder="0xDfusidussqsdsqdqdfwG44rffs..." />
                  
            </Form.Group>

            <Form.Group className="mb-3" >
            <Form.Label><b> Amount </b></Form.Label>
            <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">KGX</span>
                  <input onChange={ changeVal} type="text" className="form-control" placeholder="0.1" aria-label="amount" aria-describedby="basic-addon1"/>
                  </div>
            </Form.Group>

            <Button 
            onClick = {transfer}
            style={{backgroundColor: '#2534A1', width: '80%'}} className="my-5" type="submit">
            Send
            </Button>
            </Form>
            </Container>
      
      )
}

export default Transfer
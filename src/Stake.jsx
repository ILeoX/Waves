import {Button, Container, Navbar, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'


const Stake = ( {change, stake} ) => {
      return (
            
            <Container id="stakeSection" style={{maxWidth: '550px' }} className='py-3' > 
                  
                  <h5><code> Stake Your Tokens <em style={{color: "black", textDecoration: "underline"}}>for Rewards</em>  </code> </h5>

                  <Form style={{ padding:'5%' }} > 
                  <Form.Group className="mb-3" >
                              <Form.Label><b> Stake Amount </b></Form.Label>
                              <div className="input-group mb-3">
                              <span className="input-group-text" id="basic-addon1">KGX</span>
                              <input onChange={change} type="text" className="form-control" placeholder="0.1" aria-label="amount" aria-describedby="basic-addon1"/>
                              </div>
                        </Form.Group>

                        <Button 
                        onClick = {stake}
                        style={{backgroundColor: '#2534A1', fontSize:"90%", width: '80%'}} className="my-5" type="submit">
                        Stake
                        </Button>

                  </Form>

            </Container>
      )
}

export default Stake
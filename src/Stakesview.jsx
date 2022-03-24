import {Button, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'


const Stakesview = (props) => {


      return (
            <div> 
            <h3 style={{marginBottom: "5%"}}>Your Stakes </h3>
            <Table striped bordered hover>
            <thead>
            <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Time Since Stake</th>
                  <th>Rewards/hr (+2%)</th>
                  <th>Actions</th> 
            </tr>
            </thead>
            <tbody>
            {
                  props.array.map((item) => (
                        <tr  key={item.index}>
                              <td>{item.index + 1}</td>
                              <td>{item.amount}</td>
                              <td>{item.timeElapsed}</td>
                              <td>{item.rewards}</td>
                              <td><Button id={item.index} onClick={props.withdraw} style={{fontSize: "10px", backgroundColor: "#22242A"}}> Withdraw </Button> </td>
                              
                        </tr>
                  ))
                    }
            
            </tbody>
            </Table>
            </div>
      )
}


export default Stakesview
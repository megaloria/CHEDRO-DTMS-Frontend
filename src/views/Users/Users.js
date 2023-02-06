import React,{useState}  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button,Modal,Input } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,faRotate, faEdit} from '@fortawesome/free-solid-svg-icons'
import './Users-style.css';

function Home() {
 
    const [show, setShow] = useState(false);
 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
 
       <div class="container ">
          <div className="crud lg p-3 mb-5 mt-5 bg-body rounded"> 
          <div class="row ">
           
           <div class="col-sm-3 mt-5 mb-4 text-gred">
              <div className="search">
                <form class="form-inline">
                 <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                
                </form>
              </div>    
              </div>  
              <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-black" style={{color:"green"}}><h2><b>Details</b></h2></div>
              {/* <div class="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">
              <Button variant="primary" onClick={handleShow}>
                Add New Student
              </Button>
             </div> */}
           </div>  
            <div class="row">
                <div class="table-responsive " >
                 <table class="table table-striped table-hover ">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name </th>
                            <th>Position/Designation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr>
                            <td>1</td>
                            <td>Rual Octo</td>
                            <td>Deban Steet</td>
                            <td>
                            <a href="#" class="edit" title="Edit" data-toggle="tooltip" style={{margin:"10px"}}><FontAwesomeIcon icon={faEdit} /></a>
                            <a href="#" class="view" title="Reset" data-toggle="tooltip" style={{color:"#10ab80", margin:"10px"}}><FontAwesomeIcon icon={faRotate} /></a>
                            <a href="#" class="delete" title="Delete" data-toggle="tooltip" style={{color:"red", margin:"10px"}}><FontAwesomeIcon icon={faTrash}/></a>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Demark</td>
                            <td>City Road.13</td>
                            <td>
                            <a href="#" class="edit" title="Edit" data-toggle="tooltip" style={{margin:"10px"}}><FontAwesomeIcon icon={faEdit} /></a>
                            <a href="#" class="view" title="View" data-toggle="tooltip" style={{color:"#10ab80", margin:"10px"}}><FontAwesomeIcon icon={faRotate} /></a>
                            <a href="#" class="delete" title="Delete" data-toggle="tooltip" style={{color:"red", margin:"10px"}}><FontAwesomeIcon icon={faTrash}/></a>
                            </td>
                        </tr>
                         
 
                        <tr>
                            <td>3</td>
                            <td>Richa Deba</td>
                            <td>Ocol Str. 57</td>
                            <td>
                            <a href="#" class="edit" title="Edit" data-toggle="tooltip" style={{margin:"10px"}}><FontAwesomeIcon icon={faEdit} /></a>
                            <a href="#" class="view" title="View" data-toggle="tooltip" style={{color:"#10ab80", margin:"10px"}}><FontAwesomeIcon icon={faRotate} /></a>
                            <a href="#" class="delete" title="Delete" data-toggle="tooltip" style={{color:"red", margin:"10px"}}><FontAwesomeIcon icon={faTrash}/></a>
                            </td>
                        </tr>
 
                        <tr>
                            <td>4</td>
                            <td>James Cott</td>
                            <td>Berut Road</td>
                            <td>
                            <a href="#" class="edit" title="Edit" data-toggle="tooltip" style={{margin:"10px"}}><FontAwesomeIcon icon={faEdit} /></a>
                            <a href="#" class="view" title="View" data-toggle="tooltip" style={{color:"#10ab80", margin:"10px"}}><FontAwesomeIcon icon={faRotate} /></a>
                            <a href="#" class="delete" title="Delete" data-toggle="tooltip" style={{color:"red", margin:"10px"}}><FontAwesomeIcon icon={faTrash}/></a>
                            </td>
                        </tr>
 
 
                        <tr>
                            <td>5</td>
                            <td>Dheraj</td>
                            <td>Bulf Str. 57</td>
                            <td>
                            <a href="#" class="edit" title="Edit" data-toggle="tooltip" style={{margin:"10px"}}><FontAwesomeIcon icon={faEdit} /></a>
                            <a href="#" class="view" title="View" data-toggle="tooltip" style={{color:"#10ab80", margin:"10px"}}><FontAwesomeIcon icon={faRotate} /></a>
                            <a href="#" class="delete" title="Delete" data-toggle="tooltip" style={{color:"red", margin:"10px"}}><FontAwesomeIcon icon={faTrash}/></a>
                            </td>
                        </tr>
 
 
                        <tr>
                            <td>6</td>
                            <td>Maria James</td>
                            <td>Obere Str. 57</td>
                            <td>
                            <a href="#" class="edit" title="Edit" data-toggle="tooltip" style={{margin:"10px"}}><FontAwesomeIcon icon={faEdit} /></a>
                            <a href="#" class="view" title="View" data-toggle="tooltip" style={{color:"#10ab80", margin:"10px"}}><FontAwesomeIcon icon={faRotate} /></a>
                            <a href="#" class="delete" title="Delete" data-toggle="tooltip" style={{color:"red", margin:"10px"}}><FontAwesomeIcon icon={faTrash}/></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>   
        </div>
       </div>  
      </div>  
  );
}

export default Home;
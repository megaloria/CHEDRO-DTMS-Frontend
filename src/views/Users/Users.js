import React,{useState}  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash,faRotate, faEdit} from '@fortawesome/free-solid-svg-icons'
import {Button, Modal, Input, Form, Pagination, Row, Col} from 'react-bootstrap';
import Swal from 'sweetalert2';
import './Users-style.css';

function Home() {
 
    // EDIT CREATE
    const [show, setShow] = useState(false);
 
    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
    };

    // RESET
    const [show2, setShow2] = useState(false);
 
    const handleClose2 = () => {
        setShow2(false)
    };
    const handleShow2 = () => {
        setShow2(true)
    };

    // DELETE
    const showAlert = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
            }
          })

    };
  return (
       <div class="container fluid">
          <div className="crud bg-body rounded"> 

          <Row className= "justify-content-end mt-4 mb-3">
            <Col md="auto">
              <div className="search">
                <Form>
                    <Form className="mb-3" controlId="">
                        <Form.Control type="search" placeholder="Search" />
                    </Form>
                </Form>
              </div>
            </Col>
            <Col md="auto">
              <Button variant="primary" onClick={handleShow}>
                Add
              </Button>
             </Col> 
            </Row>

        </div>
            <div class="row">
                <div class="table-responsive " >
                 <table class="table table-striped table-hover ">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Name </th>
                            <th>Position/Designation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>  
                        <tr>
                            <td>1</td>
                            <td>User123</td>
                            <td>Rual Octo</td>
                            <td>Deban Steet</td>
                            <td>
                            <Button onClick={handleShow} variant="link"><FontAwesomeIcon icon={faEdit} className="text-primary"/></Button>
                            <Button onClick={handleShow2} variant="link"><FontAwesomeIcon icon={faRotate} className="text-success"/></Button>
                            <Button onClick={showAlert} variant="link"><FontAwesomeIcon icon={faTrash} className="text-danger"/></Button>
                            </td>
                        </tr>

                        <tr>
                            <td>2</td>
                            <td>User123</td>
                            <td>Demark</td>
                            <td>City Road.13</td>
                            <td>
                            <Button variant="link"><FontAwesomeIcon icon={faEdit} className="text-primary"/></Button>
                            <Button variant="link"><FontAwesomeIcon icon={faRotate} className="text-success"/></Button>
                            <Button onClick={showAlert} variant="link"><FontAwesomeIcon icon={faTrash} className="text-danger"/></Button>
                            </td>
                        </tr>  
 
                        <tr>
                            <td>3</td>
                            <td>User123</td>
                            <td>Richa Deba</td>
                            <td>Ocol Str. 57</td>
                            <td>
                            <Button variant="link"><FontAwesomeIcon icon={faEdit} className="text-primary"/></Button>
                            <Button variant="link"><FontAwesomeIcon icon={faRotate} className="text-success"/></Button>
                            <Button onClick={showAlert} variant="link"><FontAwesomeIcon icon={faTrash} className="text-danger"/></Button>
                            </td>
                        </tr>
 
                        <tr>
                            <td>4</td>
                            <td>User123</td>
                            <td>James Cott</td>
                            <td>Berut Road</td>
                            <td>
                            <Button variant="link"><FontAwesomeIcon icon={faEdit} className="text-primary"/></Button>
                            <Button variant="link"><FontAwesomeIcon icon={faRotate} className="text-success"/></Button>
                            <Button onClick={showAlert} variant="link"><FontAwesomeIcon icon={faTrash} className="text-danger"/></Button>
                            </td>
                        </tr>
 
                        <tr>
                            <td>5</td>
                            <td>User123</td>
                            <td>Dheraj</td>
                            <td>Bulf Str. 54</td>
                            <td>
                            <Button variant="link"><FontAwesomeIcon icon={faEdit} className="text-primary"/></Button>
                            <Button variant="link"><FontAwesomeIcon icon={faRotate} className="text-success"/></Button>
                            <Button onClick={showAlert} variant="link"><FontAwesomeIcon icon={faTrash} className="text-danger"/></Button>
                            </td>
                        </tr>
 
                        <tr>
                            <td>6</td>
                            <td>User123</td>
                            <td>Maria James</td>
                            <td>Obere Str. 76</td>
                            <td>
                            <Button variant="link"><FontAwesomeIcon icon={faEdit} className="text-primary"/></Button>
                            <Button variant="link"><FontAwesomeIcon icon={faRotate} className="text-success"/></Button>
                            <Button onClick={showAlert} variant="link"><FontAwesomeIcon icon={faTrash} className="text-danger"/></Button>
                            </td>
                        </tr>

                        <tr>
                            <td>7</td>
                            <td>User123</td>
                            <td>Khris Gray</td>
                            <td>Wellington Str. 12</td>
                            <td>
                            <Button variant="link"><FontAwesomeIcon icon={faEdit} className="text-primary"/></Button>
                            <Button variant="link"><FontAwesomeIcon icon={faRotate} className="text-success"/></Button>
                            <Button onClick={showAlert} variant="link"><FontAwesomeIcon icon={faTrash} className="text-danger"/></Button>
                            </td>
                        </tr>

                        <tr>
                            <td>8</td>
                            <td>User123</td>
                            <td>Hannah Okoro</td>
                            <td>Hayne Str. 23</td>
                            <td>
                            <Button variant="link"><FontAwesomeIcon icon={faEdit} className="text-primary"/></Button>
                            <Button variant="link"><FontAwesomeIcon icon={faRotate} className="text-success"/></Button>
                            <Button onClick={showAlert} variant="link"><FontAwesomeIcon icon={faTrash} className="text-danger"/></Button>
                            </td>
                        </tr>

                        <tr>
                            <td>9</td>
                            <td>User123</td>
                            <td>Johnson James</td>
                            <td>Okowo Str. 98</td>
                            <td>
                            <Button variant="link"><FontAwesomeIcon icon={faEdit} className="text-primary"/></Button>
                            <Button variant="link"><FontAwesomeIcon icon={faRotate} className="text-success"/></Button>
                            <Button onClick={showAlert} variant="link"><FontAwesomeIcon icon={faTrash} className="text-danger"/></Button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div>
                    <Pagination className="page">
                        <Pagination.First />
                        <Pagination.Prev />
                            <Pagination.Item>{1}</Pagination.Item>
                            <Pagination.Ellipsis />

                            <Pagination.Item>{10}</Pagination.Item>
                            <Pagination.Item>{11}</Pagination.Item>
                            <Pagination.Item active>{12}</Pagination.Item>
                            <Pagination.Item>{13}</Pagination.Item>
                            <Pagination.Item>{14}</Pagination.Item>

                            <Pagination.Ellipsis />
                            <Pagination.Item>{20}</Pagination.Item>
                        <Pagination.Next />
                        <Pagination.Last />
                    </Pagination>
                </div>

            </div>   
        </div>

    {/* <!--- Model Box EDIT ---> */}
    
    <div className="model_box">
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
        <Modal.Header closeButton>
        <Modal.Title>Create Record</Modal.Title>
        </Modal.Header>
        <Form>
            <Modal.Body>
            <Row className="margin: 40px">
            <Col>
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter Username" required/>
            </Form.Group>
            </Col>
            <Col>
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" required/>
            </Form.Group>
            </Col>
            <Col>
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Role</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option>Select Role</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>
            </Form.Group>
            </Col>
            </Row>

            <Row>
            <Col>
            <Form.Group className="mb-2" controlId="">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter First Name" required/>
            </Form.Group>
            </Col>
            <Col>
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Middle Name" />
            </Form.Group>
            </Col>
            <Col>
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Last Name" required/>
            </Form.Group>
            </Col>
            </Row>

            <Row className="justify-content-md">
            <Col >
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Prefix</Form.Label>
                <Form.Control type="text" placeholder="Prefix" required/>
            </Form.Group>
            </Col>
            <Col >
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Suffix</Form.Label>
                <Form.Control type="text" placeholder="Enter Suffix" required/>
            </Form.Group>
            </Col>
            <Col >
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Position</Form.Label>
                <Form.Control type="text" placeholder="Enter Position" required/>
            </Form.Group>
            </Col>
            </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary">
                    Create Record 
                </Button>
            </Modal.Footer>
            </Form>
        </Modal>
  
       {/* Model Box Finish */}

        //  RESET
       <div className="model_box">
        <Modal
            show={show2}
            onHide={handleClose2}
            backdrop="static"
            keyboard={false}
        >
        <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form>
            <Modal.Body>
            <Row className="margin: 40px">
            <Col >
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Password</Form.Label>
                <Form.Control type="text" placeholder="Enter Password" required/>
            </Form.Group>
           
            <Form.Group className="mb-2" controlId="">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="text" placeholder="Enter Confirm Password" required/>
            </Form.Group>
            </Col>
            </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                    Cancel
                </Button>
                <Button variant="primary">
                    Reset Password
                </Button>
            </Modal.Footer>
            </Form>
        </Modal>

       </div>  
      </div>     
      </div>

   
    
      
  );
}

  

export default Home;
import React, { useEffect, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faEdit,
    faAdd,
    faSearch
} from '@fortawesome/free-solid-svg-icons'
import {Button, Modal, Form, Table, Row, Col} from 'react-bootstrap';
import Swal from 'sweetalert2';
import './Roles-styles.css';

function Roles() {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData([
            {
                id: 1,
                division: 'Technical Division',
                description: 'Regional Director',
                level: 1,
            },
            {
                id: 2,
                division: 'Technical Division',
                description: 'Chief Administrative Officer',
                level: 2
            },
            {
                id: 3,
                division: 'Admin Division',
                description: 'Secretary',
                level: 3
            }
        ]);
    }, []);

    //VALIDATION ON ADDING RECORD
    const [validated, setValidated] = useState(false);

    const handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    //MODAL ON ADDING
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
    };

    //MODAL ON EDIT
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
            <Col>
            <h1>Roles</h1>
            </Col>
            <Col md="auto">
                <div className="search">
                        <Form className="d-flex" controlId="">
                            <Form.Control 
                            type="search" 
                            placeholder="Search" 
                            className="me-2"
                            />
                            <Button>
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                        </Form>
                </div>
            </Col>
            <Col md="auto">
              <Button variant="primary" onClick={handleShow}>
                <FontAwesomeIcon icon={faAdd} className="addIcon"/> Add
              </Button>
             </Col> 
            </Row>

        </div>
            <div class="row">
                <div class="table-responsive " >
                <Table striped bordered hover size="md">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Division</th>
                    <th>Description</th>
                    <th>Level</th>
                    <th md={1}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.id}</td>
                                <td>{row.division}</td>
                                <td>{row.description}</td>
                                <td>{row.level}</td>
                                <td style={{width: '100px'}}>
                                    <Button variant="link">
                                        <FontAwesomeIcon onClick={handleShow2} icon={faEdit} className="text-primary"/>
                                    </Button>
                                    <Button onClick={showAlert} variant="link">
                                        <FontAwesomeIcon icon={faTrash} className="text-danger"/>
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
                </Table>
            </div>   
        </div>
     

    {/* <!--- Model Box ADD ---> */}
    <div className="model_box">
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
    >
    <Modal.Header closeButton>
    <Modal.Title>Add Role</Modal.Title>
    </Modal.Header>
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
        <Row className="margin: 40px">
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter Description" required/>
            <Form.Control.Feedback type="invalid">Please enter description.</Form.Control.Feedback>
        </Form.Group>
        </Col>
        </Row>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button type="submit" variant="primary">
                Add 
            </Button>
        </Modal.Footer>
        </Form>
    </Modal>

   {/* Model Box Finish */}


   {/* <!--- Model Box EDIT ---> */}
   <div className="model_box">
    <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
    >
    <Modal.Header closeButton>
    <Modal.Title>Edit Role</Modal.Title>
    </Modal.Header>
    <Form>
        <Modal.Body>
        <Row className="margin: 40px">
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter Description" required/>
        </Form.Group>
        </Col>
        </Row>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose2}>
                Cancel
            </Button>
            <Button variant="primary">
                Done 
            </Button>
        </Modal.Footer>
        </Form>
    </Modal>

   {/* Model Box Finish */}
   </div>
   </div>
   </div>
    );
}

export default Roles;
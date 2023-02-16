import React, { useEffect, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faRotate,
    faEdit,
    faAdd
} from '@fortawesome/free-solid-svg-icons'
import {
    Button, 
    Modal, 
    Form, 
    Table, 
    Row, 
    Col
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import './DocumentTypes-styles.css';


function DocuType() {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData([
            {
                id: 1,
                code: 'DF3FDAS2',
                description: 'Regional Director'
            },
            {
                id: 2,
                code: 'SDFJS323',
                description: 'Chief Administrative Officer'
            },
            {
                id: 3,
                code: 'SAF311',
                description: 'Secretary'
            },
            {
                id: 4,
                code: 'DFS3D3',
                description: 'Assistant'
            },
        ]);
    }, []);

    //VALIDATION ON ADDING
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
            <h1>Document Types</h1>
            </Col>
            <Col md="auto">
              <div className="search">
                    <Form className="mb-3" controlId="">
                        <Form.Control type="search" placeholder="Search" />
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
                    <th>Code</th>
                    <th>Description</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.id}</td>
                                <td>{row.code}</td>
                                <td>{row.description}</td>
                                <td>
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
    <Modal.Title>Add</Modal.Title>
    </Modal.Header>
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
        <Row className="margin: 40px">
        <Col md={3}>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Code</Form.Label>
            <Form.Control type="text" placeholder="Enter Code" required/>
            <Form.Control.Feedback type="invalid">Please enter code.</Form.Control.Feedback>
        </Form.Group>
        </Col>
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
    <Modal.Title>Edit</Modal.Title>
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

export default DocuType;
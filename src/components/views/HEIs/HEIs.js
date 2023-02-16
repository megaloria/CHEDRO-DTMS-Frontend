import React, { useEffect, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
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
import './styles.css';

function Heis() {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData([
            {
                id: 1,
                uii: 122423,
                name: 'Roel Cristobal',
                address: '545, Santiago, Malvar, Batangas',
                headofins: 'Regional Director'
            },
            {
                id: 2,
                uii: 113243,
                name: 'Roel Cristobal',
                address: '123, Santiago, Malvar, Batangas',
                headofins: 'Chief Administrative Officer'
            },
            {
                id: 3,
                uii: 132423,
                name: 'Roel Cristobal',
                address: '543, Santiago, Malvar, Batangas',
                headofins: 'Secretary'
            },
            {
                id: 4,
                uii: 12513,
                name: 'Roel Cristobal',
                address: '636, Santiago, Malvar, Batangas',
                headofins: 'Assistant'
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

     //MODAL ADD
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
    };

    //MODAL EDIT
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
            <h1>HEIs</h1>
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
                    <th>UII</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Head of Institution</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.id}</td>
                                <td>{row.uii}</td>
                                <td>{row.name}</td>
                                <td>{row.address}</td>
                                <td>{row.headofins}</td>
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
        <Row>
        <Col md={3}>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>UII</Form.Label>
            <Form.Control  type="text" placeholder="Enter UII" required/>
            <Form.Control.Feedback type="invalid">Please enter UII.</Form.Control.Feedback>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Name" required/>
            <Form.Control.Feedback type="invalid">Please enter name.</Form.Control.Feedback>
        </Form.Group>
        </Col>
        </Row>

        <Row>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Streets/Barangay</Form.Label>
            <Form.Control type="text" placeholder="Streets/Barangay" required/>
            <Form.Control.Feedback type="invalid">Please enter street/barangay.</Form.Control.Feedback>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>City/Municipality</Form.Label>
            <Form.Control type="text" placeholder="Enter City/Municipality" required/>
            <Form.Control.Feedback type="invalid">Please enter city/municipality.</Form.Control.Feedback>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Province</Form.Label>
            <Form.Control type="text" placeholder="Enter Province" required/>
            <Form.Control.Feedback type="invalid">Please enter province.</Form.Control.Feedback>
        </Form.Group>
        </Col>
        </Row>

        <Row>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Head of Institution</Form.Label>
            <Form.Control type="text" placeholder="Enter Head of Institution" required/>
            <Form.Control.Feedback type="invalid">Please enter head of institution.</Form.Control.Feedback>
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
        <Row>
        <Col md={3}>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>UII</Form.Label>
            <Form.Control  type="text" placeholder="Enter UII" required/>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Name" required/>
        </Form.Group>
        </Col>
        </Row>

        <Row>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Streets/Barangay</Form.Label>
            <Form.Control type="text" placeholder="Streets/Barangay" required/>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>City/Municipality</Form.Label>
            <Form.Control type="text" placeholder="Enter City/Municipality" required/>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Province</Form.Label>
            <Form.Control type="text" placeholder="Enter Province" required/>
        </Form.Group>
        </Col>
        </Row>

        <Row>
        <Col>
        <Form.Group className="mb-2" controlId="">
            <Form.Label>Head of Institution</Form.Label>
            <Form.Control type="text" placeholder="Enter Head of Institution" required/>
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

export default Heis;
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";


const AddFarmSect = ({save}) => {

    const [name, setName] = useState("");
    const [rentPrice, setRentPrice] = useState(0);
    

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


  return (
    <>
        <Button
            onClick={handleShow}
            variant="dark"
        >
            Add Farm Section
        </Button>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>New Farm Section</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <FloatingLabel
                        controlId="inputName"
                        label="Name"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            placeholder="Enter name of farm section"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="inputRentPrice"
                        label="Rent Price"
                        className="mb-3"
                    >
                        <Form.Control
                            type="number"
                            placeholder="Enter rent price of farm section"
                            onChange={(e) => {
                                setRentPrice(e.target.value);
                            }}
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="dark"
                        onClick={() => {
                            save({
                                name,
                                rentPrice
                            });
                            handleClose();
                        }}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
  )
}

AddFarmSect.propTypes = {
    save: PropTypes.func.isRequired
}

export default AddFarmSect
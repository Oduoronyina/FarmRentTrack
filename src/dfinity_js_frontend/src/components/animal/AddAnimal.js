import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddAnimal = ({ save }) => {

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [description, setDescription] = useState("");
    
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    return (
        <>
            <Button
                onClick={handleShow}
                variant="dark"
            >
                Add Animal 
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Animal</Modal.Title>
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
                                placeholder="Enter name of animal"
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputSpecies"
                            label="Species"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter species of animal"
                                onChange={(e) => {
                                    setSpecies(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputBreed"
                            label="Breed"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter breed of animal"
                                onChange={(e) => {
                                    setBreed(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputAgeRange"
                            label="Age Range"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter age range of animal"
                                onChange={(e) => {
                                    setAgeRange(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputDescription"
                            label="Description"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="Enter description of animal"
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                save({
                                    name,
                                    ageRange,
                                    species,
                                    breed,
                                    description,
                                });
                                handleClose();
                            }}
                            disabled={!name || !species || !breed || !ageRange || !description}
                        >
                            Save
                        </Button>
                     
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

AddAnimal.propTypes = {
    save: PropTypes.func.isRequired,
};

export default AddAnimal;
import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from 'react-toastify';
import { getAnimal, updateAnimal } from '../../utils/farmRentTrack';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const UpdateAnimal = ({animalId}) => {

    const [name, setName] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [description, setDescription] = useState("");

    const isFormValid = name && ageRange && species && breed && description;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const animal = await getAnimal(animalId);
                setName(animal.name);
                setAgeRange(animal.ageRange);
                setSpecies(animal.species);
                setBreed(animal.breed);
                setDescription(animal.description);  
  
            } catch (error) {
                console.error(error);
            }
        };
  
        fetchAnimal();
    }, [animalId]);

    const Update = async () => {
        try {
            await updateAnimal({ id: animalId, name, ageRange, species, breed, description });
            toast(<NotificationSuccess text="Animal updated successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to update a Animal." />);
        }
      }
    
  

  return (
    <>
    <Button variant="primary"
        className="rounded-pill px-0"
        style={{ width: "38px", marginRight: "2px"}}
        onClick={handleShow}>
        <i className="bi bi-pencil"></i>
    </Button>

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Update Animal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Age Range</Form.Label>
                    <Form.Control type="text" placeholder="Enter Age Range" defaultValue={ageRange} onChange={(e) => setAgeRange(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Species</Form.Label>
                    <Form.Control type="text" placeholder="Enter Species" defaultValue={species} onChange={(e) => setSpecies(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Breed</Form.Label>
                    <Form.Control type="text" placeholder="Enter Breed" defaultValue={breed} onChange={(e) => setBreed(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter Description" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {
                Update();
                handleClose();
            
            }} disabled={!isFormValid}>
                Update
            </Button>
        </Modal.Footer>
    </Modal>
</>
  )
}

export default UpdateAnimal
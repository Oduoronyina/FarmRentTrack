import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import {toast} from 'react-toastify';
import { addAnimalToFarmSection, getAnimals as getAnimalsList, removeAnimalFromFarmSection } from "../../utils/farmRentTrack";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import UpdateAnimal from "./UpdateAnimal";
import DeleteAnimal from "./DeleteAnimal";


const PlaceAnimal = ({farmSectId, disabled}) => {

    const [animals, setAnimals] = useState([]);


    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const getAnimals = async () => {
        try {
            setLoading(true);
            const animals = await getAnimalsList();
            setAnimals(animals);
        } catch (error) {
            toast(<NotificationError text="Failed to fetch Animals." />);
        } finally {
            setLoading(false);
        }
    }

    const handleInsertAnimal = async (animalId) => {
        try {
            await addAnimalToFarmSection(farmSectId, animalId);
            toast(<NotificationSuccess text="Animal Placed successfully." />);

        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Animal Placement not successfully." />);
        }
    }

    const handleRemoveAnimal = async (animalId) => {
        try {
            await removeAnimalFromFarmSection(farmSectId, animalId);
            toast(<NotificationSuccess text="Animal Revoked successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Animal Revocation not successfully." />);
        }
    }

    useEffect(() => {
        getAnimals();
    }, []);
  return (
    <>
        <Button variant="primary" onClick={handleShow} disabled={!disabled}>
            Place Animal
        </Button>
    
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
            <Modal.Title>Place Animal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Age Range</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {animals.map((animal, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{animal.name}</td>
                    <td>{animal.ageRange}</td>
                    <td>{animal.species}</td>
                    <td>{animal.breed}</td>
                    <td>{animal.description}</td>

                    <td > 
                        <Button
                        variant="primary"
                        style={{marginRight: "2px"}}
                        onClick={() => handleInsertAnimal(animal.id)}
                        >
                        Place
                        </Button>
                        <Button
                        variant="danger"
                        style={{marginRight: "2px"}}
                        onClick={() => handleRemoveAnimal(animal.id)}
                        >
                        Revoke
                        </Button>
                        <UpdateAnimal animalId={animal.id} />
                        <DeleteAnimal animalId={animal.id} />

                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default PlaceAnimal
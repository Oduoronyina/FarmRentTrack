import React from 'react'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { deleteAnimal } from '../../utils/farmRentTrack';

const DeleteAnimal = ({animalId}) => {

    const discardAnimal = async () => {
        try {
            deleteAnimal(animalId).then(() => {
                toast(<NotificationSuccess text="Animal deleted successfully." />);
                window.location.reload();
            }).catch((error) => {
                toast(<NotificationError text="Failed to delete a Animal." />);
            })
        } catch (error) {
            console.log({error});
            toast.error("Failed to delete Animal");
        }

    }
  return (
    <Button variant="danger" 
    className="rounded-pill px-0"
    style={{ width: "38px", marginRight: "2px"}}
    onClick={() => {
        discardAnimal();
    }}> <i  className="bi bi-trash"></i>
    </Button>
  )
}

export default DeleteAnimal
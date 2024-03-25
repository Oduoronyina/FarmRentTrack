import React from 'react'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { deleteFarmSection } from '../../utils/farmRentTrack';

const DeleteFarmSect = ({farmSectId}) => {

    const discardFarmSect = async () => {
        try {
            deleteFarmSection(farmSectId).then(() => {
                toast(<NotificationSuccess text="Farm Section deleted successfully." />);
                window.location.reload();
            }).catch((error) => {
                toast(<NotificationError text="Failed to delete a Farm Section." />);
            })
        } catch (error) {
            console.log({error});
            toast.error("Failed to delete Farm Section");
        }

    }

  return (
    <Button variant="danger" 
    className="rounded-pill px-0"
    style={{ width: "38px" }}
    onClick={() => {
        discardFarmSect();
    }}> <i  className="bi bi-trash"></i>
    </Button>
  )
}

export default DeleteFarmSect
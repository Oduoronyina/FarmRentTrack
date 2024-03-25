import React from 'react'
import { createAnimal, createFarmSection, createRenter, getAnimals as getAnimalsList,
     getFarmSections as getFarmSectionsList, getRenters as getRentersList, rentPayFarmSection } from '../utils/farmRentTrack';
import { NotificationError, NotificationSuccess } from '../components/utils/Notifications';
import { toast } from 'react-toastify';
import AddAnimal from '../components/animal/AddAnimal';
import AddFarmSect from '../components/farmSect/AddFarmSect';
import AddRenter from '../components/renter/AddRenter';
import FarmSectCard from '../components/farmSect/FarmSectCard';
import {Row } from 'react-bootstrap';
import Loader from '../components/utils/Loader';

const Home = () => {

    const [farmSections, setFarmSections] = React.useState([]);
    const [animals, setAnimals] = React.useState([]);
    const [renters, setRenters] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    const getFarmSections = async () => {
        try {
          setLoading(true);
          const farmSections = await getFarmSectionsList();
          setFarmSections(farmSections);
        } catch (error) {
          toast(<NotificationError text="Failed to fetch Farm Sections." />);
        } finally {
          setLoading(false);
        }
      }

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

    const getRenters = async () => {
        try {
            setLoading(true);
            const renters = await getRentersList();
            setRenters(renters);
        } catch (error) {
            toast(<NotificationError text="Failed to fetch Renters." />);
        } finally {
            setLoading(false);
        }
    }



    const addRenter = async (name) => {
        try {
            setLoading(true);
            createRenter(name).then(()=>{
                getRenters();
            })
            toast(<NotificationSuccess text="Renter added successfully." />);
        } catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to create a Renter." />);
        } finally {
            setLoading(false)
        }
    }


    const addFarmSect = async (data) => {
        try {
          setLoading(true);
          const priceStr =data.rentPrice;
          data.rentPrice = parseInt(priceStr, 10) * 1000000000;
          createFarmSection(data).then(()=>{
            getFarmSections();
        })
          toast(<NotificationSuccess text="Farm Section added successfully." />);
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to create a Farm Section." />);
        } finally {
          setLoading(false)
        }
    }


    const addAnimal = async (data) => {
        try {
          setLoading(true);
          createAnimal(data).then(()=>{
            getAnimals();
        })
          toast(<NotificationSuccess text="Animal added successfully." />);
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to create a Animal." />);
        } finally {
          setLoading(false)
        }
    }


    const buy = async (id) => {
        try {
          setLoading(true);
          await rentPayFarmSection({
            id
          }).then(async (resp) => {
            await getFarmSections();
            toast(<NotificationSuccess text="Farm Section Rented successfully" />);
          });
        } catch (error) {
            console.log("error", error)
          toast(<NotificationError text="Failed to Rent Farm Section." />);
        } finally {
          setLoading(false);
        }
      };

    React.useEffect(() => {
        getFarmSections();
        getAnimals();
        getRenters();
      }, []);
  
    return (
        <>
      {!loading ? (

        <>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Farm Rent Track</h1>
                <div className="d-flex align-items-center gap-3">
                    <AddAnimal save={addAnimal} />
                    <AddFarmSect save={addFarmSect} />
                    <AddRenter save={addRenter} />
                </div>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5 mt-4">
                { farmSections.map((farmSect) => (
                    <FarmSectCard key={farmSect.id} farmSect={{...farmSect}} rent={buy} />
                ))}
            </Row>

        
        </>
        ) : (
            <Loader /> 
         )} 
        </>
    )
}

export default Home
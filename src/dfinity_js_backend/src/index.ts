import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import { Ledger, binaryAddressFromPrincipal, hexAddressFromPrincipal } from "azle/canisters/ledger";
import { v4 as uuidv4 } from "uuid";

// Define record types
const Animal = Record({
    id: text,
    name: text,
    ageRange: nat64,
    species: text,
    breed: text,
    description: text,
});

const FarmSection = Record({
    id: text,
    name: text,
    owner: Principal,
    rentPrice: nat64,
    renter: Opt(text),
    animals: Vec(Animal),
});

const FarmRenter = Record({
    id: text,
    name: text,
    renter: Principal,
});

const AnimalPayload = Record({
    name: text,
    ageRange: nat64,
    species: text,
    breed: text,
    description: text,
});

const FarmSectionPayload = Record({
    name: text,
    owner: Principal,
    rentPrice: nat64,
});

const ReserveStatus = Variant({
    PaymentPending: text,
    Completed: text
});

const Reserve = Record({
    farmSectionId: text,
    price: nat64,
    status: ReserveStatus,
    reservor: Principal,
    paid_at_block: Opt(nat64),
    memo: nat64
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text
});

// Define data storage
const animalStorage = StableBTreeMap(0, text, Animal);
const farmStorage = StableBTreeMap(1, text, FarmSection);
const renterStorage = StableBTreeMap(2, text, FarmRenter);
const persistedReserves = StableBTreeMap(3, Principal, Reserve);
const pendingReserves = StableBTreeMap(4, nat64, Reserve);

// Define constants
const TIMEOUT_PERIOD = 3600n; // reservation period in seconds

// Define the canister export
export default Canister({

    // Query functions
    getAnimals: query([], Vec(Animal), () => animalStorage.values()),
    getAnimal: query([text], Result(Animal, Message), (id) => {
        const animalOpt = animalStorage.get(id);
        return animalOpt ? Ok(animalOpt) : Err({ NotFound: `Animal with id=${id} not found` });
    }),
    getFarmSections: query([], Vec(FarmSection), () => farmStorage.values()),
    getFarmSection: query([text], Result(FarmSection, Message), (id) => {
        const farmSectionOpt = farmStorage.get(id);
        return farmSectionOpt ? Ok(farmSectionOpt) : Err({ NotFound: `Farm section with id=${id} not found` });
    }),
    getRenters: query([], Vec(FarmRenter), () => renterStorage.values()),
    getRenter: query([text], Result(FarmRenter, Message), (id) => {
        const renterOpt = renterStorage.get(id);
        return renterOpt ? Ok(renterOpt) : Err({ NotFound: `Renter with id=${id} not found` });
    }),

    // Update functions
    addAnimal: update([AnimalPayload], Result(Animal, Message), (payload) => {
        if (!payload || Object.keys(payload).length === 0) return Err({ InvalidPayload: "Invalid payload" });
        const animal = { id: uuidv4(), ...payload };
        animalStorage.insert(animal.id, animal);
        return Ok(animal);
    }),
    addFarmSection: update([FarmSectionPayload], Result(FarmSection, Message), (payload) => {
        if (!payload || Object.keys(payload).length === 0) return Err({ InvalidPayload: "Invalid payload" });
        const farmSection = { id: uuidv4(), renter: None, animals: [], ...payload };
        farmStorage.insert(farmSection.id, farmSection);
        return Ok(farmSection);
    }),
    addRenter: update([text], Result(FarmRenter, Message), (name) => {
        const renter = { id: uuidv4(), name, renter: ic.caller() };
        renterStorage.insert(renter.id, renter);
        return Ok(renter);
    }),
   // Rent a farm section
    rentFarmSection: update([text, text], Result(FarmSection, Message), (renterId, farmSectionId) => {
        const renterOpt = renterStorage.get(renterId);
        if ("None" in renterOpt) {
            return Err({ NotFound: `cannot rent farm section: renter with id=${renterId} not found` });
        }
        const farmSectionOpt = farmStorage.get(farmSectionId);
        if ("None" in farmSectionOpt) {
            return Err({ NotFound: `cannot rent farm section: farm section with id=${farmSectionId} not found` });
        }
        if (farmSectionOpt.Some.renter !== None) {
            return Err({ NotFound: `cannot rent farm section: farm section with id=${farmSectionId} already rented` });
        }
        farmSectionOpt.Some.renter = Some(renterId);
        farmStorage.insert(farmSectionId, farmSectionOpt.Some);
        return Ok(farmSectionOpt.Some);
    }),

    // Return a rented farm section
    returnFarmSection: update([text], Result(FarmSection, Message), (farmSectionId) => {
        const farmSectionOpt = farmStorage.get(farmSectionId);
        if ("None" in farmSectionOpt) {
            return Err({ NotFound: `cannot return farm section: farm section with id=${farmSectionId} not found` });
        }
        if (farmSectionOpt.Some.renter === None) {
            return Err({ NotFound: `cannot return farm section: farm section with id=${farmSectionId} not rented` });
        }
        farmSectionOpt.Some.renter = None;
        farmStorage.insert(farmSectionId, farmSectionOpt.Some);
        return Ok(farmSectionOpt.Some);
    }),

    // Update an animal
    updateAnimal: update([Animal], Result(Animal, Message), (payload) => {
        const animalOpt = animalStorage.get(payload.id);
        if ("None" in animalOpt) {
            return Err({ NotFound: `cannot update the animal: animal with id=${payload.id} not found` });
        }
        animalStorage.insert(animalOpt.Some.id, payload);
        return Ok(payload);
    }),

    // Update a farm section
    updateFarmSection: update([FarmSection], Result(FarmSection, Message), (payload) => {
        const farmSectionOpt = farmStorage.get(payload.id);
        if ("None" in farmSectionOpt) {
            return Err({ NotFound: `cannot update the farm section: farm section with id=${payload.id} not found` });
        }
        farmStorage.insert(farmSectionOpt.Some.id, payload);
        return Ok(payload);
    }),

    // Update a renter
    updateRenter: update([FarmRenter], Result(FarmRenter, Message), (payload) => {
        const renterOpt = renterStorage.get(payload.id);
        if ("None" in renterOpt) {
            return Err({ NotFound: `cannot update the renter: renter with id=${payload.id} not found` });
        }
        renterStorage.insert(renterOpt.Some.id, payload);
        return Ok(payload);
    }),

    // Delete an animal
    deleteAnimal: update([text], Result(Animal, Message), (id) => {
        const deletedAnimalOpt = animalStorage.get(id);
        if ("None" in deletedAnimalOpt) {
            return Err({ NotFound: `cannot delete the animal: animal with id=${id} not found` });
        }
        animalStorage.remove(id);
        return Ok(deletedAnimalOpt.Some);
    }),

    // Delete a farm section
    deleteFarmSection: update([text], Result(FarmSection, Message), (id) => {
        const deletedFarmSectionOpt = farmStorage.get(id);
        if ("None" in deletedFarmSectionOpt) {
            return Err({ NotFound: `cannot delete the farm section: farm section with id=${id} not found` });
        }
        farmStorage.remove(id);
        return Ok(deletedFarmSectionOpt.Some);
    }),

    // Delete a renter
    deleteRenter: update([text], Result(FarmRenter, Message), (id) => {
        const deletedRenterOpt = renterStorage.get(id);
        if ("None" in deletedRenterOpt) {
            return Err({ NotFound: `cannot delete the renter: renter with id=${id} not found` });
        }
        renterStorage.remove(id);
        return Ok(deletedRenterOpt.Some);
    }),



    //create a reserve
    createReservePaymentOrder: update([text], Result(Reserve, Message), (farmSectionId) => {
        const farmOpt = farmStorage.get(farmSectionId);
        if ("None" in farmOpt) {
            return Err({ NotFound: `cannot reserve Farm section: Farm section with id=${farmSectionId} not found` });
        }
        const farm = farmOpt.Some;
        const reserve = {
            farmSectionId: farm.id,
            price: farm.rentPrice,
            status: { PaymentPending: "PAYMENT_PENDING" },
            reservor: farm.owner,
            paid_at_block: None,
            memo: generateCorrelationId(farmSectionId)
        };
        pendingReserves.insert(reserve.memo, reserve);
        discardByTimeout(reserve.memo, TIMEOUT_PERIOD);
        return Ok(reserve);
    }
    ),

    // Complete a reserve for book
    completeReserveayment: update([Principal,text,nat64, nat64, nat64], Result(Reserve, Message), async (reservor,farmSectionId,reservePrice, block, memo) => {
        const paymentVerified = await verifyPaymentInternal(reservor,reservePrice, block, memo);
        if (!paymentVerified) {
            return Err({ NotFound: `cannot complete the reserve: cannot verify the payment, memo=${memo}` });
        }
        const pendingReserveOpt = pendingReserves.remove(memo);
        if ("None" in pendingReserveOpt) {
            return Err({ NotFound: `cannot complete the reserve: there is no pending reserve with id=${farmSectionId}` });
        }
        const reserve = pendingReserveOpt.Some;
        const updatedReserve = { ...reserve, status: { Completed: "COMPLETED" }, paid_at_block: Some(block) };
        const farmOpt = farmStorage.get(farmSectionId);
        if ("None" in farmOpt){
            throw Error(`Farm section with id=${farmSectionId} not found`)
        }
        const farm = farmOpt.Some;
        farmStorage.insert(farm.id,farm)
        persistedReserves.insert(ic.caller(), updatedReserve);
        return Ok(updatedReserve);

    }
    ),

    
     /*
        another example of a canister-to-canister communication
        here we call the `query_blocks` function on the ledger canister
        to get a single block with the given number `start`.
        The `length` parameter is set to 1 to limit the return amount of blocks.
        In this function we verify all the details about the transaction to make sure that we can mark the order as completed
    */
    verifyPayment: query([Principal, nat64, nat64, nat64], bool, async (receiver, amount, block, memo) => {
        return await verifyPaymentInternal(receiver, amount, block, memo);
    }),

    /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
    getAddressFromPrincipal: query([Principal], text, (principal) => {
        return hexAddressFromPrincipal(principal, 0);
    }),

});

/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
*/
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};

// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};


// HELPER FUNCTIONS
function generateCorrelationId(bookId: text): nat64 {
    const correlationId = `${bookId}_${ic.caller().toText()}_${ic.time()}`;
    return hash(correlationId);
};

/*
    after the order is created, we give the `delay` amount of minutes to pay for the order.
    if it's not paid during this timeframe, the order is automatically removed from the pending orders.
*/
function discardByTimeout(memo: nat64, delay: Duration) {
    ic.setTimer(delay, () => {
        const order = pendingReserves.remove(memo);
        console.log(`Reserve discarded ${order}`);
    });
};

async function verifyPaymentInternal(receiver: Principal, amount: nat64, block: nat64, memo: nat64): Promise<bool> {
    const blockData = await ic.call(icpCanister.query_blocks, { args: [{ start: block, length: 1n }] });
    const tx = blockData.blocks.find((block) => {
        if ("None" in block.transaction.operation) {
            return false;
        }
        const operation = block.transaction.operation.Some;
        const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
        const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
        return block.transaction.memo === memo &&
            hash(senderAddress) === hash(operation.Transfer?.from) &&
            hash(receiverAddress) === hash(operation.Transfer?.to) &&
            amount === operation.Transfer?.amount.e8s;
    });
    return tx ? true : false;
};

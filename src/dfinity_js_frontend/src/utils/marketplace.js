import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createProduct(product) {
  return window.canister.farmRentTrack.addProduct(product);
}

// addAnimal
export async function addAnimal(animal) {
  return window.canister.farmRentTrack.addAnimal(animal);
}

// addFarmSection
export async function addFarmSection(farmSection) {
  return window.canister.farmRentTrack.addFarmSection(farmSection);
}

// addRenter
export async function addRenter(renter) {
  return window.canister.farmRentTrack.addRenter(renter);
}


export async function getAnimals() {
  try {
    return await window.canister.farmRentTrack.getProducts();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// get Animal
export async function getAnimal(id) {
  return window.canister.farmRentTrack.getAnimal(id);
}

// getFarmSections
export async function getFarmSections() {
  return window.canister.farmRentTrack.getFarmSections();
}

// getFarmSection
export async function getFarmSection(id) {
  return window.canister.farmRentTrack.getFarmSection(id);
}

// getRenters
export async function getRenters() {
  return window.canister.farmRentTrack.getRenters();
}

// getRenter
export async function getRenter(id) {
  return window.canister.farmRentTrack.getRenter(id);
}

// rentFarmSection
export async function rentFarmSection(renterId, farmSectionId) {
  return window.canister.farmRentTrack.rentFarmSection(renterId, farmSectionId);
}

// returnFarmSection
export async function returnFarmSection(farmSectionId) {
  return window.canister.farmRentTrack.returnFarmSection(farmSectionId);
}

// updateAnimal
export async function updateAnimal(animal) {
  return window.canister.farmRentTrack.updateAnimal(animal);
}

// updateFarmSection

export async function updateFarmSection(farmSection) {
  return window.canister.farmRentTrack.updateFarmSection(farmSection);
}

// updateRenter
export async function updateRenter(renter) {
  return window.canister.farmRentTrack.updateRenter(renter);
}

// deleteAnimal
export async function deleteAnimal(id) {
  return window.canister.farmRentTrack.deleteAnimal(id);
}

// deleteFarmSection
export async function deleteFarmSection(id) {
  return window.canister.farmRentTrack.deleteFarmSection(id);
}

// deleteRenter
export async function deleteRenter(id) {
  return window.canister.farmRentTrack.deleteRenter(id);
}


// rentPayFarmSection
export async function rentPayFarmSection(farmSect) {
  const marketplaceCanister = window.canister.farmRentTrack;
  const orderResponse = await marketplaceCanister.createReservePaymentOrder(farmSect.id);
  const sellerPrincipal = Principal.from(orderResponse.Ok.reservor);
  const sellerAddress = await marketplaceCanister.getAddressFromPrincipal(sellerPrincipal);
  const block = await transferICP(sellerAddress, orderResponse.Ok.price, orderResponse.Ok.memo);
  await marketplaceCanister.completePurchase(sellerPrincipal, farmSect.id, orderResponse.Ok.price, block, orderResponse.Ok.memo);
}

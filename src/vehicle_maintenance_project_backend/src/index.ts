import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt} from 'azle';
import { v4 as uuidv4 } from 'uuid';

type Maintenance = Record<{
    id: string;
    name: string; // the name of the vechile, ex: Motorcycle 12, Car 40, etc
    typeVehicle: string; // the type of the vechile, ex: motorcycle, car, truck, bicycle, etc
    date: string;
    price: number;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
}>

type MaintenancePayload = Record<{
    name: string;
    typeVehicle: string;
    date: string;
    price: number;
}>

const maintenanceStorage = new StableBTreeMap<string, Maintenance>(0, 44, 1024);


// function to add maintenance
$update;
export function addMaintenance(payload: MaintenancePayload): Result<Maintenance, string> {
    const maintenance: Maintenance = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, ...payload };
    maintenanceStorage.insert(maintenance.id, maintenance);
    return Result.Ok(maintenance);
}


// function to get maintenances
$query;
export function getMaintenances(): Result<Vec<Maintenance>, string> {
    return Result.Ok(maintenanceStorage.values());
}


// function to get maintenance by id
$query;
export function getMaintenance(id: string): Result<Maintenance, string> {
    return match(maintenanceStorage.get(id), {
        Some: (record) => Result.Ok<Maintenance, string>(record),
        None: () => Result.Err<Maintenance, string>(`Maintenance not found`)
    });
}

// function to get maintenances by name
$query;
export function getMaintenancesByName(name: string): Result<Vec<Maintenance>, string> {
    const maintenance = maintenanceStorage.values();
    const maintenanceFilter = maintenance.filter(record => record.name === name);
    return Result.Ok(maintenanceFilter);
}

// function to get maintenances by type
$query;
export function getMaintenancesByType(typeVechile: string): Result<Vec<Maintenance>, string> {
    const maintenance = maintenanceStorage.values();
    const maintenanceFilter = maintenance.filter(record => record.typeVehicle === typeVechile);
    return Result.Ok(maintenanceFilter);
}


// function to get avarage price by name
$query;
export function getAveragePriceByName(name: string): Result<number, string> {
    const maintenance = maintenanceStorage.values();
    const maintenanceFilter = maintenance.filter(record => record.name === name);
    const totalPrice = maintenanceFilter.reduce((acc, record) => acc + record.price, 0);
    const avgPrice = totalPrice / maintenanceFilter.length;
    return Result.Ok<number, string>(avgPrice);
}

// function to get avarage price by type
$query;
export function getAveragePriceByType(typeVechile: string): Result<number, string> {
    const maintenance = maintenanceStorage.values();
    const maintenanceFilter = maintenance.filter(record => record.typeVehicle === typeVechile);
    const totalPrice = maintenanceFilter.reduce((acc, record) => acc + record.price, 0);
    const avgPrice = totalPrice / maintenanceFilter.length;
    return Result.Ok<number, string>(avgPrice);
}


// functionn to delete maintenance by id
$update;
export function deleteMaintenance(id: string): Result<Maintenance, string> {
    return match(maintenanceStorage.remove(id), {
        Some: (deletedRecord) => Result.Ok<Maintenance, string>(deletedRecord),
        None: () => Result.Err<Maintenance, string>(`Maintenance not found`)
    });
}


// function to update maintenance by id
$update;
export function updateMaintenance(id: string, payload: MaintenancePayload): Result<Maintenance, string> {
    return match(maintenanceStorage.get(id), {
        Some: (record) => {
            const updatedRecord: Maintenance = {...record, ...payload, updatedAt: Opt.Some(ic.time())};
            maintenanceStorage.insert(record.id, updatedRecord);
            return Result.Ok<Maintenance, string>(updatedRecord);
        },
        None: () => Result.Err<Maintenance, string>(`Maintenance not found`)
    });
}

$query
export function greet(name: string): string {
    return `Hello, ${name}`;
}

globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    },
};
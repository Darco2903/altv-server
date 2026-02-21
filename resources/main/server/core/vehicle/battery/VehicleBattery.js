import * as alt from "alt-server";
import Battery from "./Battery.js";

export default class VehicleBattery extends Battery {
    static #models = ["prop_battery_01", "prop_battery_02", "prop_car_battery_01"];

    static getPropModel(entity) {
        return entity.getStreamSyncedMeta("battery:propModel");
    }

    static setPropModel(entity, value) {
        entity.setStreamSyncedMeta("battery:propModel", value);
    }

    static createProp(model, pos, rot = alt.Vector3.zero) {
        return new alt.Object(model, pos, rot);
    }

    static createInVehicle(vehicle, propModel, capacity, charge) {
        VehicleBattery.setPropModel(vehicle, propModel);
        Battery.create(vehicle, capacity, charge);
    }

    static createInProp(propModel, pos, rot, capacity, charge) {
        const prop = VehicleBattery.createProp(propModel, pos, rot);
        VehicleBattery.setPropModel(prop, propModel);
        Battery.create(prop, capacity, charge);
        return prop;
    }

    static toProp(vehicle, pos, rot) {
        const propModel = VehicleBattery.getPropModel(vehicle);
        if (!propModel) {
            alt.logError(`VehicleBattery.toProp - Vehicle does not have a propModel.`);
        }
        const prop = VehicleBattery.createProp(propModel, pos, rot);
        VehicleBattery.swapEntity(vehicle, prop);
        return prop;
    }

    static toVehicle(prop, vehicle) {
        VehicleBattery.swapEntity(prop, vehicle);
        prop.destroy();
    }

    static swapEntity(oldEntity, newEntity) {
        super.swapEntity(oldEntity, newEntity);
        VehicleBattery.setPropModel(newEntity, VehicleBattery.getPropModel(oldEntity));
    }
}

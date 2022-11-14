import * as alt from 'alt-server';
import * as db from "database"
import { globalFunction } from "exports"
import { modList } from '../tables';
//import * as chat from 'chat';
//import { color } from "server-extended"

export default class Vehicle extends alt.Vehicle {

    constructor(model, pos, rot, id, owner, appearance, garage) {
        super(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z)
                
        if (!appearance) {
            this.primaryColor = 0
            this.secondaryColor = 0
        } else
            this.setAppearanceDataBase64(appearance)

        this.dbId = id
        this.modelName = model
        this.owner = owner
        this.garage = garage
        this.manualEngineControl = true
        this.modKit = +(this.modKitsCount > 0)
    }

    getAllData () {
        let data = {
            id: this.dbId,
            model: this.modelName,
        }
        console.log(Object.assign(data, this.getDataToSave()))
        console.log(data);
        return data
    }

    getDataToSave () {
        const data = {
            position: globalFunction.vectorFormat(this.pos),
            rotation: globalFunction.vectorFormat(this.rot),
            owner: this.owner,
            appearance: this.getAppearanceDataBase64(),
            garage: this.garage
        }
        return data
    }
    
    getVehMods () {
        let modData = []
        let n = modList.length
        for (let i=0 ; i<n ; i++)
            modData[i] = {mod: this.getMod(i), count: this.getModsCount(i)}
        return modData
    }

    setAllMods (data) {      // data = [[modType, modNum]]
        data.forEach(([modType, modNum]) => {
            this.setMod(modType, modNum)
        })
    }

    setAllWheels (data) {
        console.log("data:", data);
        const { typeIndex, wheelNum } = data
        this.setWheels(typeIndex, wheelNum)
    }

    toJSON (data) {
        Object.keys(data).forEach(function(key) {
            data[key] = JSON.stringify(data[key])
        })
        return data
    }

    parseJSON (data) {
        Object.keys(data).forEach(function(key) {
            data[key] = JSON.parse(data[key])
        })
        return data
    }

    register () {
        db.upsertData({ model: JSON.stringify(this.modelName) }, 'Vehicle', res => {
            this.dbId = res.id
            this.save()
            db.log(`${this.modelName} registered in database with id: ${this.dbId}`)
        })
    }

    delete () {
        db.deleteByIds(this.dbId, "Vehicle", callback => {
            //  return +(typeof(callback) != "object")
            //  if (!callback)
            //      db.log(`${this.modelName} deleted from database`)
            //  else
            //      alt.logError(`${this.modelName} has not been deleted from database\nCause:\n${callback}`)
        })
    }

    save () {
        if (!this.dbId || this.garage.inGarage)     //update only if registered and veh is out garage
            return
        const data = this.toJSON(this.getDataToSave())
        db.updatePartialData(this.dbId, data, "Vehicle", callback => {
            //  return +(typeof(callback) != "object")
            //  if (typeof(callback) == "object")
            //      db.log(`${this.modelName} saved in database`)
            //  else
            //      alt.logError(`${this.modelName} has not been saved in database\nCause:\n${callback}`)
    
        })
    }

    saveAppearance () {
        if (!this.dbId)     //update only if registered
            return
        const appearance = JSON.stringify(this.getAppearanceDataBase64())
        db.updatePartialData(this.dbId, { appearance: appearance }, "Vehicle", callback => {})
    }

}

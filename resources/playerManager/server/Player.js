import * as alt from "alt-server"
import * as db from "database"

let Player = alt.Player

alt.Vector3.prototype.dbSave = function () {
    return JSON.stringify(this.toFixed(2).toArray())
}

Player.prototype.auth = function () {      //get Player id with RSID or create an Account if not found
    db.fetchData("rsid", this.socialID, "Account", acc => {
        if (!acc) this.register()
        else this.login(acc.id)
    })
}

Player.prototype.register = function () {
    db.upsertData({name: this.name, rsid: this.socialID}, "Account", acc => {
        db.upsertData({id: acc.id}, "Character", char => {
            db.log(`[${acc.id}]|${this.name} succesfully registered!`)
            this.auth()
        })
    })
}

Player.prototype.login = function (id) {
    db.fetchData("id", id, "Character", char => {
        Object.keys(char).forEach(key => char[key] = typeof(char[key]) === "string" ? JSON.parse(char[key]) : char[key])
        this.setData(char)
    })
}

Player.prototype.setData = function (char) {
    let {id, pos, model, op} = char
    this.setSyncedMeta("id", id)
    this.model = model || alt.hash("mp_m_freemode_01")
    this.spawn(new alt.Vector3(pos || [180, -1030, 28]))
    this.visible = true
    this.health = 200
}

Player.prototype.save = function () {
    const id = this.getSyncedMeta('id')
    if (!id) return this.kick('Data sync error')
    db.updatePartialData(id, { pos: this.pos.dbSave() }, 'Character', callback => {})
}

Player.prototype.respawn = function () {
    this.spawn(this.pos)
}
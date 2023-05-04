import * as orm from "typeorm";
import config from "../config.json" assert { type: "json" };

export default new orm.EntitySchema({
    name: config.tables.vehicle,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        model: {
            type: "text",
            nullable: true,
        },
        pos: {
            type: "simple-array",
            nullable: true,
        },
        rot: {
            type: "simple-array",
            nullable: true,
        },
        owner: {
            type: "int",
            nullable: true,
        },
        appearance: {
            type: "text",
            nullable: true,
        },
        garage: {
            type: "text",
            nullable: true,
        },
    },
});

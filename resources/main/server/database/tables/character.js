import * as orm from "typeorm";
import config from "../config.json" assert { type: "json" };

export default new orm.EntitySchema({
    name: config.entities.character,
    columns: {
        id: {
            primary: true,
            generated: false,
            type: "int",
            nullable: false,
        },
        op: {
            type: "int",
            nullable: true,
        },
        pos: {
            type: "simple-array",
            nullable: true,
        },
        model: {
            type: "int",
            nullable: true,
        },
        clothes: {
            type: "int",
            nullable: true,
        },
        savedClothes: {
            type: "text",
            nullable: true,
        },
    },
});

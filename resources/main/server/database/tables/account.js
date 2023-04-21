import * as orm from "typeorm";
import config from "../config.json" assert { type: "json" };

export default new orm.EntitySchema({
    name: config.entities.account,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "text",
            nullable: false,
        },
        op: {
            type: "int",
            nullable: true,
        },
        rsid: {
            type: "text",
            nullable: false,
        },
    },
});

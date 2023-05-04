import * as orm from "typeorm";
import config from "../config.json" assert { type: "json" };

export default new orm.EntitySchema({
    name: config.tables.server,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        time: {
            type: "text",
            nullable: true,
        },
        weather: {
            type: "text",
            nullable: true,
        },
    },
});

import orm from 'typeorm';

export const Account = new orm.EntitySchema({
    name: 'Account',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'text',
            nullable: false,
        },
        rsid: {
            type: 'text',
            nullable: false,
        },
        ip: {
            type: 'text',
            nullable: false,
        },
    }
});

export const Character = new orm.EntitySchema({
    name: 'Character',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: false
        },
        op: {
            type: 'int',
            nullable: false,
        },
        position: {
            type: 'text',
            nullable: true
        },
        playerModel: {
            type: 'text',
            nullable: true
        },
        clothes: {
            type: 'text',
            nullable: true
        },
        savedClothes: {
            type: 'text',
            nullable: true
        },
    }
})

export const Vehicle = new orm.EntitySchema({
    name: 'Vehicle',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        model:{
            type:'text',
            nullable: true
        },
        position: {
            type: 'text',
            nullable: true
        },
        rotation: {
            type: 'text',
            nullable: true
        },
        owner: {
            type: 'text',
            nullable: true
        },
        appearance: {
            type: 'text',
            nullable: true
        },
        garage: {
            type: 'text',
            nullable: true
        },
        /*
        mod: {
            type: 'text',
            nullable : true
        },
        primaryColor: {
            type: 'text',
            nullable: true
        },
        secondaryColor: {
            type: 'text',
            nullable: true
        },
        */
    }
})

export const Server = new orm.EntitySchema({
    name: 'Server',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        time: {
            type: 'text',
            nullable: true
        },
        weather: {
            type: 'text',
            nullable: true
        },
    }
})
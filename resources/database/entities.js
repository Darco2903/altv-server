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
        }
    }
});

export const Character = new orm.EntitySchema({
    name: 'Character',
    columns: {
        id: {
            primary: true,
            generated: false,
            type: 'int',
            nullable: false
        },
        op: {
            type: 'int',
            nullable: true,
        },
        pos: {
            type: 'text',
            nullable: true
        },
        model: {
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
        pos: {
            type: 'text',
            nullable: true
        },
        rot: {
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
        }
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
        }
    }
})
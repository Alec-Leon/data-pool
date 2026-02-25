let characterState = {
    name: '',
    role: '',
    stats: {
        hp: '',
        wound: '',
        save: '',
        int: '',
        ref: '',
        dex: '',
        tech: '',
        char: '',
        will: '',
        luck: '',
        spd: '',
        body: '',
        emp: ''
    },
    skills: {},
    equipment: {
        weapons: [],
        gear: [],
        cyberware: []
    }
}

window.DataPool = window.DataPool || {};
window.DataPool.characterState = characterState;
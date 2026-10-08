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
        money: '',
        weapons: [],
        armor: {
            head: { name: '', sp: '', penalty: '' },
            body: { name: '', sp: '', penalty: '' },
            shield: { name: '', sp: '', penalty: '' }
        },
        ammo: [],
        gear: [],
        cyberware: {
            slots: {
                audio: { installed: false, items: [] },
                neural: { installed: false, items: [] },
                eyes: [
                    { side: "Л", installed: false, items: [] },
                    { side: "П", installed: false, items: [] }
                ],
                arms: [
                    { side: "Л", installed: false, items: [] },
                    { side: "П", installed: false, items: [] }
                ],
                legs: [
                    { side: "Л", installed: false, items: [] },
                    { side: "П", installed: false, items: [] }
                ]
            },
            groups: {
                internal: [],
                external: [],
                fashion: [],
                borgware: []
            }
        }
    }
}

window.DataPool = window.DataPool || {};
window.DataPool.characterState = characterState;

window.DataPool.initCharacterSkills = function () {
    const state = window.DataPool.characterState;
    if (Object.keys(state.skills).length) return;
    Object.keys(SKILL_GROUP_LABELS).forEach(group => {
        state.skills[group] = {};
    });
};
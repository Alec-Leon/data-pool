const PDF_EXPORT_KEYS = {
    main: {
        name: "Прозвище",
        role: {
            name: "Роль",
            "role-skill": "Ролевой навык",
            "role-level": "Ролевой навык1"
        },
        hp: {
            "hp-actual": "ПЗ",
            "hp-max": "ПЗ1"
        },
        humanity: {
            "humanity-actual": "Человечность",
            "humanity-max": "Человечность1",
        },
        wound: "Ранение",
        save: "Спас",
    },
    stats: {
        int: 'ИНТ',
        ref: 'РЕФ',
        dex: 'ЛВК',
        tech: 'ТЕХ',
        char: 'КРУТ',
        will: 'ВОЛЯ',
        luck: {
            "luck-actual": 'УДЧ1',
            "luck-max": 'УДЧ2'
        },
        spd: 'СКО',
        body: 'ТЕЛО',
        emp: {
            "emp-actual": 'ЭМП1',
            "emp-max": 'ЭМП2'
        },
    },
    skills: {
        // восприятие
        'attentiveness': 'Восприятие',
        'tracking': 'Выслеживание',
        'concentration': 'Концентрация',
        'hide-reveal-object': 'Скрытие/обнар объекта',
        'lip-reading': 'Чтение по губам',

        // физические
        'athletics': 'Атлетика',
        'acrobatics': 'Акробатика',
        'endurance': 'Выносливость',
        'stealth': 'Скрытность',
        'resistance': 'Сопр',
        'dance': 'Танец',

        // образование
        'gambling': 'Азартные игры',
        'business': 'Бизнес',
        'accounting': 'Бухгалтерия',
        'bureaucracy': 'Бюрократия',
        'desert-surviving': 'Выж в дикой местности',
        'deduction': 'Дедукция',
        'area-knowledge': {
            "area-skill-1": {
                name: "Знаток13",
                level: "Твой дом"
            },
            "area-skill-2": {
                name: "Знаток12",
                level: "Знаток1"
            },
            "area-skill-3": {
                name: "Знаток11",
                level: "Знаток2"
            }
        },
        'composition': 'Композиция',
        'criminology': 'Криминология',
        'cryptography': 'Криптография',
        'science': {
            "science-skill-1": {
                name: "Наука11",
                level: "Наука1"
            },
            "science-skill-2": {
                name: "Наука12",
                level: "Наука2"
            },
        },
        'education': 'Образование',
        'animals-treatment': 'Обращение с животными',
        'info-search': 'Поиск информации',
        'tactics': 'Тактика',
        'language': {
            //хардкод уличного слэнга
            "language-skill-street": {
                level: "Язык3"
            },
            "language-skill-1": {
                name: "Язык11",
                level: "Язык1"
            },
            "language-skill-2": {
                name: "Язык12",
                level: "Язык2"
            },
        },

        // рукопашка
        'martial-arts': 'Боевые искусства (х2)',
        'melee-weapons': 'Холодное оружие',
        'brawling': 'Драка',
        'dodge': 'Уклонение',

        // творческие
        'acting': 'Актёрское мастерство',
        'music': {
            "music-skill-1": {
                name: "Игра на инструменте 11",
                level: "Игра на инструменте1"
            },
            "music-skill-2": {
                name: "Игра на инструменте 12",
                level: "Игра на инструменте2"
            },
        },

        // рейндж боевка
        'autofire': 'Автоогонь (х2)',
        'heavy-weapons': 'Тяжёлое оружие (х2)',
        'pistols': 'Короткоствольное оружие',
        'bows': 'Стрельба из лука',
        'assault-weapons': 'Длинноствольное оружие',

        // социальное
        'style': 'Гардероб и стиль',
        'interrogation': 'Допрос',
        'streetwise': 'Опыт на улицах',
        'communication': 'Общение',
        'bribe': 'Взятничество',
        'insight': 'Проницательность',
        'trading': 'Торговля',
        'persuasion': 'Убеждение',
        'self-care': 'Уход за собой',

        // технические
        'avia-tech': 'Авиатехника',
        'car-tech': 'Автомеханика',
        'lock-picking': 'Взлом замков',
        'tech-knowledge': 'Основы техники',
        'pickpocketing': 'Карманная кража',
        'cyber-tech': 'Кибертехника',
        'photo-tech': 'Фотография/видео',
        'sea-tech': 'Судоремонт',
        'gun-tech': 'Оружейная техника',
        'paramedic': 'Парамедицина (х2)',
        'first-aid': 'Первая помощь',
        'saboteur': 'Взрывотехника (х2)',
        'falsification': 'Фальсификация',
        'art': 'Живопись/рис./скульпт',
        'electronic-security': 'Электроника/безопасность',
    },
    armor: {
        head: {
            name: "Броня Головы",
            AC: "ОС_Голова",
            penalty: "Штраф_Голова"
        },
        body: {
            name: "Броня Тела",
            AC: "ОС_Тело",
            penalty: "Штраф_Тело"
        },
        shield: {
            name: "Щит",
            AC: "ОС_Щит",
            penalty: "Штраф_Щит"
        }
    },
    weapons: {
        "weapon-1": {
            name: "Оружие 1",
            damage: "Урон1",
            speed: "СКА1",
            note: "Оружие 2"
        },
        "weapon-2": {
            name: "Оружие 3",
            damage: "Урон3",
            speed: "СКА3",
            note: "Оружие 4"
        },
        "weapon-3": {
            name: "Оружие 5",
            damage: "Урон5",
            speed: "СКА5",
            // нет заметки к 3 пушке в ПДФ
        }
    },
    equipment: {
        "names-start-id": "Текст21",
        "names-end-id": "Текст38",
        "notes-start-id": "Текст41",
        "notes-end-id": "Текст58",

        ammo: "Боеприпасы",
        money: "Деньги",
    },
    cyberware: {
        cyberaudio: {
            isChecked: "Check Box18",
            cyberaudio1: {
                name: "Текст62",
                note: "Текст65",
            },
            cyberaudio2: {
                name: "Текст63",
                note: "Текст66",
            },
            cyberaudio3: {
                name: "Текст64",
                note: "Текст67",
            },
        },
        neurallink: {
            isChecked: "Check Box21",
            neurallink1: {
                name: "Текст82",
                note: "Текст83",
            },
            neurallink2: {
                name: "Текст84",
                note: "Текст85",
            },
            neurallink3: {
                name: "Текст86",
                note: "Текст87",
            },
            neurallink4: {
                name: "Текст88",
                note: "Текст89",
            },
            neurallink5: {
                name: "Текст90",
                note: "Текст91",
            }
        },
        "cybereye-right": {
            isChecked: "Check Box16",
            "cybereye1-right": {
                name: "Текст68",
                note: "Текст71"
            },
            "cybereye2-right": {
                name: "Текст69",
                note: "Текст72"
            },
            "cybereye3-right": {
                name: "Текст70",
                note: "Текст73"
            },
        },
        "cybereye-left": {
            isChecked: "Check Box19",
            "cybereye1-left": {
                name: "Текст92",
                note: "Текст95"
            },
            "cybereye2-left": {
                name: "Текст93",
                note: "Текст96"
            },
            "cybereye3-left": {
                name: "Текст94",
                note: "Текст97"
            },
        },
        "cyberarm-right": {
            isChecked: "Check Box17",
            "cyberarm1-right": {
                name: "Текст74",
                note: "Текст75"
            },
            "cyberarm2-right": {
                name: "Текст76",
                note: "Текст77"
            },
            "cyberarm3-right": {
                name: "Текст78",
                note: "Текст79"
            },
            "cyberarm4-right": {
                name: "Текст80",
                note: "Текст81"
            },
        },
        "cyberarm-left": {
            isChecked: "Check Box20",
            "cyberarm1-left": {
                name: "Текст98",
                note: "Текст99"
            },
            "cyberarm2-left": {
                name: "Текст100",
                note: "Текст101"
            },
            "cyberarm3-left": {
                name: "Текст102",
                note: "Текст103"
            },
            "cyberarm4-left": {
                name: "Текст104",
                note: "Текст105"
            },
        },
        "cyberleg-right": {
            isChecked: "Check Box22",
            "cyberleg1-right": {
                name: "Текст106",
                note: "Текст107"
            },
            "cyberleg2-right": {
                name: "Текст108",
                note: "Текст109"
            },
            "cyberleg3-right": {
                name: "Текст110",
                note: "Текст111"
            },
        },
        "cyberleg-left": {
            isChecked: "Check Box23",
            "cyberleg1-left": {
                name: "Текст112",
                note: "Текст115"
            },
            "cyberleg2-left": {
                name: "Текст113",
                note: "Текст116"
            },
            "cyberleg3-left": {
                name: "Текст114",
                note: "Текст117"
            },
        },
        internal: {
            "internal-name-start-id": "Текст118",
            "internal-name-end-id": "Текст124",
            "internal-note-start-id": "Текст125",
            "internal-note-end-id": "Текст131",
        },
        style: {
            "style-name-start-id": "Текст146",
            "style-name-end-id": "Текст152",
            "style-note-start-id": "Текст153",
            "style-note-end-id": "Текст159",
        },
        external: {
            "external-name-start-id": "Текст132",
            "external-name-end-id": "Текст138",
            "external-note-start-id": "Текст139",
            "external-note-end-id": "Текст145",
        },
        borg: {
            "borg-name-start-id": "Текст160",
            "borg-name-end-id": "Текст166",
            "borg-note-start-id": "Текст167",
            "borg-note-end-id": "Текст173",
        }
    }
};

if (typeof window !== "undefined") {
    window.PDF_EXPORT_KEYS = PDF_EXPORT_KEYS;
}

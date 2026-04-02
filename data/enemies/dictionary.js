const STAT_LABELS = {
    hp: 'Пункты здоровья',
    wound: 'Тяжелое ранение',
    save: 'Спасбросок',
    humanity: 'Человечность',

    int: 'ИНТ',
    ref: 'РЕФ',
    dex: 'ЛВК',
    tech: 'ТЕХ',
    char: 'КРУТ',
    will: 'ВОЛЯ',
    luck: 'УДЧ',
    spd: 'СКО',
    body: 'ТЕЛО',
    emp: 'ЭМП',
};

const SKILL_GROUP_LABELS = {
    'melee-combat-skills': 'Ближний бой',
    'perception-skills': 'Восприятие',
    'range-combat-skills': 'Дальний бой',
    'educational-skills': 'Образование',
    'social-skills': 'Социальные',
    'stage-skills': 'Сценические',
    'tech-skills': 'Технические',
    'drive-skills': 'Управление',
    'physical-skills': 'Физические',
};

const SKILL_LABELS = {
    // melee
    'martial-arts': 'Боевые искусства (ЛВК)(х2)',
    'melee-weapons': 'Холодное оружие (ЛВК)',
    'brawling': 'Драка (ЛВК)',
    'dodge': 'Уклонение (ЛВК)',

    // perception
    'attentiveness': 'Восприятие (ИНТ)',
    'tracking': 'Выслеживание (ИНТ)',
    'concentration': 'Концентрация (ВОЛЯ)',
    'hide-reveal-object': 'Скрытие/обнаружение объекта (ИНТ)',
    'lip-reading': 'Чтение по губам (ИНТ)',

    // range
    'autofire': 'Автоогонь (РЕФ)(х2)',
    'heavy-weapons': 'Тяжёлое оружие (РЕФ)(х2)',
    'pistols': 'Короткоствольное оружие (РЕФ)',
    'bows': 'Луки и арбалеты (РЕФ)',
    'assault-weapons': 'Длинноствольное оружие (РЕФ)',

    // educational
    'gambling': 'Азартные игры (ИНТ)',
    'business': 'Бизнес (ИНТ)',
    'accounting': 'Бухгалтерия (ИНТ)',
    'bureaucracy': 'Бюрократия (ИНТ)',
    'desert-surviving': 'Выживание в дикой местности (ИНТ)',
    'deduction': 'Дедукция (ИНТ)',
    'area-knowledge': 'Знание района (ИНТ)',
    'composition': 'Композиция (ИНТ)',
    'criminology': 'Криминология (ИНТ)',
    'cryptography': 'Криптография (ИНТ)',
    'science': 'Наука (ИНТ)',
    'education': 'Образование (ИНТ)',
    'animals-treatment': 'Обращение с животными (ИНТ)',
    'info-search': 'Поиск информации (ИНТ)',
    'tactics': 'Тактика (ИНТ)',
    'language': 'Язык (ИНТ)',

    // social
    'style': 'Гардероб и стиль (КРУТ)',
    'interrogation': 'Допрос (КРУТ)',
    'streetwise': 'Опыт на улицах (КРУТ)',
    'communication': 'Общение (ЭМП)',
    'bribe': 'Взяточничество (КРУТ)',
    'insight': 'Проницательность (ЭМП)',
    'trading': 'Торговля (КРУТ)',
    'persuasion': 'Убеждение (КРУТ)',
    'self-care': 'Уход за собой (КРУТ)',

    // stage
    'acting': 'Актёрское мастерство (КРУТ)',
    'music': 'Игра на инструменте (ТЕХ)',

    // tech
    'avia-tech': 'Авиатехника (ТЕХ)',
    'car-tech': 'Автомеханика (ТЕХ)',
    'lock-picking': 'Взлом замков (ТЕХ)',
    'tech-knowledge': 'Основы техники (ТЕХ)',
    'pickpocketing': 'Карманная кража (ТЕХ)',
    'cyber-tech': 'Кибертехника (ТЕХ)',
    'photo-tech': 'Фотография/видео (ТЕХ)',
    'sea-tech': 'Судоремонт (ТЕХ)',
    'gun-tech': 'Оружейная техника (ТЕХ)',
    'paramedic': 'Парамедицина (ТЕХ)(х2)',
    'first-aid': 'Первая помощь (ТЕХ)',
    'saboteur': 'Взрывотехника (ТЕХ)(х2)',
    'falsification': 'Фальсификация (ТЕХ)',
    'art': 'Живопись/рисование/скульптура (ТЕХ)',
    'electronic-security': 'Электроника/Безопасность (ТЕХ)(х2)',

    // drive
    'horseback-riding': 'Верховая езда (РЕФ)',
    'driving': 'Вождение (РЕФ)',
    'piloting': 'Пилотирование (РЕФ)(х2)',
    'navigation': 'Навигация (РЕФ)',

    // physical
    'athletics': 'Атлетика (ЛВК)',
    'acrobatics': 'Акробатика (ЛВК)',
    'endurance': 'Выносливость (ВОЛЯ)',
    'stealth': 'Скрытность (ЛВК)',
    'resistance': 'Сопротивление пыткам/наркотикам (ВОЛЯ)',
    'dance': 'Танец (ЛВК)',
};

const SKILL_GROUPS = {
    'melee-combat-skills': [
        'martial-arts',
        'melee-weapons',
        'brawling',
        'dodge'
    ],
    'perception-skills': [
        'attentiveness',
        'tracking',
        'concentration',
        'hide-reveal-object',
        'lip-reading',
        'insight'
    ],
    'range-combat-skills': [
        'autofire',
        'heavy-weapons',
        'pistols',
        'bows',
        'assault-weapons'
    ],
    'educational-skills': [
        'gambling',
        'business',
        'accounting',
        'bureaucracy',
        'desert-surviving',
        'deduction',
        'area-knowledge',
        'composition',
        'criminology',
        'cryptography',
        'science',
        'education',
        'animals-treatment',
        'info-search',
        'tactics',
        'language'
    ],
    'social-skills': [
        'style',
        'interrogation',
        'streetwise',
        'communication',
        'bribe',
        'insight',
        'trading',
        'persuasion',
        'self-care'
    ],
    'stage-skills': [
        'acting',
        'music'
    ],
    'tech-skills': [
        'avia-tech',
        'car-tech',
        'lock-picking',
        'tech-knowledge',
        'pickpocketing',
        'cyber-tech',
        'photo-tech',
        'sea-tech',
        'gun-tech',
        'paramedic',
        'first-aid',
        'saboteur',
        'falsification',
        'art',
        'electronic-security'
    ],
    'drive-skills': [
        'horseback-riding',
        'driving',
        'piloting',
        'navigation'
    ],
    'physical-skills': [
        'athletics',
        'acrobatics',
        'endurance',
        'stealth',
        'resistance',
        'dance'
    ]
};

const MULTI_SKILLS = [
    {
        "skill-name": "martial-arts",
        "fields": 0
    },
    {
        "skill-name": "area-knowledge",
        "fields": 3
    },
    {
        "skill-name": "science",
        "fields": 2
    },
    {
        "skill-name": "language",
        "fields": 3
    },
    {
        "skill-name": "music",
        "fields": 2
    }
];

function getMultiSkillFieldCount(skillKey) {
    const row = MULTI_SKILLS.find(
        r => r["skill-name"] === skillKey || r.skillName === skillKey
    );
    if (!row) return 0;
    const n = Number(row.fields);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

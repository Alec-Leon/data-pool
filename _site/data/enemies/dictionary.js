const STAT_LABELS = {
    hp: 'Пункты здоровья',
    wound: 'Порог ранения',
    save: 'Спасбросок',

    int: 'ИНТ',
    ref: 'РЕА',
    dex: 'ЛВК',
    tech: 'ТЕХ',
    char: 'ХАР',
    will: 'ВОЛЯ',
    luck: 'УДЧ',
    spd: 'СКО',
    body: 'ТЕЛ',
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
    'martial-arts': 'Боевые искусства',
    'melee-weapons': 'Холодное оружие',
    'brawling': 'Рукопашный бой',
    'dodge': 'Уклонение',

    // perception
    'attentiveness': 'Внимательность',
    'tracking': 'Слежка',
    'concentration': 'Концентрация',
    'hide-reveal-object': 'Скрыть/обнаружить',
    'lip-reading': 'Чтение по губам',

    // range
    'autofire': 'Автоогонь',
    'heavy-weapons': 'Тяжёлое оружие',
    'pistols': 'Пистолеты',
    'bows': 'Луки',
    'assault-weapons': 'Штурмовое оружие',

    // educational
    'gambling': 'Азартные игры',
    'business': 'Бизнес',
    'accounting': 'Бухгалтерия',
    'bureaucracy': 'Бюрократия',
    'desert-surviving': 'Выживание в пустыне',
    'deduction': 'Дедукция',
    'area-knowledge': 'Знание местности',
    'composition': 'Композиция',
    'criminology': 'Криминология',
    'cryptography': 'Криптография',
    'science': 'Наука',
    'education': 'Образование',
    'animals-treatment': 'Уход за животными',
    'info-search': 'Поиск информации',
    'tactics': 'Тактика',
    'language': 'Язык',

    // social
    'style': 'Стиль',
    'interrogation': 'Допрос',
    'streetwise': 'Знание улиц',
    'communication': 'Коммуникация',
    'bribe': 'Подкуп',
    'insight': 'Проницательность',
    'trading': 'Торговля',
    'persuasion': 'Убеждение',
    'self-care': 'Самообслуживание',

    // stage
    'acting': 'Актёрское мастерство',
    'music': 'Музыка',

    // tech
    'avia-tech': 'Авиационная техника',
    'car-tech': 'Автомеханика',
    'lock-picking': 'Взлом замков',
    'tech-knowledge': 'Технические знания',
    'pickpocketing': 'Карманные кражи',
    'cyber-tech': 'Кибертехника',
    'photo-tech': 'Фототехника',
    'sea-tech': 'Морская техника',
    'gun-tech': 'Оружейник',
    'paramedic': 'Парамедик',
    'first-aid': 'Первая помощь',
    'saboteur': 'Саботаж',
    'falsification': 'Подделка',
    'art': 'Искусство',
    'electronic-security': 'Электронная безопасность',

    // drive
    'horseback-riding': 'Верховая езда',
    'driving': 'Вождение',
    'piloting': 'Пилотирование',
    'navigation': 'Навигация',

    // physical
    'athletics': 'Атлетика',
    'acrobatics': 'Акробатика',
    'endurance': 'Выносливость',
    'stealth': 'Скрытность',
    'resistance': 'Сопротивление пыткам/наркотикам',
    'dance': 'Танец',
};
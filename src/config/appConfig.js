// src/config/appConfig.js

export const APP_CONFIG = {
    // 🎯 Ағымдағы тақырып (осыны өзгертесіз)
    theme: 'ktz_freight',

    // 📋 Тақырып конфигурациялары
    themes: {
        // ===== 🚂 KTZ ТАҚЫРЫПТАРЫ =====

        ktz_freight: {
            appName: '404 Found KTZ Freight',
            appDescription: 'Темір жол жүк логистикасы',
            itemName: 'Жүк',
            itemNamePlural: 'Жүктер',
            itemField: 'Жүк атауы',
            itemField2: 'Маршрут',
            valueField: 'Салмағы (т)',
            valueUnit: 'т',
            valueLabel: 'Жалпы салмақ',           // ✅ ЖАҢА
            categoryField: 'Вагон',
            aiPrompt: `Сіз KTZ темір жол жүк AI ассистентісіз.

Сіздің міндетіңіз:
1. Жүктерді талдау
2. Маршруттарды оңтайландыру
3. Шығындарды азайту
4. Болжау жасау
5. Есеп дайындау

Жауап форматы:
- Қысқа талдау
- Нақты ұсыныс
- Күтілетін нәтиже
- Болжау (мүмкін болса)

Қазақ тілінде, кәсіби, нақты жауап беріңіз.`,
            initialItems: [
                { title: 'Астық', description: 'Астана → Алматы', value: 60, category: 'Вагон #47' },
                { title: 'Көмір', description: 'Қарағанды → Шымкент', value: 70, category: 'Вагон #52' },
                { title: 'Мұнай', description: 'Атырау → Ақтау', value: 65, category: 'Вагон #38' },
            ],
        },

        ktz_passenger: {
            appName: '404 Found KTZ Passenger',
            appDescription: 'Жолаушы тасымалы',
            itemName: 'Рейс',
            itemNamePlural: 'Рейстер',
            itemField: 'Рейс атауы',
            itemField2: 'Бағыт',
            valueField: 'Жолаушы саны',
            valueUnit: 'адам',
            valueLabel: 'Жалпы жолаушы',          // ✅ ЖАҢА
            categoryField: 'Пойыз',
            aiPrompt: `Сіз KTZ жолаушы тасымалы AI ассистентісіз.

Сіздің міндетіңіз:
1. Рейстерді талдау
2. Жолаушы ағынын болжау
3. Кестені оңтайландыру
4. Билет бағасын ұсыну
5. Есеп дайындау

Қазақ тілінде, кәсіби жауап беріңіз.`,
            initialItems: [
                { title: 'Астана → Алматы', description: 'Тальго', value: 250, category: 'Пойыз #01' },
                { title: 'Алматы → Шымкент', description: 'Жедел', value: 180, category: 'Пойыз #15' },
                { title: 'Астана → Ақтөбе', description: 'Жай', value: 120, category: 'Пойыз #23' },
            ],
        },

        ktz_infrastructure: {
            appName: '404 Found KTZ Infrastructure',
            appDescription: 'Инфрақұрылым басқару',
            itemName: 'Учаске',
            itemNamePlural: 'Учаскелер',
            itemField: 'Учаске атауы',
            itemField2: 'Жағдайы',
            valueField: 'Ұзындығы (км)',
            valueUnit: 'км',
            valueLabel: 'Жалпы ұзындық',          // ✅ ЖАҢА
            categoryField: 'Бригада',
            aiPrompt: `Сіз KTZ инфрақұрылым AI ассистентісіз.

Сіздің міндетіңіз:
1. Жол учаскелерін талдау
2. Жөндеу басымдығын анықтау
3. Бригадаларды бөлу
4. Шығынды есептеу
5. Жөндеу кестесін ұсыну

Қазақ тілінде, кәсіби жауап беріңіз.`,
            initialItems: [
                { title: 'Астана - Қарағанды', description: 'Жақсы', value: 220, category: 'Бригада #1' },
                { title: 'Алматы - Шымкент', description: 'Жөндеу керек', value: 680, category: 'Бригада #3' },
                { title: 'Ақтөбе - Орал', description: 'Орташа', value: 450, category: 'Бригада #2' },
            ],
        },

        ktz_safety: {
            appName: '404 Found KTZ Safety',
            appDescription: 'Қауіпсіздік жүйесі',
            itemName: 'Оқиға',
            itemNamePlural: 'Оқиғалар',
            itemField: 'Оқиға түрі',
            itemField2: 'Орны',
            valueField: 'Қауіп деңгейі',
            valueUnit: 'деңгей',
            valueLabel: 'Жалпы қауіп',            // ✅ ЖАҢА
            categoryField: 'Учаске',
            aiPrompt: `Сіз KTZ қауіпсіздік AI ассистентісіз.

Сіздің міндетіңіз:
1. Оқиғаларды талдау
2. Қауіп деңгейін бағалау
3. Алдын алу шараларын ұсыну
4. Тәуекелді болжау
5. Есеп дайындау

Қазақ тілінде, кәсіби жауап беріңіз.`,
            initialItems: [
                { title: 'Жол ақауы', description: 'Астана', value: 3, category: 'Учаске #47' },
                { title: 'Сигнал қатесі', description: 'Шымкент', value: 2, category: 'Учаске #52' },
                { title: 'Кідіріс', description: 'Қарағанды', value: 1, category: 'Учаске #38' },
            ],
        },

        ktz_staff: {
            appName: '404 Found KTZ Staff',
            appDescription: 'Қызметкерлерді басқару',
            itemName: 'Қызметкер',
            itemNamePlural: 'Қызметкерлер',
            itemField: 'Аты-жөні',
            itemField2: 'Лауазымы',
            valueField: 'Жұмыс сағаты',
            valueUnit: 'сағат',
            valueLabel: 'Жалпы сағат',            // ✅ ЖАҢА
            categoryField: 'Бригада',
            aiPrompt: `Сіз KTZ қызметкерлер AI ассистентісіз.

Сіздің міндетіңіз:
1. Жұмыс кестесін талдау
2. Тиімділікті бағалау
3. Бригадаларды оңтайландыру
4. Ауысымдарды жоспарлау
5. Есеп дайындау

Қазақ тілінде, кәсіби жауап беріңіз.`,
            initialItems: [
                { title: 'Ерлан Асхат', description: 'Машинист', value: 160, category: 'Бригада #1' },
                { title: 'Нұрлан Серік', description: 'Техник', value: 168, category: 'Бригада #3' },
                { title: 'Асхат Ерлан', description: 'Диспетчер', value: 152, category: 'Бригада #2' },
            ],
        },

        ktz_finance: {
            appName: '404 Found KTZ Finance',
            appDescription: 'Қаржы талдау',
            itemName: 'Транзакция',
            itemNamePlural: 'Транзакциялар',
            itemField: 'Атауы',
            itemField2: 'Сипаттама',
            valueField: 'Сомасы (₸)',
            valueUnit: '₸',
            valueLabel: 'Жалпы сома',             // ✅ ЖАҢА
            categoryField: 'Категория',
            aiPrompt: `Сіз KTZ қаржы AI ассистентісіз.

Сіздің міндетіңіз:
1. Транзакцияларды талдау
2. Шығындарды анықтау
3. Табыстарды болжау
4. Бюджетті оңтайландыру
5. Қаржылық есеп дайындау

Қазақ тілінде, кәсіби жауап беріңіз.`,
            initialItems: [
                { title: 'Жанармай', description: 'Астана', value: -5000000, category: 'Шығын' },
                { title: 'Тасымал', description: 'Алматы', value: 15000000, category: 'Табыс' },
                { title: 'Жөндеу', description: 'Шымкент', value: -3000000, category: 'Шығын' },
            ],
        },

        // ===== 📦 БАСҚА ТАҚЫРЫПТАР =====

        logistics: {
            appName: '404 Found Logistics',
            appDescription: 'Логистикалық AI жүйесі',
            itemName: 'Тапсырыс',
            itemNamePlural: 'Тапсырыстар',
            itemField: 'Клиент аты',
            itemField2: 'Мекенжай',
            valueField: 'Бағасы (₸)',
            valueUnit: '₸',
            valueLabel: 'Жалпы сома',             // ✅ ЖАҢА
            categoryField: 'Курьер',
            aiPrompt: `Сіз 404 Found логистикалық AI ассистентісіз.

Міндетіңіз:
1. Тапсырыстарды талдау
2. Маршруттарды оңтайландыру
3. Курьерлерді бөлу
4. Уақытты болжау
5. Шығынды азайту

Қазақ тілінде, кәсіби жауап беріңіз.`,
            initialItems: [
                { title: 'Асхат Нұрлан', description: 'Алматы, Абай 15', value: 15000, category: 'Ерлан' },
                { title: 'Мадина Серік', description: 'Алматы, Достық 25', value: 22000, category: 'Нұрлан' },
                { title: 'Данияр Қайрат', description: 'Алматы, Сейфуллин 45', value: 18500, category: 'Ерлан' },
            ],
        },

        taxi: {
            appName: '404 Found Taxi',
            appDescription: 'Такси AI жүйесі',
            itemName: 'Жүргізуші',
            itemNamePlural: 'Жүргізушілер',
            itemField: 'Аты-жөні',
            itemField2: 'Аудан',
            valueField: 'Табыс (₸)',
            valueUnit: '₸',
            valueLabel: 'Жалпы табыс',            // ✅ ЖАҢА
            categoryField: 'Көлік',
            aiPrompt: `Сіз 404 Found такси AI ассистентісіз.

Міндетіңіз:
1. Жүргізушілерді талдау
2. Табысты болжау
3. Аудандарды оңтайландыру
4. Уақытты басқару
5. Кеңес беру

Қазақ тілінде, кәсіби жауап беріңіз.`,
            initialItems: [
                { title: 'Ерлан Асхат', description: 'Абай ауданы', value: 45000, category: 'Toyota' },
                { title: 'Нұрлан Серік', description: 'Бостандық', value: 52000, category: 'Hyundai' },
            ],
        },

        finance: {
            appName: '404 Found Finance',
            appDescription: 'Қаржы AI жүйесі',
            itemName: 'Транзакция',
            itemNamePlural: 'Транзакциялар',
            itemField: 'Атауы',
            itemField2: 'Сипаттама',
            valueField: 'Сомасы (₸)',
            valueUnit: '₸',
            valueLabel: 'Жалпы сома',             // ✅ ЖАҢА
            categoryField: 'Категория',
            aiPrompt: `Сіз 404 Found қаржы AI ассистентісіз.

Міндетіңіз:
1. Транзакцияларды талдау
2. Бюджетті басқару
3. Шығынды азайту
4. Табысты болжау
5. Кеңес беру

Қазақ тілінде, кәсіби жауап беріңіз.`,
            initialItems: [
                { title: 'Азық-түлік', description: 'Магнум', value: -5000, category: 'Азық-түлік' },
                { title: 'Жалақы', description: 'Айлық', value: 350000, category: 'Табыс' },
            ],
        },

        education: {
            appName: '404 Found Education',
            appDescription: 'Білім AI жүйесі',
            itemName: 'Курс',
            itemNamePlural: 'Курстар',
            itemField: 'Курс атауы',
            itemField2: 'Сипаттама',
            valueField: 'Бағасы (₸)',
            valueUnit: '₸',
            valueLabel: 'Жалпы сома',             // ✅ ЖАҢА
            categoryField: 'Пән',
            aiPrompt: `Сіз 404 Found білім AI ассистентісіз.

Міндетіңіз:
1. Курстарды талдау
2. Оқу жоспарын ұсыну
3. Прогресті бақылау
4. Уақытты жоспарлау
5. Кеңес беру

Қазақ тілінде, кәсіби жауап беріңіз.`,
            initialItems: [
                { title: 'Математика', description: '10 сабақ', value: 25000, category: 'Математика' },
                { title: 'Ағылшын тілі', description: '20 сабақ', value: 45000, category: 'Ағылшын' },
            ],
        },
    },

    // 📊 Ағымдағы конфигурацияны алу
    get current() {
        return this.themes[this.theme];
    },
};
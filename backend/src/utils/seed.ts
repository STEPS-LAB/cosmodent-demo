import mongoose from 'mongoose';
import { config } from '../config';
import { Admin } from '../models/Admin';
import { Service } from '../models/Service';
import { Doctor } from '../models/Doctor';
import { Settings } from '../models/Settings';
import { logger } from '../config/logger';

const services = [
  // Імплантація
  {
    name: 'Імплантація зубів',
    slug: 'implantatsiya-zubiv',
    shortDescription: 'Сучасні методи відновлення зубів за допомогою імплантатів',
    fullDescription: 'Імплантація зубів - це сучасний метод відновлення втрачених зубів шляхом встановлення титанових імплантатів. Процедура дозволяє повністю відновити функцію жування та естетику посмішки. Використовуємо імплантати провідних світових виробників.',
    startingPrice: 8000,
    isActive: true,
    sortOrder: 1,
    category: 'Імплантація',
    seoTitle: 'Імплантація зубів у Києві - CosmoDent',
    seoDescription: 'Професійна імплантація зубів. Сучасні методи, гарантія якості. Консультація імплантолога.',
    duration: 60,
  },
  {
    name: 'All-on-4 імплантація',
    slug: 'all-on-4-implantatsiya',
    shortDescription: 'Повне відновлення зубного ряду за 1 день',
    fullDescription: 'Технологія All-on-4 дозволяє встановити повний зубний ряд на 4 імплантатах за одну процедуру. Ідеальне рішення для пацієнтів з повною відсутністю зубів. Мінімальний термін загоєння та миттєвий естетичний результат.',
    startingPrice: 45000,
    isActive: true,
    sortOrder: 2,
    category: 'Імплантація',
    seoTitle: 'All-on-4 імплантація - повне відновлення зубів',
    seoDescription: 'Технологія All-on-4 для повного відновлення зубного ряду. Швидко, надійно, естетично.',
    duration: 180,
  },
  // Хірургічна стоматологія
  {
    name: 'Видалення зубів',
    slug: 'vydalennya-zubiv',
    shortDescription: 'Безболісне видалення зубів будь-якої складності',
    fullDescription: 'Професійне видалення зубів з використанням сучасних анестетиків. Проводимо просте та складне видалення, включаючи видалення зубів мудрості. Мінімальний дискомфорт та швидке загоєння.',
    startingPrice: 800,
    isActive: true,
    sortOrder: 3,
    category: 'Хірургічна стоматологія',
    seoTitle: 'Видалення зубів у Києві - CosmoDent',
    seoDescription: 'Безболісне видалення зубів. Досвідчені хірурги, сучасне обладнання.',
    duration: 30,
  },
  {
    name: 'Пластика ясен',
    slug: 'plastyka-yasen',
    shortDescription: 'Естетична корекція ясен',
    fullDescription: 'Хірургічна корекція ясен для покращення естетики посмішки та лікування рецесії ясен. Використовуємо лазерна технологія для мінімально інвазивного втручання та швидкого загоєння.',
    startingPrice: 2500,
    isActive: true,
    sortOrder: 4,
    category: 'Хірургічна стоматологія',
    seoTitle: 'Пластика ясен - естетична стоматологія',
    seoDescription: 'Естетична пластика ясен. Лазерна технологія, швидке загоєння.',
    duration: 60,
  },
  // Лікування зубів
  {
    name: 'Лікування карієсу',
    slug: 'likuvannya-kariesu',
    shortDescription: 'Сучасне лікування карієсу з використанням мікроскопа',
    fullDescription: 'Лікування карієсу на будь-якій стадії з використанням сучасних пломбувальних матеріалів. Працюємо під мікроскопом для максимальної точності. Зберігаємо максимальну кількість здорової тканини зуба.',
    startingPrice: 1200,
    isActive: true,
    sortOrder: 5,
    category: 'Лікування зубів',
    seoTitle: 'Лікування карієсу - сучасна стоматологія',
    seoDescription: 'Професійне лікування карієсу. Сучасні матеріали, робота під мікроскопом.',
    duration: 45,
  },
  {
    name: 'Лікування каналів',
    slug: 'likuvannya-kanaliv',
    shortDescription: 'Ендодонтичне лікування під мікроскопом',
    fullDescription: 'Професійне лікування кореневих каналів з використанням дентального мікроскопа. Видаляємо інфекцію, герметично пломбуємо канали. Зберігаємо зуб навіть у складних випадках.',
    startingPrice: 2000,
    isActive: true,
    sortOrder: 6,
    category: 'Лікування зубів',
    seoTitle: 'Лікування кореневих каналів - ендодонтія',
    seoDescription: 'Ендодонтичне лікування під мікроскопом. Збереження зубів у складних випадках.',
    duration: 90,
  },
  // Ортодонтія
  {
    name: 'Брекети',
    slug: 'brekety',
    shortDescription: 'Виправлення прикусу брекет-системами',
    fullDescription: 'Встановлення сучасних брекет-систем для виправлення прикусу та вирівнювання зубів. Пропонуємо металеві, керамічні та сапфірові брекети. Індивідуальний план лікування для кожного пацієнта.',
    startingPrice: 15000,
    isActive: true,
    sortOrder: 7,
    category: 'Ортодонтія',
    seoTitle: 'Брекети - виправлення прикусу у Києві',
    seoDescription: 'Встановлення брекет-систем. Металеві, керамічні, сапфірові брекети. Консультація ортодонта.',
    duration: 120,
  },
  {
    name: 'Елайнери',
    slug: 'elainery',
    shortDescription: 'Прозорі капи для вирівнювання зубів',
    fullDescription: 'Іноваційний метод вирівнювання зубів за допомогою прозорих знімних елайнерів. Комфортна альтернатива брекетам. Виготовляємо індивідуально за 3D-моделлю щелепи.',
    startingPrice: 25000,
    isActive: true,
    sortOrder: 8,
    category: 'Ортодонтія',
    seoTitle: 'Елайнери - прозорі капи для зубів',
    seoDescription: 'Вирівнювання зубів елайнерами. Прозоро, комфортно, ефективно.',
    duration: 60,
  },
  // Протезування
  {
    name: 'Коронки',
    slug: 'koronky',
    shortDescription: 'Сучасні зубні коронки з цирконію та кераміки',
    fullDescription: 'Виготовлення та встановлення зубних коронок з сучасних матеріалів: діоксид цирконію, E-max кераміка, металокераміка. Ідеальна естетика та довговічність. Виготовлення в лабораторії за 3-5 днів.',
    startingPrice: 6000,
    isActive: true,
    sortOrder: 9,
    category: 'Протезування',
    seoTitle: 'Зубні коронки - протезування зубів',
    seoDescription: 'Коронки з цирконію та кераміки. Сучасне протезування зубів.',
    duration: 90,
  },
  {
    name: 'Вініри',
    slug: 'viniry',
    shortDescription: 'Естетичні вініри для ідеальної посмішки',
    fullDescription: 'Встановлення керамічних вінірів для корекції форми, кольору та положення зубів. Мінімальне препарування, максимальна естетика. Створення ідеальної посмішки за 2-3 візити.',
    startingPrice: 8000,
    isActive: true,
    sortOrder: 10,
    category: 'Протезування',
    seoTitle: 'Вініри - естетична стоматологія',
    seoDescription: 'Керамічні вініри для ідеальної посмішки. Сучасна естетична стоматологія.',
    duration: 120,
  },
  // Професійна гігієна
  {
    name: 'Професійна чистка',
    slug: 'profesiyna-chystka',
    shortDescription: 'Професійне видалення зубного нальоту та каменю',
    fullDescription: 'Комплексна професійна гігієна порожнини рота: видалення зубного каменю ультразвуком, Air Flow полірування, фторування. Процедура займає 60-90 хвилин та робить посмішку сяючою.',
    startingPrice: 1500,
    isActive: true,
    sortOrder: 11,
    category: 'Професійна гігієна',
    seoTitle: 'Професійна чистка зубів - гігієна',
    seoDescription: 'Професійна чистка зубів. Видалення нальоту та каменю. Air Flow полірування.',
    duration: 60,
  },
  {
    name: 'Відбілювання зубів',
    slug: 'vidbilyuvannya-zubiv',
    shortDescription: 'Професійне відбілювання зубів на кілька тонів',
    fullDescription: 'Безпечне професійне відбілювання зубів системою Zoom 4. Освітлення на 4-8 тонів за одну процедуру. Мінімальна чутливість, тривалий результат. Ефект зберігається до 2 років.',
    startingPrice: 8000,
    isActive: true,
    sortOrder: 12,
    category: 'Професійна гігієна',
    seoTitle: 'Відбілювання зубів Zoom 4 - професійне',
    seoDescription: 'Професійне відбілювання зубів. Освітлення на 4-8 тонів за 1 процедуру.',
    duration: 90,
  },
  // Дитяча стоматологія
  {
    name: 'Лікування зубів дітям',
    slug: 'likuvannya-zubiv-dityam',
    shortDescription: 'Бережне лікування молочних зубів',
    fullDescription: 'Професійне лікування карієсу молочних зубів з використанням дитячих анестетиків. Створюємо комфортну атмосферу для дитини. Навчаємо правильній гігієні порожнини рота.',
    startingPrice: 800,
    isActive: true,
    sortOrder: 13,
    category: 'Дитяча стоматологія',
    seoTitle: 'Дитяча стоматологія - лікування зубів дітям',
    seoDescription: 'Лікування молочних зубів. Комфортно для дітей, професійно для батьків.',
    duration: 30,
  },
  {
    name: 'Герметизація фісур',
    slug: 'hermetyzatsiya-fisur',
    shortDescription: 'Захист дитячих зубів від карієсу',
    fullDescription: 'Профілактична процедура запечатування фісур (борозенок) на жувальних зубах дітей. Захищає від карієсу на 90%. Безболісна процедура, що займає 15-20 хвилин.',
    startingPrice: 500,
    isActive: true,
    sortOrder: 14,
    category: 'Дитяча стоматологія',
    seoTitle: 'Герметизація фісур - захист дитячих зубів',
    seoDescription: 'Профілактика карієсу у дітей. Герметизація фісур безболісно.',
    duration: 20,
  },
  // Лазерна стоматологія
  {
    name: 'Лазерне лікування',
    slug: 'lazerna-stomatologiya',
    shortDescription: 'Лікування за допомогою діодного лазера',
    fullDescription: 'Використання діодного лазера для лікування ясен, видалення новоутворень, дезінфекції каналів. Безкровно, безболісно, мінімальний період загоєння. Сучасна технологія для комфортного лікування.',
    startingPrice: 1000,
    isActive: true,
    sortOrder: 15,
    category: 'Лазерна стоматологія',
    seoTitle: 'Лазерна стоматологія - сучасне лікування',
    seoDescription: 'Лікування діодним лазером. Безкровно, безболісно, швидке загоєння.',
    duration: 30,
  },
];

const doctors = [
  {
    name: 'Олександр Коваленко',
    slug: 'oleksandr-kovalenko',
    position: 'Головний лікар',
    specialization: ['Імплантація', 'Хірургічна стоматологія'],
    bio: 'Лікар-імплантолог з 15-річним досвідом. Провів понад 3000 успішних операцій з імплантації. Постійно підвищує кваліфікацію у провідних клініках Європи.',
    experience: 15,
    education: [
      'Національний медичний університет ім. О.О. Богомольця',
      'Міжнародний курс імплантації (ITI)',
      'Advanced Implant Surgery (Германія)',
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Марія Шевченко',
    slug: 'mariya-shevchenko',
    position: 'Ортодонт',
    specialization: ['Ортодонтія', 'Елайнери'],
    bio: 'Сертифікований ортодонт, експерт з роботи з елайнерами. Допомагає пацієнтам отримати ідеальну посмішку вже понад 10 років.',
    experience: 10,
    education: [
      'Національний медичний університет ім. О.О. Богомольця',
      'Сертифікація Invisalign',
      'Європейське товариство ортодонтів (EOS)',
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Андрій Бондаренко',
    slug: 'andriy-bondarenko',
    position: 'Терапевт-стоматолог',
    specialization: ['Лікування зубів', 'Ендодонтія'],
    bio: 'Спеціалізується на складному лікуванні кореневих каналів під мікроскопом. Врятував сотні зубів, які інші лікарі рекомендували видаляти.',
    experience: 12,
    education: [
      'Національний медичний університет ім. О.О. Богомольця',
      'Мікроскопічна ендодонтія (Dentsply)',
      'Сучасні ендодонтичні технології',
    ],
    isActive: true,
    sortOrder: 3,
  },
  {
    name: 'Олена Мельник',
    slug: 'olena-melnyk',
    position: 'Дитячий стоматолог',
    specialization: ['Дитяча стоматологія', 'Профілактика'],
    bio: 'Любить дітей і свою роботу. Створює комфортну атмосферу для маленьких пацієнтів. Експерт з профілактики карієсу у дітей.',
    experience: 8,
    education: [
      'Національний медичний університет ім. О.О. Богомольця',
      'Дитяча стоматологія (Європа)',
      'Психологія дитячого прийому',
    ],
    isActive: true,
    sortOrder: 4,
  },
];

export const seedDatabase = async () => {
  try {
    // Force IPv4 connection only if using localhost
    let uri = config.mongodb.uri;
    if (uri.includes('localhost')) {
      uri = uri.replace('localhost', '127.0.0.1');
    }
    
    await mongoose.connect(uri);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data
    await Promise.all([
      Admin.deleteMany({}),
      Service.deleteMany({}),
      Doctor.deleteMany({}),
      Settings.deleteMany({}),
    ]);
    logger.info('Cleared existing data');

    // Create admin user with username
    await Admin.create({
      email: 'admin@kosmodent.ua',
      username: 'admin',
      password: '12345678',
      name: 'Адміністратор',
      role: 'super-admin',
    });
    logger.info('Created admin user (admin/12345678)');

    // Create services
    await Service.insertMany(services);
    logger.info(`Created ${services.length} services`);

    // Create doctors
    await Doctor.insertMany(doctors);
    logger.info(`Created ${doctors.length} doctors`);

    // Create settings
    await Settings.create({
      clinicName: 'КОСМОДЕНТ',
      clinicDescription: 'Сучасна стоматологічна клініка з інноваційними технологіями лікування. Ми дбаємо про вашу посмішку та здоров\'я.',
      phone: '+38 (067) 908 26 29',
      email: 'info@kosmodent.ua',
      address: {
        street: 'вулиця Східна, 107/86',
        city: 'Житомир',
        zipCode: '10001',
        country: 'Україна',
        coordinates: {
          lat: 50.2547,
          lng: 28.6587,
        },
      },
      workingHours: {
        monday: { open: '08:00', close: '19:00', isClosed: false },
        tuesday: { open: '08:00', close: '19:00', isClosed: false },
        wednesday: { open: '08:00', close: '19:00', isClosed: false },
        thursday: { open: '08:00', close: '19:00', isClosed: false },
        friday: { open: '08:00', close: '19:00', isClosed: false },
        saturday: { open: '08:00', close: '14:00', isClosed: false },
        sunday: { open: '08:00', close: '19:00', isClosed: true },
      },
      seo: {
        title: 'КОСМОДЕНТ - Сучасна Стоматологія у Житомирі',
        description: 'Професійні стоматологічні послуги. Імплантація, відбілювання, лікування зубів. Сучасне обладнання та досвідчені лікарі.',
        keywords: ['стоматологія', 'імплантація', 'лікування зубів', 'Житомир', 'КОСМОДЕНТ'],
      },
      bookingSettings: {
        slotDuration: 30,
        advanceBookingDays: 30,
        minBookingHours: 2,
        maxAppointmentsPerSlot: 1,
      },
    });
    logger.info('Created settings');

    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

/**
 * Database seed script
 * Run: npm run seed
 *
 * Seeds: Admin user, Clinic Settings, Services, Doctors, Reviews
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { Admin } from '../modules/auth/admin.model';
import { Service } from '../modules/services/service.model';
import { Doctor } from '../modules/doctors/doctor.model';
import { Review } from '../modules/reviews/review.model';
import { Settings } from '../modules/settings/settings.model';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/cosmodent';

const SERVICES_DATA = [
  {
    name: 'Імплантологія',
    slug: 'implantology',
    shortDescription: 'Встановлення зубних імплантів з довічною гарантією. Сучасні титанові імпланти.',
    fullDescription: `<p>Імплантологія — сучасний метод відновлення втрачених зубів за допомогою металевих стрижнів, що вживляються в кістку щелепи. Cosmodent використовує імпланти провідних виробників: Nobel Biocare, Straumann, MIS.</p><p>Процедура проходить у декілька етапів: діагностика, встановлення імпланту, остеоінтеграція (2–6 місяців), встановлення коронки.</p>`,
    startingPrice: 18000,
    duration: 90,
    category: 'surgical',
    seoTitle: 'Імплантологія в Києві — Cosmodent | Зубні імпланти',
    seoDescription: 'Встановлення зубних імплантів у Києві. Nobel Biocare, Straumann. Довічна гарантія. Запис онлайн.',
    seoKeywords: ['імплантологія', 'зубні імпланти', 'імпланти київ', 'імплант зуба'],
    order: 0,
  },
  {
    name: 'Хірургічна стоматологія',
    slug: 'surgical-dentistry',
    shortDescription: 'Видалення зубів, кісткова пластика, синус-ліфтинг. Безболісно під анестезією.',
    fullDescription: `<p>Хірургічна стоматологія охоплює складні операції в порожнині рота: видалення зубів мудрості, кісткову пластику, синус-ліфтинг, резекцію верхівки кореня, лікування кіст та новоутворень.</p>`,
    startingPrice: 1200,
    duration: 60,
    category: 'surgical',
    seoTitle: 'Хірургічна стоматологія в Києві — Cosmodent',
    seoDescription: 'Видалення зубів, кісткова пластика, синус-ліфтинг у Cosmodent. Безболісно. Досвідчені хірурги.',
    seoKeywords: ['хірургічна стоматологія', 'видалення зуба', 'кісткова пластика'],
    order: 1,
  },
  {
    name: 'Лазерне лікування',
    slug: 'laser-treatment',
    shortDescription: 'Лазерна стоматологія без болю і крові. Лікування ясен, відбілювання, лазерна хірургія.',
    fullDescription: `<p>Лазерне лікування в стоматології — один з найсучасніших методів. Лазер забезпечує точну, безкровну та безболісну роботу. Застосовується для лікування пародонту, депульпації, відбілювання та хірургічних втручань.</p>`,
    startingPrice: 800,
    duration: 45,
    category: 'therapy',
    seoTitle: 'Лазерне лікування зубів у Києві — Cosmodent',
    seoDescription: 'Лазерна стоматологія в Cosmodent: безболісне лікування, відбілювання лазером, лікування ясен. Київ.',
    seoKeywords: ['лазерна стоматологія', 'лазерне відбілювання', 'лікування ясен лазером'],
    order: 2,
  },
  {
    name: 'Ортодонтія',
    slug: 'orthodontics',
    shortDescription: 'Брекети, елайнери Invisalign, ретейнери. Ідеальна посмішка для дітей і дорослих.',
    fullDescription: `<p>Ортодонтія — напрям стоматології, що займається виправленням прикусу та положення зубів. Ми пропонуємо металеві та керамічні брекети, прозорі елайнери Invisalign, лінгвальні системи та ретейнери для збереження результату.</p>`,
    startingPrice: 15000,
    duration: 60,
    category: 'orthodontics',
    seoTitle: 'Ортодонтія в Києві — Cosmodent | Брекети, Invisalign',
    seoDescription: 'Ортодонтичне лікування в Cosmodent. Брекети, Invisalign, вирівнювання зубів. Консультація безкоштовно.',
    seoKeywords: ['ортодонтія', 'брекети київ', 'invisalign', 'вирівнювання зубів'],
    order: 3,
  },
  {
    name: 'Терапевтична стоматологія',
    slug: 'therapeutic-dentistry',
    shortDescription: 'Лікування карієсу, пульпіту, реставрація зубів. Якісні пломби та вкладки.',
    fullDescription: `<p>Терапевтична стоматологія — основа стоматологічного здоров'я. Ми лікуємо карієс будь-якої складності, пульпіт, пародонтит, проводимо ендодонтичне лікування та художню реставрацію зубів.</p>`,
    startingPrice: 700,
    duration: 60,
    category: 'therapy',
    seoTitle: 'Терапевтична стоматологія в Києві — Cosmodent',
    seoDescription: 'Лікування карієсу, пульпіту, реставрація зубів у Cosmodent. Сучасні матеріали. Досвідчені лікарі.',
    seoKeywords: ['терапевтична стоматологія', 'лікування карієсу', 'пломба', 'реставрація зубів'],
    order: 4,
  },
  {
    name: 'Естетична стоматологія',
    slug: 'aesthetic-dentistry',
    shortDescription: 'Вініри, люмінери, художня реставрація. Голлівудська усмішка за 2–3 відвідування.',
    fullDescription: `<p>Естетична стоматологія перетворює посмішку на справжній шедевр. Вінири, люмінери, художня реставрація, зміна форми та кольору зубів — Cosmodent пропонує повний спектр естетичних процедур.</p>`,
    startingPrice: 8000,
    duration: 120,
    category: 'aesthetic',
    seoTitle: 'Естетична стоматологія в Києві — Cosmodent | Вінири',
    seoDescription: 'Вінири, люмінери, художня реставрація в Cosmodent. Голлівудська усмішка. Запис онлайн.',
    seoKeywords: ['естетична стоматологія', 'вінири київ', 'люмінери', 'голлівудська усмішка'],
    order: 5,
  },
  {
    name: 'Пародонтологія',
    slug: 'periodontology',
    shortDescription: 'Лікування пародонтиту, ясен, зміцнення зубів. Ультразвукове чищення.',
    fullDescription: `<p>Пародонтологія займається лікуванням захворювань тканин, що оточують зуб: ясен, кісткової тканини, зв'язкового апарату. Хвороби пародонту — найпоширеніша причина втрати зубів у дорослих.</p>`,
    startingPrice: 600,
    duration: 60,
    category: 'therapy',
    seoTitle: 'Пародонтологія в Києві — Cosmodent | Лікування ясен',
    seoDescription: 'Лікування пародонтиту та хвороб ясен у Cosmodent. Ультразвукове чищення. Досвідчені лікарі.',
    seoKeywords: ['пародонтологія', 'лікування ясен', 'пародонтит', 'ультразвукове чищення'],
    order: 6,
  },
  {
    name: 'Дитяча стоматологія',
    slug: 'pediatric-dentistry',
    shortDescription: 'Лікування молочних і постійних зубів у дітей. Комфортна атмосфера без страху.',
    fullDescription: `<p>Дитяча стоматологія в Cosmodent — це особливий підхід до маленьких пацієнтів. Наші лікарі-педіатри створюють дружню атмосферу, використовують безпечні матеріали та сучасні методи лікування без болю та страху.</p>`,
    startingPrice: 500,
    duration: 45,
    category: 'pediatric',
    seoTitle: 'Дитяча стоматологія в Києві — Cosmodent',
    seoDescription: 'Дитяча стоматологія в Cosmodent. Лікування молочних зубів, профілактика, герметизація фісур. Без страху.',
    seoKeywords: ['дитяча стоматологія', 'молочні зуби', 'дитячий стоматолог', 'стоматологія для дітей'],
    order: 7,
  },
  {
    name: 'Протезування',
    slug: 'prosthetics',
    shortDescription: 'Коронки, мости, знімні протези, All-on-4. Відновимо повний зубний ряд.',
    fullDescription: `<p>Протезування зубів — відновлення відсутніх або пошкоджених зубів за допомогою штучних конструкцій. Cosmodent пропонує металокерамічні та цирконієві коронки, мости, знімні та умовно-знімні протези, протоколи All-on-4 та All-on-6.</p>`,
    startingPrice: 5000,
    duration: 90,
    category: 'prosthetics',
    seoTitle: 'Протезування зубів у Києві — Cosmodent',
    seoDescription: 'Протезування зубів у Cosmodent. Коронки, мости, All-on-4. Цирконій, металокераміка. Запис онлайн.',
    seoKeywords: ['протезування зубів', 'коронки', 'мости', 'all-on-4', 'зубні протези'],
    order: 8,
  },
  {
    name: 'Відбілювання зубів',
    slug: 'teeth-whitening',
    shortDescription: 'Професійне відбілювання Zoom 4, Beyond. Зуби до 10 тонів світліше за 1 годину.',
    fullDescription: `<p>Професійне відбілювання зубів у Cosmodent — безпечна та ефективна процедура. Системи Zoom 4 та Beyond забезпечують освітлення на 8–10 тонів за 60–90 хвилин. Результат зберігається 1–3 роки при правильному догляді.</p>`,
    startingPrice: 3500,
    duration: 90,
    category: 'aesthetic',
    seoTitle: 'Відбілювання зубів у Києві — Cosmodent | Zoom 4',
    seoDescription: 'Відбілювання зубів Zoom 4 у Cosmodent. До 10 тонів за 1 годину. Безпечно та ефективно. Київ.',
    seoKeywords: ['відбілювання зубів', 'zoom відбілювання', 'зуби білі', 'відбілювання київ'],
    order: 9,
  },
];

const DOCTORS_DATA = [
  {
    name: 'Олена Петренко',
    slug: 'olena-petrenko',
    specialization: 'Хірург-імплантолог',
    bio: 'Кандидат медичних наук, сертифікований хірург-імплантолог з 15-річним досвідом. Спеціалізація — складні імплантологічні протоколи та кісткова пластика. Автор 12 наукових публікацій.',
    experience: 15,
    rating: 4.9,
    reviewCount: 127,
    isActive: true,
    order: 0,
  },
  {
    name: 'Максим Коваленко',
    slug: 'maksym-kovalenko',
    specialization: 'Ортодонт',
    bio: 'Сертифікований ортодонт, провайдер Invisalign. Досвід 10 років. Lікує дітей та дорослих. Закінчив Національний медичний університет ім. О.О. Богомольця. Стажування в Берлінській академії ортодонтії.',
    experience: 10,
    rating: 4.8,
    reviewCount: 98,
    isActive: true,
    order: 1,
  },
  {
    name: 'Юлія Мельник',
    slug: 'yuliia-melnyk',
    specialization: 'Терапевт, естетична стоматологія',
    bio: 'Спеціаліст з художньої реставрації та естетичної стоматології. 8 років практики. Сертифікований провайдер вінірів та люмінерів. Переможець конкурсу "Краща робота" на DentalExpo 2023.',
    experience: 8,
    rating: 4.9,
    reviewCount: 215,
    isActive: true,
    order: 2,
  },
];

async function seed(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // ── Clear existing data ──────────────────────────────────
  await Promise.all([
    Admin.deleteMany({}),
    Service.deleteMany({}),
    Doctor.deleteMany({}),
    Review.deleteMany({}),
    Settings.deleteMany({}),
  ]);
  console.log('🗑  Cleared existing data');

  // ── Admin user ───────────────────────────────────────────
  await Admin.create({
    email:    process.env.ADMIN_EMAIL    ?? 'admin@cosmodent.ua',
    password: process.env.ADMIN_PASSWORD ?? 'Admin@123456',
    name:     'Адміністратор',
    role:     'superadmin',
  });
  console.log('👤 Admin created');

  // ── Settings ─────────────────────────────────────────────
  await Settings.create({
    key:        'clinic',
    clinicName: 'Cosmodent',
    phone:      '+38 (044) 123-45-67',
    email:      'info@cosmodent.ua',
    address:    'вул. Хрещатик, 1, Київ, 01001',
    workingHours: { weekdays: '09:00–20:00', saturday: '09:00–17:00', sunday: 'Вихідний' },
    socialLinks:  { instagram: 'https://instagram.com/cosmodent', facebook: 'https://facebook.com/cosmodent', telegram: 'https://t.me/cosmodent' },
    heroHeading:    'Ваша усмішка — наша місія',
    heroSubheading: 'Сучасна стоматологія з турботою про кожного пацієнта',
  });
  console.log('⚙️  Settings created');

  // ── Services ─────────────────────────────────────────────
  const services = await Service.insertMany(SERVICES_DATA.map(s => ({ ...s, isActive: true })));
  console.log(`🦷 ${services.length} services created`);

  // ── Doctors ──────────────────────────────────────────────
  const doctors = await Doctor.insertMany(
    DOCTORS_DATA.map((d, i) => ({
      ...d,
      services: services.slice(i * 3, i * 3 + 3).map(s => s._id),
    })),
  );
  console.log(`👨‍⚕️ ${doctors.length} doctors created`);

  // ── Sample reviews ────────────────────────────────────────
  await Review.insertMany([
    {
      patientName:   'Наталія К.',
      rating:        5,
      text:          'Чудова клініка! Встановили імплант професійно та швидко. Відчувається зовсім як рідний зуб. Рекомендую всім!',
      doctorId:      doctors[0]._id,
      isApproved:    true,
      isHighlighted: true,
      source:        'website',
    },
    {
      patientName:   'Олексій М.',
      rating:        5,
      text:          'Носив брекети 18 місяців у Максима Коваленка — результат перевершив усі очікування. Тепер Invisalign для підтримки. Дякую команді!',
      doctorId:      doctors[1]._id,
      isApproved:    true,
      isHighlighted: true,
      source:        'website',
    },
    {
      patientName:   'Марія В.',
      rating:        5,
      text:          'Зробила вінири у Юлії Мельник — це моя найкраща інвестиція в себе. Усмішка стала зовсім іншою. Сервіс на вищому рівні!',
      doctorId:      doctors[2]._id,
      isApproved:    true,
      isHighlighted: true,
      source:        'website',
    },
  ]);
  console.log('⭐ Reviews created');

  console.log('\n🎉 Seed completed successfully!');
  console.log(`   Admin: ${process.env.ADMIN_EMAIL ?? 'admin@cosmodent.ua'}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD ?? 'Admin@123456'}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

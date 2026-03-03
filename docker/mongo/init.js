// MongoDB initialization script
// Runs once on first container start

db = db.getSiblingDB(process.env['MONGO_INITDB_DATABASE'] || 'cosmodent');

db.createCollection('settings');
db.settings.insertOne({
  key: 'clinic',
  clinicName: 'Cosmodent',
  phone: '+38 (044) 123-45-67',
  email: 'info@cosmodent.ua',
  address: 'вул. Хрещатик, 1, Київ, 01001',
  workingHours: {
    weekdays: '09:00–20:00',
    saturday: '09:00–17:00',
    sunday: 'Вихідний',
  },
  socialLinks: {
    instagram: 'https://instagram.com/cosmodent',
    facebook: 'https://facebook.com/cosmodent',
    telegram: 'https://t.me/cosmodent',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

print('✅ MongoDB initialized for Cosmodent');

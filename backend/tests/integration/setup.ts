import mongoose from 'mongoose';
import { config } from '../../../src/config';

beforeAll(async () => {
  // Connect to test database
  const testUri = config.mongodb.uri.replace(
    config.mongodb.uri.split('/').pop() || 'cosmodent',
    'cosmodent_test'
  );
  
  await mongoose.connect(testUri);
});

afterAll(async () => {
  // Drop test database
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

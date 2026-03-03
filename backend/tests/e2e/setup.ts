import mongoose from 'mongoose';
import { config } from '../../../src/config';

beforeAll(async () => {
  const testUri = config.mongodb.uri.replace(
    config.mongodb.uri.split('/').pop() || 'cosmodent',
    'cosmodent_e2e'
  );
  
  await mongoose.connect(testUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

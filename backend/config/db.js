import mongoose from 'mongoose';
import Application from '../models/Application.js';

export default async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobconnect');
  const collections = mongoose.connection.db.listCollections({ name: Application.collection.name }, { nameOnly: true });
  if (await collections.hasNext()) {
    const indexes = await Application.collection.indexes();
    const obsoleteIndexes = indexes.filter((index) => {
      if (!index.unique) return false;
      const fields = Object.keys(index.key);
      const obsoleteCurrentFieldIndex = fields.length === 1 &&
        ['job', 'applicant'].some((field) => index.key[field] === 1);
      const obsoleteLegacyFieldIndex = fields.length === 2 &&
        index.key.jobId === 1 &&
        index.key.applicantId === 1;
      return obsoleteCurrentFieldIndex || obsoleteLegacyFieldIndex;
    });
    for (const index of obsoleteIndexes) {
      await Application.collection.dropIndex(index.name);
      console.warn(`Removed obsolete application index: ${index.name}`);
    }
  }
  await Application.createIndexes();
  console.log('MongoDB connected');
}

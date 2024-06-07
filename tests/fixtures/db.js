const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
  }
};

const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    // await mongoServer.stop();
  }
};

// const closeDatabase = async () => {
//   await mongoose.connection.close();
// };

const clearTestUsers = async () => {
  await mongoose.connection.collection('users').deleteMany({ username: { $in: ['admin', 'testuser', 'sender', 'receiver'] } });
};

module.exports = {
  connect,
  closeDatabase,
  // clearDatabase,
  clearTestUsers
};

const HealthRecord = require('../../models/HealthRecord');

exports.fetchUserRecords = async (userId) => {
  // return await HealthRecord.find({ userId });
  return [{ date: '2023-11-01', diagnosis: 'Healthy' }];
};
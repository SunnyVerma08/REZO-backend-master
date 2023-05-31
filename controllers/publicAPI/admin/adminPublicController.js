const callMe = require('../../../models/publicAPI/callMeModel');
const factory = require('../../handlerFactory');

// using default factory functions

exports.getAll = factory.getAll(callMe);
exports.getAllCounter = factory.getAllCounter(callMe);
exports.get = factory.getOne(callMe);
exports.create = factory.createOne(callMe);
exports.update = factory.updateOne(callMe);
exports.delete = factory.deleteOne(callMe);

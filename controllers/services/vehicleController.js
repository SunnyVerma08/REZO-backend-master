const services = require('../../models/services/vehicleModel');
const factory = require('../handlerFactory');

// using default factory functions

exports.getAll = factory.getAll(services);
exports.getAllCounter = factory.getAllCounter(services);
exports.get = factory.getOne(services);
exports.create = factory.createOne(services);
exports.update = factory.updateOne(services);
exports.delete = factory.deleteOne(services);

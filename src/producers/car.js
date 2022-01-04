const {BaseProducer} = require('./base-producer');

class Car extends BaseProducer {

    constructor(config) {
        super(config);
        this.type = 'car';
    }

}

module.exports = {
    Car
}

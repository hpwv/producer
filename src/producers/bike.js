const {BaseProducer} = require('./base-producer');

class Bike extends BaseProducer {

    constructor(config) {
        super(config);
        this.type = 'bike';
    }

}

module.exports = {
    Bike
}

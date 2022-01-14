const {BaseProducer} = require('./base-producer');

class Pedestrian extends BaseProducer {

    constructor(config) {
        super(config);
        this.type = 'pedestrian';
    }

}

module.exports = {
    Pedestrian
}

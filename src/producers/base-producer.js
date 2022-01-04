const {nanoid} = require('nanoid'),
    _ = require('lodash');

class BaseProducer {
    id;
    type;
    x;
    y;
    config;

    constructor(config) {
        if (!config || !config.area) {
            throw new Error('config or area not defined');
        }
        this.config = config;
        this.type = 'car';
        this.initialize();
    }

    /**
     * initializes the producer to spawn a new one inside the configured dimensions
     */
    initialize() {
        this.id = nanoid(10);
        this.x = Math.round(Math.random() * (this.config.area.x1 - this.config.area.x0) + this.config.area.x0);
        this.y = Math.round(Math.random() * (this.config.area.y1 - this.config.area.y0) + this.config.area.y0);
    }

    move() { // TODO: proper simulation
        this.x += 1;
        this.y += 2;
    }

    toJSON() {
        return _.omit(this, ['config']);
    }

}

module.exports = {
    BaseProducer
}

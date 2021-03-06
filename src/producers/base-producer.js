const {nanoid} = require('nanoid'),
    _ = require('lodash');

class BaseProducer {
    id;
    type;
    x;
    y;
    config;
    directionX;
    directionY;

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
        this.directionX = Math.random() < 0.5 ? -1 : 1;
        this.directionY = Math.random() > 0.5 ? -1 : 1;
    }

    /**
     * moves the producer with the given directionX and directionY and the configured speedPerTick
     */
    move() {
        if (this.x > this.config.area.x1 || this.x < this.config.area.x0 || this.y > this.config.area.y1 || this.y < this.config.area.y0) {
            this.initialize();
        }
        this.x += this.config.speedPerTick * this.directionX;
        this.y += this.config.speedPerTick * this.directionY;
    }

    toJSON() {
        return _.omit(this, ['config']);
    }

}

module.exports = {
    BaseProducer
}

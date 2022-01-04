const {Kafka, CompressionTypes, logLevel} = require('kafkajs'),
    config = require('config'),
    {Car} = require('./producers/car'),
    {nanoid} = require('nanoid');

const producerMapping = {
        "car": Car
    },
    kafkaProducers = [];

const createMessage = (producer) => ({
    key: producer.id,
    value: JSON.stringify(producer),
})

const sendMessage = (kafkaProducer, producer) => {
    return kafkaProducer
        .send({
            topic: config.topic,
            compression: CompressionTypes.GZIP,
            messages: [createMessage(producer)],
        })
        .then(console.log)
        .catch(e => console.error(`[example/producer] ${e.message}`, e));
}

const run = async () => {
    if (!config.producer.type) {
        throw new Error('producer type not given');
    }

    for (let i = 0; i < config.producers; i++) {
        const producer = new (producerMapping[config.producer.type])(config.producer),
            kafka = new Kafka({
                logLevel: logLevel.DEBUG,
                brokers: config.brokers,
                clientId: nanoid(10),
            }),
            kafkaProducer = kafka.producer();
        kafkaProducers.push(kafkaProducer);

        await kafkaProducer.connect();

        setInterval(() => {
            producer.move();
            sendMessage(kafkaProducer, producer);
        }, config.producer.intervall);
    }
}

run().catch(e => console.error(`[example/producer] ${e.message}`, e));

const errorTypes = ['unhandledRejection', 'uncaughtException'],
    signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.map(type => {
    process.on(type, async () => {
        try {
            console.log(`process.on ${type}`);
            await Promise.all(kafkaProducers.map(it => it.disconnect()));
            process.exit(0);
        } catch (_) {
            process.exit(1);
        }
    })
})

signalTraps.map(type => {
    process.once(type, async () => {
        try {
            await Promise.all(kafkaProducers.map(it => it.disconnect()));
        } finally {
            process.kill(process.pid, type);
        }
    })
})

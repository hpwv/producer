const ip = require('ip'),
    {Kafka, CompressionTypes, logLevel} = require('kafkajs')

const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    brokers: ['kafka-broker-1-1:9092', 'kafka-broker-2-1:9092', 'kafka-broker-3-1:9092'],
    clientId: 'example-producer',
})

const topic = 'my-test-topic'
const producer = kafka.producer()

const getRandomNumber = () => Math.round(Math.random(10) * 1000)
const createMessage = num => ({
    key: `key-1-${num}`,
    value: `value-${num}-${new Date().toISOString()}`,
})

const sendMessage = () => {
    return producer
        .send({
            topic,
            compression: CompressionTypes.GZIP,
            messages: Array(getRandomNumber())
                .fill()
                .map(_ => createMessage(getRandomNumber())),
        })
        .then(console.warn)
        .catch(e => console.error(`[example/producer] ${e.message}`, e))
}

const run = async () => {
    await producer.connect()
    setInterval(sendMessage, 300)
}

run().catch(e => console.error(`[example/producer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
    process.on(type, async () => {
        try {
            console.log(`process.on ${type}`)
            await producer.disconnect()
            process.exit(0)
        } catch (_) {
            process.exit(1)
        }
    })
})

signalTraps.map(type => {
    process.once(type, async () => {
        try {
            await producer.disconnect()
        } finally {
            process.kill(process.pid, type)
        }
    })
})

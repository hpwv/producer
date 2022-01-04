# Producer
## Introduction
There are different types of producers: Car, bike, pedestrian.
Each type can be customized in the config folder.

Available settings are:
```text
producers: int # the number of producers per container
intervall: int # ms intervall in which new data should be produced
type: 'car' | 'bike' | 'pedestrian' # string representation of the type for this producer
```

The `docker-compose.yml` defines which producers will be started. 

## Prerequisites
Make sure the Kafka Cluster is up and running before starting the producers.

## Running
The producers can be started by running `docker compose up` if you want the log output in the current 
terminal session or with `docker compose up -d` if you want to start it in the background.

By default, one instance of each type will be started.
This can be changed by running the `docker compose up` command with the `scale` option.

An example usage would be: `docker compose up --scale car=10,bike=5`.
This example will start 10 car containers and 5 bike containers where each container itself starts 
as many producers as configured in its config file. 

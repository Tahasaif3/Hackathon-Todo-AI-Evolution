# Dapr Components

This directory contains Dapr component configurations for the event-driven architecture.

## Components

### Kafka Pub/Sub

The `kafka-pubsub.yaml` file defines the Kafka pub/sub component used for event streaming between services.

Configuration:
- **Brokers**: Points to Kafka cluster (localhost:9092 for local development)
- **Consumer Group**: `audit-service-group` for the audit service
- **Client ID**: `audit-service`

## Local Development

For local development, make sure you have Kafka running. You can use Docker Compose or Strimzi to set up a local Kafka cluster:

```yaml
# docker-compose.yml example
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

## Production

In production, update the `brokers` field in the component configuration to point to your production Kafka cluster.

## Events

The system uses the following events published to the `task-events` topic:

- `created`: When a task is created
- `updated`: When a task is updated
- `completed`: When a task is marked as completed
- `deleted`: When a task is deleted
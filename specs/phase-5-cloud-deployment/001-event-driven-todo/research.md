# Research Findings: Event-Driven Todo System

## Decision: Event Schema Format
**Rationale**: Using JSON format with standardized fields as specified in the feature requirements to ensure consistency across services
**Alternatives considered**: Avro, Protobuf - JSON was chosen for simplicity and compatibility with existing systems

## Decision: Kafka Provider Selection
**Rationale**: Redpanda Cloud selected for production due to free serverless tier and managed service reducing operational overhead
**Alternatives considered**: Self-hosted Kafka with Strimzi, other managed Kafka services - Redpanda offers better free tier limits

## Decision: Dapr Configuration Strategy
**Rationale**: Using Dapr sidecar pattern with pub/sub components to abstract Kafka complexity from application code
**Alternatives considered**: Direct Kafka clients (not allowed per constitution), other service meshes - Dapr is mandated

## Decision: Audit Service Database Design
**Rationale**: Using PostgreSQL with JSONB field for event_data to allow flexible event schema while maintaining relational structure
**Alternatives considered**: Separate NoSQL database, flat file storage - PostgreSQL provides better consistency and querying capabilities

## Decision: Event Processing Guarantees
**Rationale**: Implementing at-least-once delivery with idempotent processing using event_id to prevent duplicate entries
**Alternatives considered**: Exactly-once delivery (more complex), at-most-once (risk of data loss) - at-least-once with deduplication balances reliability and complexity

## Decision: Health Check Implementation
**Rationale**: All services will expose `/health` endpoint with checks for dependencies (database connectivity, Kafka connectivity)
**Alternatives considered**: Basic endpoints vs. comprehensive dependency checks - comprehensive checks provide better observability

## Decision: Resource Allocation
**Rationale**: Setting conservative resource requests and limits based on expected load (1000 events/second, 100 concurrent users)
**Alternatives considered**: Higher allocations for peak loads vs. auto-scaling - starting with fixed allocations and monitoring to determine auto-scaling needs
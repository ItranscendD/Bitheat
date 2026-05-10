# Bitheat Sync Protocol Spec v1.0

The Bitheat Sync Protocol is a resilient, offline-first data anchoring protocol designed for high-stakes medical records in displacement camps and low-connectivity zones.

## Core Principles

1. **Lazy Persistence**: Data is committed to local storage immediately. Sync to external ledgers (Blockchain, IPFS, API) happens lazily in the background when conditions are met.
2. **Connectivity Awareness**: Sync triggers are gated by connectivity tiers (2G, 3G, 4G, WiFi). High-bandwidth operations (like photo sync) are deferred until 4G/WiFi.
3. **Atomic Batching**: To reduce blockchain gas costs and API overhead, records are processed in batches (default: 10 records).
4. **Exponential Backoff**: Failed sync attempts trigger an exponential wait time to prevent system exhaustion during intermittent connectivity.

## Lifecycle of a Record

1. **Enqueue**: Record is saved to `IQueueStorage` with status `pending`.
2. **Scheduling**: `SyncEngine` checks connectivity and battery.
3. **Execution**: Batch is retrieved from queue. For each record, all registered `ISyncAdapter`s are called.
4. **Resolution**:
   - If ALL adapters succeed: Record marked `complete`.
   - If ANY adapter fails: `retryCount` incremented. After `maxRetries`, marked `failed`.

## Retry Algorithm

Wait time $W$ for retry $n$:
$W = 2^n \times 1000$ ms

| Retry | Delay |
|-------|-------|
| 1     | 2s    |
| 2     | 4s    |
| 3     | 8s    |
| 4     | 16s   |
| 5     | 32s   |

## Adapter Contracts

### ISyncAdapter
A destination for health data. Must be idempotent (handling duplicate records gracefully).

### IQueueStorage
Local persistent storage. Must ensure "Exactly Once" delivery to the SyncEngine.

# idbkv

Super basic indexeddb key-value store.

### Usage:

```ts
import { IDBKV } from "idbkv";

const store = new IDBKV<string, string>("my-db-name", "optional-store-name");

await store.set("key", "value");
```

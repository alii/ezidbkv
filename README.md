# ezidbkv

###### (easy indexeddb key-value)

Super basic indexeddb key-value store.

### Usage:

```ts
import { IDBKV } from "ezidbkv";

const store = new IDBKV<string, string>("my-db-name", "optional-store-name");

await store.set("key", "value");
```

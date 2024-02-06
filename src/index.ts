/**
 * Represents a key-value store using IndexedDB.
 *
 * @typeparam K - The type of the keys in the store.
 * @typeparam V - The type of the values in the store.
 */
export class IDBKV<K extends IDBValidKey, V> {
	private promise: Promise<IDBDatabase>;

	/**
	 * Constructs a new instance of the class.
	 * @param db The name of the database
	 * @param store The name of the store
	 */
	public constructor(private db: string, private store = "kv") {
		this.promise = this.open();
	}

	private open(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const openRequest = indexedDB.open(this.db, 1);
			openRequest.onupgradeneeded = () => {
				openRequest.result.createObjectStore(this.store);
			};
			openRequest.onsuccess = () => resolve(openRequest.result);
			openRequest.onerror = () => reject(openRequest.error);
		});
	}

	/**
	 * Retrieves the IDBObjectStore for the specified mode.
	 *
	 * @param mode - The transaction mode for accessing the object store.
	 * @returns A promise that resolves to the IDBObjectStore.
	 */
	private async access(mode: IDBTransactionMode): Promise<IDBObjectStore> {
		return this.promise.then(db => db.transaction(this.store, mode).objectStore(this.store));
	}

	/**
	 * Retrieves the value associated with the specified key from the object store.
	 * @param key - The key of the value to retrieve.
	 * @returns A promise that resolves with the retrieved value.
	 */
	async get(key: K): Promise<V> {
		const store = await this.access("readonly");
		return new Promise((resolve, reject) => {
			const request = store.get(key);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Sets the value for the specified key in the object store.
	 *
	 * @param key - The key to set the value for.
	 * @param val - The value to set.
	 * @returns A promise that resolves when the value is successfully set, or rejects with an error if an error occurs.
	 */
	async set(key: K, val: V): Promise<void> {
		const store = await this.access("readwrite");
		return new Promise((resolve, reject) => {
			const request = store.put(val, key);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Deletes a value from the object store based on the specified key.
	 *
	 * @param key - The key of the value to delete.
	 * @returns A promise that resolves when the value is successfully deleted, or rejects with an error if deletion fails.
	 */
	async delete(key: K): Promise<void> {
		const store = await this.access("readwrite");
		return new Promise((resolve, reject) => {
			const request = store.delete(key);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Clears all values from the object store.
	 * @returns A promise that resolves when the store is successfully cleared, or rejects with an error if an error occurs.
	 */
	async clear(): Promise<void> {
		const store = await this.access("readwrite");
		return new Promise((resolve, reject) => {
			const request = store.clear();
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Retrieves all the keys from the IndexedDB store.
	 *
	 * @returns A promise that resolves with an array of keys.
	 */
	async keys(): Promise<K[]> {
		const store = await this.access("readonly");
		return new Promise((resolve, reject) => {
			const request = store.getAllKeys();
			request.onsuccess = () => resolve(request.result as K[]);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Retrieves all the values stored in the database.
	 * @returns A promise that resolves with an array of values.
	 */
	async values(): Promise<V[]> {
		const store = await this.access("readonly");
		return new Promise((resolve, reject) => {
			const request = store.getAll();
			request.onsuccess = () => resolve(request.result as V[]);
			request.onerror = () => reject(request.error);
		});
	}
}

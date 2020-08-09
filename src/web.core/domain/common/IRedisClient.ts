import { RedisClient, ServerInfo } from 'redis';

export interface IRedisClient extends RedisClient {
    /**
     * Listen for all requests received by the server in real time.
     */
    monitorAsync(): Promise<undefined>;

    /**
     * Get information and statistics about the server.
     */
    infoAsync(): Promise<ServerInfo>;
    infoAsync(section?: string | string[]): Promise<ServerInfo>;

    /**
     * Ping the server.
     */
    pingAsync(): Promise<string>;
    pingAsync(message: string): Promise<string>;

    /**
     * Post a message to a channel.
     */
    publishAsync(channel: string, value: string): Promise<number>;

    /**
     * Authenticate to the server.
     */
    authAsync(password: string): Promise<string>;

    /**
     * Append a value to a key.
     */
    appendAsync(key: string, value: string): Promise<number>;

    /**
     * Asynchronously rewrite the append-only file.
     */
    bgrewriteaofAsync(): Promise<'OK'>;

    /**
     * Asynchronously save the dataset to disk.
     */
    bgsaveAsync(): Promise<string>;

    /**
     * Count set bits in a string.
     */
    bitcountAsync(key: string): Promise<number>;
    bitcountAsync(key: string, start: number, end: number): Promise<number>;

    /**
     * Perform bitwise operations between strings.
     */
    bitopAsync(operation: string, destkey: string, key1: string, key2: string, key3: string): Promise<number>;
    bitopAsync(operation: string, destkey: string, key1: string, key2: string): Promise<number>;
    bitopAsync(operation: string, destkey: string, key: string): Promise<number>;
    bitopAsync(operation: string, destkey: string, ...args: Array<string>): Promise<number>;

    /**
     * Find first bit set or clear in a string.
     */
    bitposAsync(key: string, bit: number, start: number, end: number): Promise<number>;
    bitposAsync(key: string, bit: number, start: number): Promise<number>;
    bitposAsync(key: string, bit: number): Promise<number>;

    /**
     * Pop a value from a list, push it to another list and return it; or block until one is available.
     */
    brpoplpushAsync(source: string, destination: string, timeout: number): Promise<string | null>;

    /**
     * Get array of Redis command details.
     *
     * COUNT - Get total number of Redis commands.
     * GETKEYS - Extract keys given a full Redis command.
     * INFO - Get array of specific REdis command details.
     */
    commandAsync(): Promise<Array<[string, number, string[], number, number, number]>>;

    /**
     * Return the number of keys in the selected database.
     */
    dbsizeAsync(): Promise<number>;

    /**
     * Decrement the integer value of a key by one.
     */
    decrAsync(key: string): Promise<number>;

    /**
     * Decrement the integer value of a key by the given number.
     */
    decrbyAsync(key: string, decrement: number): Promise<number>;

    /**
     * Discard all commands issued after MULTI.
     */
    discardAsync(): Promise<'OK'>;

    /**
     * Return a serialized version of the value stored at the specified key.
     */
    dumpAsync(key: string): Promise<string>;

    /**
     * Echo the given string.
     */
    echoAsync<T extends string>(message: T): Promise<T>;

    /**
     * Set a key's time to live in seconds.
     */
    expireAsync(key: string, seconds: number): Promise<number>;

    /**
     * Set the expiration for a key as a UNIX timestamp.
     */
    expireatAsync(key: string, timestamp: number): Promise<number>;

    /**
     * Remove all keys from all databases.
     */
    flushallAsync(): Promise<string>;
    flushallAsync(async: 'ASYNC'): Promise<string>;

    /**
     * Remove all keys from the current database.
     */
    flushdbAsync(): Promise<'OK'>;
    flushdbAsync(async: 'ASYNC'): Promise<string>;

    /**
     * Get the value of a key.
     */
    getAsync(key: string): Promise<string>;

    /**
     * Returns the bit value at offset in the string value stored at key.
     */
    getbitAsync(key: string, offset: number): Promise<number>;

    /**
     * Get a substring of the string stored at a key.
     */
    getrangeAsync(key: string, start: number, end: number): Promise<string>;

    /**
     * Set the string value of a key and return its old value.
     */
    getsetAsync(key: string, value: string): Promise<string>;

    /**
     * Determine if a hash field exists.
     */
    hexistsAsync(key: string, field: string): Promise<number>;

    /**
     * Get the value of a hash field.
     */
    hgetAsync(key: string, field: string): Promise<string>;
    // HGETAsync(key: string, field: string): Promise<string>;

    /**
     * Get all fields and values in a hash.
     */
    hgetallAsync(key: string): Promise<{ [key: string]: string }>;

    /**
     * Increment the integer value of a hash field by the given number.
     */
    hincrbyAsync(key: string, field: string, increment: number): Promise<number>;

    /**
     * Increment the float value of a hash field by the given amount.
     */
    hincrbyfloatAsync(key: string, field: string, increment: number): Promise<string>;

    /**
     * Get all the fields of a hash.
     */
    hkeysAsync(key: string): Promise<string[]>;

    /**
     * Get the number of fields in a hash.
     */
    hlenAsync(key: string): Promise<number>;

    /**
     * Set the string value of a hash field.
     */
    hsetAsync(key: string, field: string, value: string): Promise<number>;

    /**
     * Set the value of a hash field, only if the field does not exist.
     */
    hsetnxAsync(key: string, field: string, value: string): Promise<number>;

    /**
     * Get the length of the value of a hash field.
     */
    hstrlenAsync(key: string, field: string): Promise<number>;

    /**
     * Get all the values of a hash.
     */
    hvalsAsync(key: string): Promise<string[]>;

    /**
     * Increment the integer value of a key by one.
     */
    incrAsync(key: string): Promise<number>;

    /**
     * Increment the integer value of a key by the given amount.
     */
    incrbyAsync(key: string, increment: number): Promise<number>;

    /**
     * Increment the float value of a key by the given amount.
     */
    incrbyfloatAsync(key: string, increment: number): Promise<string>;

    /**
     * Find all keys matching the given pattern.
     */
    keysAsync(pattern: string): Promise<string[]>;

    /**
     * Get the UNIX time stamp of the last successful save to disk.
     */
    lastsaveAsync(): Promise<number>;

    /**
     * Get an element from a list by its index.
     */
    lindexAsync(key: string, index: number): Promise<string>;

    /**
     * Insert an element before or after another element in a list.
     */
    linsertAsync(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<string>;

    /**
     * Get the length of a list.
     */
    llenAsync(key: string): Promise<number>;

    /**
     * Remove and get the first element in a list.
     */
    lpopAsync(key: string): Promise<string>;

    /**
     * Prepend one or multiple values to a list.
     */
    lpushAsync: IOverloadedKeyCommandAsync<string, number>;

    /**
     * Prepend a value to a list, only if the list exists.
     */
    lpushxAsync(key: string, value: string): Promise<number>;

    /**
     * Get a range of elements from a list.
     */
    lrangeAsync(key: string, start: number, stop: number): Promise<string[]>;

    /**
     * Remove elements from a list.
     */
    lremAsync(key: string, count: number, value: string): Promise<number>;

    /**
     * Set the value of an element in a list by its index.
     */
    lsetAsync(key: string, index: number, value: string): Promise<'OK'>;

    /**
     * Trim a list to the specified range.
     */
    ltrimAsync(key: string, start: number, stop: number): Promise<'OK'>;

    /**
     * Move a key to another database.
     */
    move(key: string, db: string | number): any;

    /**
     * Remove the expiration from a key.
     */
    persistAsync(key: string): Promise<number>;

    /**
     * Remove a key's time to live in milliseconds.
     */
    pexpireAsync(key: string, milliseconds: number): Promise<number>;

    /**
     * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
     */
    pexpireatAsync(key: string, millisecondsTimestamp: number): Promise<number>;

    /**
     * Set the value and expiration in milliseconds of a key.
     */
    psetexAsync(key: string, milliseconds: number, value: string): Promise<'OK'>;

    /**
     * Get the time to live for a key in milliseconds.
     */
    pttlAsync(key: string): Promise<number>;

    /**
     * Close the connection.
     */
    quitAsync(): Promise<'OK'>;

    /**
     * Return a random key from the keyspace.
     */
    randomkeyAsync(): Promise<string>;

    /**
     * Enables read queries for a connection to a cluster slave node.
     */
    readonlyAsync(): Promise<string>;

    /**
     * Disables read queries for a connection to cluster slave node.
     */
    readwriteAsync(): Promise<string>;

    /**
     * Rename a key.
     */
    renameAsync(key: string, newkey: string): Promise<'OK'>;

    /**
     * Rename a key, only if the new key does not exist.
     */
    renamenxAsync(key: string, newkey: string): Promise<number>;

    /**
     * Create a key using the provided serialized value, previously obtained using DUMP.
     */
    restoreAsync(key: string, ttl: number, serializedValue: string): Promise<'OK'>;

    /**
     * Return the role of the instance in the context of replication.
     */
    roleAsync(): Promise<[string, number, Array<[string, string, string]>]>;

    /**
     * Remove and get the last element in a list.
     */
    rpopAsync(key: string): Promise<string>;

    /**
     * Remove the last element in a list, prepend it to another list and return it.
     */
    rpoplpushAsync(source: string, destination: string): Promise<string>;

    /**
     * Append a value to a list, only if the list exists.
     */
    rpushxAsync(key: string, value: string): Promise<number>;

    /**
     * Synchronously save the dataset to disk.
     */
    saveAsync(): Promise<string>;

    /**
     * Get the number of members in a set.
     */
    scardAsync(key: string): Promise<number>;

    /**
     * Change the selected database for the current connection.
     */
    selectAsync(index: number | string): Promise<string>;

    /**
     * Set the string value of a key.
     */
    setAsync(key: string, value: string): Promise<'OK'>;
    setAsync(key: string, value: string, flag: string): Promise<'OK'>;
    setAsync(key: string, value: string, mode: string, duration: number): Promise<'OK' | undefined>;
    setAsync(key: string, value: string, mode: string, duration: number, flag: string): Promise<'OK' | undefined>;

    /**
     * Sets or clears the bit at offset in the string value stored at key.
     */
    setbitAsync(key: string, offset: number, value: string): Promise<number>;

    /**
     * Set the value and expiration of a key.
     */
    setexAsync(key: string, seconds: number, value: string): Promise<string>;

    /**
     * Set the value of a key, only if the key does not exist.
     */
    setnxAsync(key: string, value: string): Promise<number>;

    /**
     * Overwrite part of a string at key starting at the specified offset.
     */
    setrangeAsync(key: string, offset: number, value: string): Promise<number>;

    /**
     * Determine if a given value is a member of a set.
     */
    sismemberAsync(key: string, member: string): Promise<number>;

    /**
     * Make the server a slave of another instance, or promote it as master.
     */
    slaveofAsync(host: string, port: string | number): Promise<string>;

    /**
     * Get all the members in a set.
     */
    smembersAsync(key: string): Promise<string[]>;

    /**
     * Move a member from one set to another.
     */
    smoveAsync(source: string, destination: string, member: string): Promise<number>;

    /**
     * Remove and return one or multiple random members from a set.
     */
    spopAsync(key: string): Promise<string>;
    spopAsync(key: string, count: number): Promise<string[]>;

    /**
     * Get one or multiple random members from a set.
     */
    srandmemberAsync(key: string): Promise<string>;
    srandmemberAsync(key: string, count: number): Promise<string[]>;

    /**
     * Get the length of the value stored in a key.
     */
    strlenAsync(key: string): Promise<number>;

    /**
     * Internal command used for replication.
     */
    syncAsync(): Promise<undefined>;

    /**
     * Return the current server time.
     */
    timeAsync(): Promise<[string, string]>;

    /**
     * Get the time to live for a key.
     */
    ttlAsync(key: string): Promise<number>;

    /**
     * Determine the type stored at key.
     */
    typeAsync(key: string): Promise<string>;

    /**
     * Forget about all watched keys.
     */
    unwatchAsync(): Promise<'OK'>;

    /**
     * Wait for the synchronous replication of all the write commands sent in the context of the current connection.
     */
    waitAsync(numslaves: number, timeout: number): Promise<number>;

    /**
     * Get the number of members in a sorted set.
     */
    zcardAsync(key: string): Promise<number>;

    /**
     * Count the members in a sorted set with scores between the given values.
     */
    zcountAsync(key: string, min: number | string, max: number | string): Promise<number>;

    /**
     * Increment the score of a member in a sorted set.
     */
    zincrbyAsync(key: string, increment: number, member: string): Promise<string>;

    /**
     * Count the number of members in a sorted set between a given lexicographic range.
     */
    zlexcountAsync(key: string, min: string, max: string): Promise<number>;

    /**
     * Return a range of members in a sorted set, by index.
     */
    zrangeAsync(key: string, start: number, stop: number): Promise<string[]>;
    zrangeAsync(key: string, start: number, stop: number, withscores: string): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by lexicographical range.
     */
    zrangebylexAsync(key: string, min: string, max: string): Promise<string[]>;
    zrangebylexAsync(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
     */
    zrevrangebylexAsync(key: string, min: string, max: string): Promise<string[]>;
    zrevrangebylexAsync(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by score.
     */
    zrangebyscoreAsync(key: string, min: number | string, max: number | string): Promise<string[]>;
    zrangebyscoreAsync(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;
    zrangebyscoreAsync(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;
    zrangebyscoreAsync(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Determine the index of a member in a sorted set.
     */
    zrankAsync(key: string, member: string): Promise<number | null>;

    /**
     * Remove all members in a sorted set between the given lexicographical range.
     */
    zremrangebylexAsync(key: string, min: string, max: string): Promise<number>;

    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyrankAsync(key: string, start: number, stop: number): Promise<number>;

    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyscoreAsync(key: string, min: string | number, max: string | number): Promise<number>;

    /**
     * Return a range of members in a sorted set, by index, with scores ordered from high to low.
     */
    zrevrangeAsync(key: string, start: number, stop: number): Promise<string[]>;
    zrevrangeAsync(key: string, start: number, stop: number, withscores: string): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by score, with scores ordered from high to low.
     */
    zrevrangebyscoreAsync(key: string, min: number | string, max: number | string): Promise<string[]>;
    zrevrangebyscoreAsync(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;
    zrevrangebyscoreAsync(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;
    zrevrangebyscoreAsync(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Determine the index of a member in a sorted set, with scores ordered from high to low.
     */
    zrevrankAsync(key: string, member: string): Promise<number | null>;

    /**
     * Get the score associated with the given member in a sorted set.
     */
    zscoreAsync(key: string, member: string): Promise<string>;
}

export interface IOverloadedKeyCommandAsync<T, T2> {
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<T2>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<T2>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T): Promise<T2>;
    (key: string, arg1: T, arg2: T, arg3: T): Promise<T2>;
    (key: string, arg1: T, arg2: T): Promise<T2>;
    (key: string, arg1: T | T[]): Promise<T2>;
    (key: string, ...args: Array<T>): Promise<T2>;
    (...args: Array<string | T>): Promise<T2>;
}

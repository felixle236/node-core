import { RedisClient, ServerInfo } from 'redis';

export interface IServerInfo {
    redis_version: string; // eslint-disable-line
    versions: number[];
}

export interface IOverloadedCommand<T, T2> {
    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<T2>;
    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<T2>;
    (arg1: T, arg2: T, arg3: T, arg4: T): Promise<T2>;
    (arg1: T, arg2: T, arg3: T): Promise<T2>;
    (arg1: T, arg2: T | T[]): Promise<T2>;
    (arg1: T | T[]): Promise<T2>;
    (...args: Array<T>): Promise<T2>;
}

export interface IOverloadedKeyCommand<T, T2> {
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<T2>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<T2>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T): Promise<T2>;
    (key: string, arg1: T, arg2: T, arg3: T): Promise<T2>;
    (key: string, arg1: T, arg2: T): Promise<T2>;
    (key: string, arg1: T | T[]): Promise<T2>;
    (key: string, ...args: Array<T>): Promise<T2>;
    (...args: Array<string | T>): Promise<T2>;
}

export interface IOverloadedListCommand<T, T2> {
    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<T2>;
    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<T2>;
    (arg1: T, arg2: T, arg3: T, arg4: T): Promise<T2>;
    (arg1: T, arg2: T, arg3: T): Promise<T2>;
    (arg1: T, arg2: T): Promise<T2>;
    (arg1: T | T[]): Promise<T2>;
    (...args: Array<T>): Promise<T2>;
}

export interface IOverloadedSetCommand<T, T2> {
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<T2>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<T2>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T): Promise<T2>;
    (key: string, arg1: T, arg2: T, arg3: T): Promise<T2>;
    (key: string, arg1: T, arg2: T): Promise<T2>;
    (key: string, arg1: T | { [key: string]: T } | T[]): Promise<T2>;
    (key: string, ...args: Array<T>): Promise<T2>;
    (args: [string, ...T[]]): Promise<T2>;
}

export interface IOverloadedLastCommand<T1, T2, T3> {
    (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T1, arg6: T2): Promise<T3>;
    (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T2): Promise<T3>;
    (arg1: T1, arg2: T1, arg3: T1, arg4: T2): Promise<T3>;
    (arg1: T1, arg2: T1, arg3: T2): Promise<T3>;
    (arg1: T1, arg2: T2 | Array<T1 | T2>): Promise<T3>;
    (args: Array<T1 | T2>): Promise<T3>;
    (...args: Array<T1 | T2>): Promise<T3>;
}

export interface IRedisClient extends RedisClient {
    monitorAsync(): Promise<undefined>;
    MONITORASYNC(): Promise<undefined>;

    /**
     * Get information and statistics about the server.
     */
    infoAsync(): Promise<ServerInfo>;
    infoAsync(section?: string | string[]): Promise<ServerInfo>;
    INFOASYNC(): Promise<ServerInfo>;
    INFOASYNC(section?: string | string[]): Promise<ServerInfo>;

    /**
     * Ping the server.
     */
    pingAsync(): Promise<string>;
    pingAsync(message: string): Promise<string>;
    PINGASYNC(): Promise<string>;
    PINGASYNC(message: string): Promise<string>;

    /**
     * Post a message to a channel.
     */
    publishAsync(channel: string, value: string): Promise<number>;
    PUBLISHASYNC(channel: string, value: string): Promise<number>;

    /**
     * Authenticate to the server.
     */
    authAsync(password: string): Promise<string>;
    AUTHASYNC(password: string): Promise<string>;

    /**
     * KILL - Kill the connection of a client.
     * LIST - Get the list of client connections.
     * GETNAME - Get the current connection name.
     * PAUSE - Stop processing commands from clients for some time.
     * REPLY - Instruct the server whether to reply to commands.
     * SETNAME - Set the current connection name.
     */
    clientAsync: IOverloadedCommand<string, any>;
    CLIENTASYNC: IOverloadedCommand<string, any>;

    /**
     * Set multiple hash fields to multiple values.
     */
    hmsetAsync: IOverloadedSetCommand<string | number, 'OK'>;
    HMSETASYNC: IOverloadedSetCommand<string | number, 'OK'>;

    /**
     * Listen for messages published to the given channels.
     */
    subscribeAsync: IOverloadedListCommand<string, string>;
    SUBSCRIBEASYNC: IOverloadedListCommand<string, string>;

    /**
     * Stop listening for messages posted to the given channels.
     */
    unsubscribeAsync: IOverloadedListCommand<string, string>;
    UNSUBSCRIBEASYNC: IOverloadedListCommand<string, string>;

    /**
     * Listen for messages published to channels matching the given patterns.
     */
    psubscribeAsync: IOverloadedListCommand<string, string>;
    PSUBSCRIBEASYNC: IOverloadedListCommand<string, string>;

    /**
     * Stop listening for messages posted to channels matching the given patterns.
     */
    punsubscribeAsync: IOverloadedListCommand<string, string>;
    PUNSUBSCRIBEASYNC: IOverloadedListCommand<string, string>;

    /**
     * Append a value to a key.
     */
    appendAsync(key: string, value: string): Promise<number>;
    APPENDASYNC(key: string, value: string): Promise<number>;

    /**
     * Asynchronously rewrite the append-only file.
     */
    bgrewriteaofAsync(): Promise<'OK'>;
    BGREWRITEAOFASYNC(): Promise<'OK'>;

    /**
     * Asynchronously save the dataset to disk.
     */
    bgsaveAsync(): Promise<string>;
    BGSAVEASYNC(): Promise<string>;

    /**
     * Count set bits in a string.
     */
    bitcountAsync(key: string): Promise<number>;
    bitcountAsync(key: string, start: number, end: number): Promise<number>;
    BITCOUNTASYNC(key: string): Promise<number>;
    BITCOUNTASYNC(key: string, start: number, end: number): Promise<number>;

    /**
     * Perform arbitrary bitfield integer operations on strings.
     */
    bitfieldAsync: IOverloadedKeyCommand<string | number, [number, number]>;
    BITFIELDASYNC: IOverloadedKeyCommand<string | number, [number, number]>;

    /**
     * Perform bitwise operations between strings.
     */
    bitopAsync(operation: string, destkey: string, key1: string, key2: string, key3: string): Promise<number>;
    bitopAsync(operation: string, destkey: string, key1: string, key2: string): Promise<number>;
    bitopAsync(operation: string, destkey: string, key: string): Promise<number>;
    bitopAsync(operation: string, destkey: string, ...args: Array<string>): Promise<number>;
    BITOPASYNC(operation: string, destkey: string, key1: string, key2: string, key3: string): Promise<number>;
    BITOPASYNC(operation: string, destkey: string, key1: string, key2: string): Promise<number>;
    BITOPASYNC(operation: string, destkey: string, key: string): Promise<number>;
    BITOPASYNC(operation: string, destkey: string, ...args: Array<string>): Promise<number>;

    /**
     * Find first bit set or clear in a string.
     */
    bitposAsync(key: string, bit: number, start: number, end: number): Promise<number>;
    bitposAsync(key: string, bit: number, start: number): Promise<number>;
    bitposAsync(key: string, bit: number): Promise<number>;
    BITPOSASYNC(key: string, bit: number, start: number, end: number): Promise<number>;
    BITPOSASYNC(key: string, bit: number, start: number): Promise<number>;
    BITPOSASYNC(key: string, bit: number): Promise<number>;

    /**
     * Remove and get the first element in a list, or block until one is available.
     */
    blpopAsync: IOverloadedLastCommand<string, number, [string, string]>;
    BLPOPASYNC: IOverloadedLastCommand<string, number, [string, string]>;

    /**
     * Remove and get the last element in a list, or block until one is available.
     */
    brpopAsync: IOverloadedLastCommand<string, number, [string, string]>;
    BRPOPASYNC: IOverloadedLastCommand<string, number, [string, string]>;

    /**
     * Pop a value from a list, push it to another list and return it; or block until one is available.
     */
    brpoplpushAsync(source: string, destination: string, timeout: number): Promise<string | null>;
    BRPOPLPUSHASYNC(source: string, destination: string, timeout: number): Promise<string | null>;

    /**
     * ADDSLOTS - Assign new hash slots to receiving node.
     * COUNT-FAILURE-REPORTS - Return the number of failure reports active for a given node.
     * COUNTKEYSINSLOT - Return the number of local keys in the specified hash slot.
     * DELSLOTS - Set hash slots as unbound in receiving node.
     * FAILOVER - Forces a slave to perform a manual failover of its master.
     * FORGET - Remove a node from the nodes table.
     * GETKEYSINSLOT - Return local key names in the specified hash slot.
     * INFO - Provides info about Redis Cluster node state.
     * KEYSLOT - Returns the hash slot of the specified key.
     * MEET - Force a node cluster to handshake with another node.
     * NODES - Get cluster config for the node.
     * REPLICATE - Reconfigure a node as a slave of the specified master node.
     * RESET - Reset a Redis Cluster node.
     * SAVECONFIG - Forces the node to save cluster state on disk.
     * SET-CONFIG-EPOCH - Set the configuration epoch in a new node.
     * SETSLOT - Bind a hash slot to a specified node.
     * SLAVES - List slave nodes of the specified master node.
     * SLOTS - Get array of Cluster slot to node mappings.
     */
    clusterAsync: IOverloadedCommand<string, any>;
    CLUSTERASYNC: IOverloadedCommand<string, any>;

    /**
     * Get array of Redis command details.
     *
     * COUNT - Get total number of Redis commands.
     * GETKEYS - Extract keys given a full Redis command.
     * INFO - Get array of specific REdis command details.
     */
    commandAsync(): Promise<Array<[string, number, string[], number, number, number]>>;
    COMMANDASYNC(): Promise<Array<[string, number, string[], number, number, number]>>;

    /**
     * Get array of Redis command details.
     *
     * COUNT - Get array of Redis command details.
     * GETKEYS - Extract keys given a full Redis command.
     * INFO - Get array of specific Redis command details.
     * GET - Get the value of a configuration parameter.
     * REWRITE - Rewrite the configuration file with the in memory configuration.
     * SET - Set a configuration parameter to the given value.
     * RESETSTAT - Reset the stats returned by INFO.
     */
    configAsync: IOverloadedCommand<string, boolean>;
    CONFIGASYNC: IOverloadedCommand<string, boolean>;

    /**
     * Return the number of keys in the selected database.
     */
    dbsizeAsync(): Promise<number>;
    DBSIZEASYNC(): Promise<number>;

    /**
     * OBJECT - Get debugging information about a key.
     * SEGFAULT - Make the server crash.
     */
    debugAsync: IOverloadedCommand<string, boolean>;
    DEBUGASYNC: IOverloadedCommand<string, boolean>;

    /**
     * Decrement the integer value of a key by one.
     */
    decrAsync(key: string): Promise<number>;
    DECRASYNC(key: string): Promise<number>;

    /**
     * Decrement the integer value of a key by the given number.
     */
    decrbyAsync(key: string, decrement: number): Promise<number>;
    DECRBYASYNC(key: string, decrement: number): Promise<number>;

    /**
     * Delete a key.
     */
    delAsync: IOverloadedCommand<string, number>;
    DELASYNC: IOverloadedCommand<string, number>;

    /**
     * Discard all commands issued after MULTI.
     */
    discardAsync(): Promise<'OK'>;
    DISCARDASYNC(): Promise<'OK'>;

    /**
     * Return a serialized version of the value stored at the specified key.
     */
    dumpAsync(key: string): Promise<string>;
    DUMPASYNC(key: string): Promise<string>;

    /**
     * Echo the given string.
     */
    echoAsync<T extends string>(message: T): Promise<T>;
    ECHOASYNC<T extends string>(message: T): Promise<T>;

    /**
     * Execute a Lua script server side.
     */
    evalAsync: IOverloadedCommand<string | number, any>;
    EVALASYNC: IOverloadedCommand<string | number, any>;

    /**
     * Execute a Lue script server side.
     */
    evalshaAsync: IOverloadedCommand<string | number, any>;
    EVALSHAASYNC: IOverloadedCommand<string | number, any>;

    /**
     * Determine if a key exists.
     */
    existsAsync: IOverloadedCommand<string, number>;
    EXISTSASYNC: IOverloadedCommand<string, number>;

    /**
     * Set a key's time to live in seconds.
     */
    expireAsync(key: string, seconds: number): Promise<number>;
    EXPIREASYNC(key: string, seconds: number): Promise<number>;

    /**
     * Set the expiration for a key as a UNIX timestamp.
     */
    expireatAsync(key: string, timestamp: number): Promise<number>;
    EXPIREATASYNC(key: string, timestamp: number): Promise<number>;

    /**
     * Remove all keys from all databases.
     */
    flushallAsync(): Promise<string>;
    flushallAsync(async: 'ASYNC'): Promise<string>;
    FLUSHALLASYNC(): Promise<string>;
    FLUSHALLASYNC(async: 'ASYNC'): Promise<string>;

    /**
     * Remove all keys from the current database.
     */
    flushdbAsync(): Promise<'OK'>;
    flushdbAsync(async: 'ASYNC'): Promise<string>;
    FLUSHDBASYNC(): Promise<'OK'>;
    FLUSHDBASYNC(async: 'ASYNC'): Promise<string>;

    /**
     * Add one or more geospatial items in the geospatial index represented using a sorted set.
     */
    geoaddAsync: IOverloadedKeyCommand<string | number, number>;
    GEOADDASYNC: IOverloadedKeyCommand<string | number, number>;

    /**
     * Returns members of a geospatial index as standard geohash strings.
     */
    geohashAsync: IOverloadedKeyCommand<string, string>;
    GEOHASHASYNC: IOverloadedKeyCommand<string, string>;

    /**
     * Returns longitude and latitude of members of a geospatial index.
     */
    geoposAsync: IOverloadedKeyCommand<string, Array<[number, number]>>;
    GEOPOSASYNC: IOverloadedKeyCommand<string, Array<[number, number]>>;

    /**
     * Returns the distance between two members of a geospatial index.
     */
    geodistAsync: IOverloadedKeyCommand<string, string>;
    GEODISTASYNC: IOverloadedKeyCommand<string, string>;

    /**
     * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.
     */
    georadiusAsync: IOverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>>;
    GEORADIUSASYNC: IOverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>>;

    /**
     * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.
     */
    georadiusbymemberAsync: IOverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>>;
    GEORADIUSBYMEMBERASYNC: IOverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>>;

    /**
     * Get the value of a key.
     */
    getAsync(key: string): Promise<string | null>;
    GETASYNC(key: string): Promise<string | null>;

    /**
     * Returns the bit value at offset in the string value stored at key.
     */
    getbitAsync(key: string, offset: number): Promise<number>;
    GETBITASYNC(key: string, offset: number): Promise<number>;

    /**
     * Get a substring of the string stored at a key.
     */
    getrangeAsync(key: string, start: number, end: number): Promise<string>;
    GETRANGEASYNC(key: string, start: number, end: number): Promise<string>;

    /**
     * Set the string value of a key and return its old value.
     */
    getsetAsync(key: string, value: string): Promise<string>;
    GETSETASYNC(key: string, value: string): Promise<string>;

    /**
     * Delete on or more hash fields.
     */
    hdelAsync: IOverloadedKeyCommand<string, number>;
    HDELASYNC: IOverloadedKeyCommand<string, number>;

    /**
     * Determine if a hash field exists.
     */
    hexistsAsync(key: string, field: string): Promise<number>;
    HEXISTSASYNC(key: string, field: string): Promise<number>;

    /**
     * Get the value of a hash field.
     */
    hgetAsync(key: string, field: string): Promise<string>;
    HGETASYNC(key: string, field: string): Promise<string>;

    /**
     * Get all fields and values in a hash.
     */
    hgetallAsync(key: string): Promise<{ [key: string]: string }>;
    HGETALLASYNC(key: string): Promise<{ [key: string]: string }>;

    /**
     * Increment the integer value of a hash field by the given number.
     */
    hincrbyAsync(key: string, field: string, increment: number): Promise<number>;
    HINCRBYASYNC(key: string, field: string, increment: number): Promise<number>;

    /**
     * Increment the float value of a hash field by the given amount.
     */
    hincrbyfloatAsync(key: string, field: string, increment: number): Promise<string>;
    HINCRBYFLOATASYNC(key: string, field: string, increment: number): Promise<string>;

    /**
     * Get all the fields of a hash.
     */
    hkeysAsync(key: string): Promise<string[]>;
    HKEYSASYNC(key: string): Promise<string[]>;

    /**
     * Get the number of fields in a hash.
     */
    hlenAsync(key: string): Promise<number>;
    HLENASYNC(key: string): Promise<number>;

    /**
     * Get the values of all the given hash fields.
     */
    hmgetAsync: IOverloadedKeyCommand<string, string[]>;
    HMGETASYNC: IOverloadedKeyCommand<string, string[]>;

    /**
     * Set the string value of a hash field.
     */
    hsetAsync: IOverloadedSetCommand<string, number>;
    HSETASYNC: IOverloadedSetCommand<string, number>;

    /**
     * Set the value of a hash field, only if the field does not exist.
     */
    hsetnxAsync(key: string, field: string, value: string): Promise<number>;
    HSETNXASYNC(key: string, field: string, value: string): Promise<number>;

    /**
     * Get the length of the value of a hash field.
     */
    hstrlenAsync(key: string, field: string): Promise<number>;
    HSTRLENASYNC(key: string, field: string): Promise<number>;

    /**
     * Get all the values of a hash.
     */
    hvalsAsync(key: string): Promise<string[]>;
    HVALSASYNC(key: string): Promise<string[]>;

    /**
     * Increment the integer value of a key by one.
     */
    incrAsync(key: string): Promise<number>;
    INCRASYNC(key: string): Promise<number>;

    /**
     * Increment the integer value of a key by the given amount.
     */
    incrbyAsync(key: string, increment: number): Promise<number>;
    INCRBYASYNC(key: string, increment: number): Promise<number>;

    /**
     * Increment the float value of a key by the given amount.
     */
    incrbyfloatAsync(key: string, increment: number): Promise<string>;
    INCRBYFLOATASYNC(key: string, increment: number): Promise<string>;

    /**
     * Find all keys matching the given pattern.
     */
    keysAsync(pattern: string): Promise<string[]>;
    KEYSASYNC(pattern: string): Promise<string[]>;

    /**
     * Get the UNIX time stamp of the last successful save to disk.
     */
    lastsaveAsync(): Promise<number>;
    LASTSAVEASYNC(): Promise<number>;

    /**
     * Get an element from a list by its index.
     */
    lindexAsync(key: string, index: number): Promise<string>;
    LINDEXASYNC(key: string, index: number): Promise<string>;

    /**
     * Insert an element before or after another element in a list.
     */
    linsertAsync(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<string>;
    LINSERTASYNC(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<string>;

    /**
     * Get the length of a list.
     */
    llenAsync(key: string): Promise<number>;
    LLENASYNC(key: string): Promise<number>;

    /**
     * Remove and get the first element in a list.
     */
    lpopAsync(key: string): Promise<string>;
    LPOPASYNC(key: string): Promise<string>;

    /**
     * Prepend one or multiple values to a list.
     */
    lpushAsync: IOverloadedKeyCommand<string, number>;
    LPUSHASYNC: IOverloadedKeyCommand<string, number>;

    /**
     * Prepend a value to a list, only if the list exists.
     */
    lpushxAsync(key: string, value: string): Promise<number>;
    LPUSHXASYNC(key: string, value: string): Promise<number>;

    /**
     * Get a range of elements from a list.
     */
    lrangeAsync(key: string, start: number, stop: number): Promise<string[]>;
    LRANGEASYNC(key: string, start: number, stop: number): Promise<string[]>;

    /**
     * Remove elements from a list.
     */
    lremAsync(key: string, count: number, value: string): Promise<number>;
    LREMASYNC(key: string, count: number, value: string): Promise<number>;

    /**
     * Set the value of an element in a list by its index.
     */
    lsetAsync(key: string, index: number, value: string): Promise<'OK'>;
    LSETASYNC(key: string, index: number, value: string): Promise<'OK'>;

    /**
     * Trim a list to the specified range.
     */
    ltrimAsync(key: string, start: number, stop: number): Promise<'OK'>;
    LTRIMASYNC(key: string, start: number, stop: number): Promise<'OK'>;

    /**
     * Get the values of all given keys.
     */
    mgetAsync: IOverloadedCommand<string, string[]>;
    MGETASYNC: IOverloadedCommand<string, string[]>;

    /**
     * Atomically tranfer a key from a Redis instance to another one.
     */
    migrateAsync: IOverloadedCommand<string, boolean>;
    MIGRATEASYNC: IOverloadedCommand<string, boolean>;

    /**
     * Move a key to another database.
     */
    moveAsync(key: string, db: string | number): boolean;
    MOVE(key: string, db: string | number): boolean;

    /**
     * Set multiple keys to multiple values.
     */
    msetAsync: IOverloadedCommand<string, boolean>;
    MSETASYNC: IOverloadedCommand<string, boolean>;

    /**
     * Set multiple keys to multiple values, only if none of the keys exist.
     */
    msetnxAsync: IOverloadedCommand<string, boolean>;
    MSETNXASYNC: IOverloadedCommand<string, boolean>;

    /**
     * Inspect the internals of Redis objects.
     */
    objectAsync: IOverloadedCommand<string, any>;
    OBJECTASYNC: IOverloadedCommand<string, any>;

    /**
     * Remove the expiration from a key.
     */
    persistAsync(key: string): Promise<number>;
    PERSISTASYNC(key: string): Promise<number>;

    /**
     * Remove a key's time to live in milliseconds.
     */
    pexpireAsync(key: string, milliseconds: number): Promise<number>;
    PEXPIREASYNC(key: string, milliseconds: number): Promise<number>;

    /**
     * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
     */
    pexpireatAsync(key: string, millisecondsTimestamp: number): Promise<number>;
    PEXPIREATASYNC(key: string, millisecondsTimestamp: number): Promise<number>;

    /**
     * Adds the specified elements to the specified HyperLogLog.
     */
    pfaddAsync: IOverloadedKeyCommand<string, number>;
    PFADDASYNC: IOverloadedKeyCommand<string, number>;

    /**
     * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
     */
    pfcountAsync: IOverloadedCommand<string, number>;
    PFCOUNTASYNC: IOverloadedCommand<string, number>;

    /**
     * Merge N different HyperLogLogs into a single one.
     */
    pfmergeAsync: IOverloadedCommand<string, boolean>;
    PFMERGEASYNC: IOverloadedCommand<string, boolean>;

    /**
     * Set the value and expiration in milliseconds of a key.
     */
    psetexAsync(key: string, milliseconds: number, value: string): Promise<'OK'>;
    PSETEXASYNC(key: string, milliseconds: number, value: string): Promise<'OK'>;

    /**
     * Inspect the state of the Pub/Sub subsytem.
     */
    pubsubAsync: IOverloadedCommand<string, number>;
    PUBSUBASYNC: IOverloadedCommand<string, number>;

    /**
     * Get the time to live for a key in milliseconds.
     */
    pttlAsync(key: string): Promise<number>;
    PTTLASYNC(key: string): Promise<number>;

    /**
     * Close the connection.
     */
    quitAsync(): Promise<'OK'>;
    QUITASYNC(): Promise<'OK'>;

    /**
     * Return a random key from the keyspace.
     */
    randomkeyAsync(): Promise<string>;
    RANDOMKEYASYNC(): Promise<string>;

    /**
     * Enables read queries for a connection to a cluster slave node.
     */
    readonlyAsync(): Promise<string>;
    READONLYASYNC(): Promise<string>;

    /**
     * Disables read queries for a connection to cluster slave node.
     */
    readwriteAsync(): Promise<string>;
    READWRITEASYNC(): Promise<string>;

    /**
     * Rename a key.
     */
    renameAsync(key: string, newkey: string): Promise<'OK'>;
    RENAMEASYNC(key: string, newkey: string): Promise<'OK'>;

    /**
     * Rename a key, only if the new key does not exist.
     */
    renamenxAsync(key: string, newkey: string): Promise<number>;
    RENAMENXASYNC(key: string, newkey: string): Promise<number>;

    /**
     * Create a key using the provided serialized value, previously obtained using DUMP.
     */
    restoreAsync(key: string, ttl: number, serializedValue: string): Promise<'OK'>;
    RESTOREASYNC(key: string, ttl: number, serializedValue: string): Promise<'OK'>;

    /**
     * Return the role of the instance in the context of replication.
     */
    roleAsync(): Promise<[string, number, Array<[string, string, string]>]>;
    ROLEASYNC(): Promise<[string, number, Array<[string, string, string]>]>;

    /**
     * Remove and get the last element in a list.
     */
    rpopAsync(key: string): Promise<string>;
    RPOPASYNC(key: string): Promise<string>;

    /**
     * Remove the last element in a list, prepend it to another list and return it.
     */
    rpoplpushAsync(source: string, destination: string): Promise<string>;
    RPOPLPUSHASYNC(source: string, destination: string): Promise<string>;

    /**
     * Append one or multiple values to a list.
     */
    rpushAsync: IOverloadedKeyCommand<string, number>;
    RPUSHASYNC: IOverloadedKeyCommand<string, number>;

    /**
     * Append a value to a list, only if the list exists.
     */
    rpushxAsync(key: string, value: string): Promise<number>;
    RPUSHXASYNC(key: string, value: string): Promise<number>;

    /**
     * Append one or multiple members to a set.
     */
    saddAsync: IOverloadedKeyCommand<string, number>;
    SADDASYNC: IOverloadedKeyCommand<string, number>;

    /**
     * Synchronously save the dataset to disk.
     */
    saveAsync(): Promise<string>;
    SAVEASYNC(): Promise<string>;

    /**
     * Get the number of members in a set.
     */
    scardAsync(key: string): Promise<number>;
    SCARDASYNC(key: string): Promise<number>;

    /**
     * DEBUG - Set the debug mode for executed scripts.
     * EXISTS - Check existence of scripts in the script cache.
     * FLUSH - Remove all scripts from the script cache.
     * KILL - Kill the script currently in execution.
     * LOAD - Load the specified Lua script into the script cache.
     */
    scriptAsync: IOverloadedCommand<string, any>;
    SCRIPTASYNC: IOverloadedCommand<string, any>;

    /**
     * Subtract multiple sets.
     */
    sdiffAsync: IOverloadedCommand<string, string[]>;
    SDIFFASYNC: IOverloadedCommand<string, string[]>;

    /**
     * Subtract multiple sets and store the resulting set in a key.
     */
    sdiffstoreAsync: IOverloadedKeyCommand<string, number>;
    SDIFFSTOREASYNC: IOverloadedKeyCommand<string, number>;

    /**
     * Change the selected database for the current connection.
     */
    selectAsync(index: number | string): Promise<string>;
    SELECTASYNC(index: number | string): Promise<string>;

    /**
     * Set the string value of a key.
     */
    setAsync(key: string, value: string): Promise<'OK'>;
    setAsync(key: string, value: string, flag: string): Promise<'OK'>;
    setAsync(key: string, value: string, mode: string, duration: number): Promise<'OK' | undefined>;
    setAsync(key: string, value: string, mode: string, duration: number, flag: string): Promise<'OK' | undefined>;
    SETASYNC(key: string, value: string): Promise<'OK'>;
    SETASYNC(key: string, value: string, flag: string): Promise<'OK'>;
    SETASYNC(key: string, value: string, mode: string, duration: number): Promise<'OK' | undefined>;
    SETASYNC(key: string, value: string, mode: string, duration: number, flag: string): Promise<'OK' | undefined>;

    /**
     * Sets or clears the bit at offset in the string value stored at key.
     */
    setbitAsync(key: string, offset: number, value: string): Promise<number>;
    SETBITASYNC(key: string, offset: number, value: string): Promise<number>;

    /**
     * Set the value and expiration of a key.
     */
    setexAsync(key: string, seconds: number, value: string): Promise<string>;
    SETEXASYNC(key: string, seconds: number, value: string): Promise<string>;

    /**
     * Set the value of a key, only if the key does not exist.
     */
    setnxAsync(key: string, value: string): Promise<number>;
    SETNXASYNC(key: string, value: string): Promise<number>;

    /**
     * Overwrite part of a string at key starting at the specified offset.
     */
    setrangeAsync(key: string, offset: number, value: string): Promise<number>;
    SETRANGEASYNC(key: string, offset: number, value: string): Promise<number>;

    /**
     * Synchronously save the dataset to disk and then shut down the server.
     */
    shutdownAsync: IOverloadedCommand<string, string>;
    SHUTDOWNASYNC: IOverloadedCommand<string, string>;

    /**
     * Intersect multiple sets.
     */
    sinterAsync: IOverloadedKeyCommand<string, string[]>;
    SINTERASYNC: IOverloadedKeyCommand<string, string[]>;

    /**
     * Intersect multiple sets and store the resulting set in a key.
     */
    sinterstoreAsync: IOverloadedCommand<string, number>;
    SINTERSTOREASYNC: IOverloadedCommand<string, number>;

    /**
     * Determine if a given value is a member of a set.
     */
    sismemberAsync(key: string, member: string): Promise<number>;
    SISMEMBERASYNC(key: string, member: string): Promise<number>;

    /**
     * Make the server a slave of another instance, or promote it as master.
     */
    slaveofAsync(host: string, port: string | number): Promise<string>;
    SLAVEOFASYNC(host: string, port: string | number): Promise<string>;

    /**
     * Manages the Redis slow queries log.
     */
    slowlogAsync: IOverloadedCommand<string, Array<[number, number, number, string[]]>>;
    SLOWLOGASYNC: IOverloadedCommand<string, Array<[number, number, number, string[]]>>;

    /**
     * Get all the members in a set.
     */
    smembersAsync(key: string): Promise<string[]>;
    SMEMBERSASYNC(key: string): Promise<string[]>;

    /**
     * Move a member from one set to another.
     */
    smoveAsync(source: string, destination: string, member: string): Promise<number>;
    SMOVEASYNC(source: string, destination: string, member: string): Promise<number>;

    /**
     * Sort the elements in a list, set or sorted set.
     */
    sortAsync: IOverloadedCommand<string, string[]>;
    SORTASYNC: IOverloadedCommand<string, string[]>;

    /**
     * Remove and return one or multiple random members from a set.
     */
    spopAsync(key: string): Promise<string>;
    spopAsync(key: string, count: number): Promise<string[]>;
    SPOPASYNC(key: string): Promise<string>;
    SPOPASYNC(key: string, count: number): Promise<string[]>;

    /**
     * Get one or multiple random members from a set.
     */
    srandmemberAsync(key: string): Promise<string>;
    srandmemberAsync(key: string, count: number): Promise<string[]>;
    SRANDMEMBERASYNC(key: string): Promise<string>;
    SRANDMEMBERASYNC(key: string, count: number): Promise<string[]>;

    /**
     * Remove one or more members from a set.
     */
    sremAsync: IOverloadedKeyCommand<string, number>;
    SREMASYNC: IOverloadedKeyCommand<string, number>;

    /**
     * Get the length of the value stored in a key.
     */
    strlenAsync(key: string): Promise<number>;
    STRLENASYNC(key: string): Promise<number>;

    /**
     * Add multiple sets.
     */
    sunionAsync: IOverloadedCommand<string, string[]>;
    SUNIONASYNC: IOverloadedCommand<string, string[]>;

    /**
     * Add multiple sets and store the resulting set in a key.
     */
    sunionstoreAsync: IOverloadedCommand<string, number>;
    SUNIONSTOREASYNC: IOverloadedCommand<string, number>;

    /**
     * Internal command used for replication.
     */
    syncAsync(): Promise<undefined>;
    SYNCASYNC(): Promise<undefined>;

    /**
     * Return the current server time.
     */
    timeAsync(): Promise<[string, string]>;
    TIMEASYNC(): Promise<[string, string]>;

    /**
     * Get the time to live for a key.
     */
    ttlAsync(key: string): Promise<number>;
    TTLASYNC(key: string): Promise<number>;

    /**
     * Determine the type stored at key.
     */
    typeAsync(key: string): Promise<string>;
    TYPEASYNC(key: string): Promise<string>;

    /**
     * Deletes a key in a non-blocking manner.
     * Very similar to DEL, but actual memory reclamation
     * happens in a different thread, making this non-blocking.
     */
    unlinkAsync: IOverloadedCommand<string, number>;
    UNLINKASYNC: IOverloadedCommand<string, number>;

    /**
     * Forget about all watched keys.
     */
    unwatchAsync(): Promise<'OK'>;
    UNWATCHASYNC(): Promise<'OK'>;

    /**
     * Wait for the synchronous replication of all the write commands sent in the context of the current connection.
     */
    waitAsync(numslaves: number, timeout: number): Promise<number>;
    WAITASYNC(numslaves: number, timeout: number): Promise<number>;

    /**
     * Watch the given keys to determine execution of the MULTI/EXEC block.
     */
    watchAsync: IOverloadedCommand<string, 'OK'>;
    WATCHASYNC: IOverloadedCommand<string, 'OK'>;

    /**
     * Add one or more members to a sorted set, or update its score if it already exists.
     */
    zaddAsync: IOverloadedKeyCommand<string | number, number>;
    ZADDASYNC: IOverloadedKeyCommand<string | number, number>;

    /**
     * Get the number of members in a sorted set.
     */
    zcardAsync(key: string): Promise<number>;
    ZCARDASYNC(key: string): Promise<number>;

    /**
     * Count the members in a sorted set with scores between the given values.
     */
    zcountAsync(key: string, min: number | string, max: number | string): Promise<number>;
    ZCOUNTASYNC(key: string, min: number | string, max: number | string): Promise<number>;

    /**
     * Increment the score of a member in a sorted set.
     */
    zincrbyAsync(key: string, increment: number, member: string): Promise<string>;
    ZINCRBYASYNC(key: string, increment: number, member: string): Promise<string>;

    /**
     * Intersect multiple sorted sets and store the resulting sorted set in a new key.
     */
    zinterstoreAsync: IOverloadedCommand<string | number, number>;
    ZINTERSTOREASYNC: IOverloadedCommand<string | number, number>;

    /**
     * Count the number of members in a sorted set between a given lexicographic range.
     */
    zlexcountAsync(key: string, min: string, max: string): Promise<number>;
    ZLEXCOUNTASYNC(key: string, min: string, max: string): Promise<number>;

    /**
     * Return a range of members in a sorted set, by index.
     */
    zrangeAsync(key: string, start: number, stop: number): Promise<string[]>;
    zrangeAsync(key: string, start: number, stop: number, withscores: string): Promise<string[]>;
    ZRANGEASYNC(key: string, start: number, stop: number): Promise<string[]>;
    ZRANGEASYNC(key: string, start: number, stop: number, withscores: string): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by lexicographical range.
     */
    zrangebylexAsync(key: string, min: string, max: string): Promise<string[]>;
    zrangebylexAsync(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;
    ZRANGEBYLEXASYNC(key: string, min: string, max: string): Promise<string[]>;
    ZRANGEBYLEXASYNC(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
     */
    zrevrangebylexAsync(key: string, min: string, max: string): Promise<string[]>;
    zrevrangebylexAsync(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;
    ZREVRANGEBYLEXASYNC(key: string, min: string, max: string): Promise<string[]>;
    ZREVRANGEBYLEXASYNC(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by score.
     */
    zrangebyscoreAsync(key: string, min: number | string, max: number | string): Promise<string[]>;
    zrangebyscoreAsync(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;
    zrangebyscoreAsync(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;
    zrangebyscoreAsync(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;
    ZRANGEBYSCOREASYNC(key: string, min: number | string, max: number | string): Promise<string[]>;
    ZRANGEBYSCOREASYNC(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;
    ZRANGEBYSCOREASYNC(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;
    ZRANGEBYSCOREASYNC(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Determine the index of a member in a sorted set.
     */
    zrankAsync(key: string, member: string): Promise<number | null>;
    ZRANKASYNC(key: string, member: string): Promise<number | null>;

    /**
     * Remove one or more members from a sorted set.
     */
    zremAsync: IOverloadedKeyCommand<string, number>;
    ZREMASYNC: IOverloadedKeyCommand<string, number>;

    /**
     * Remove all members in a sorted set between the given lexicographical range.
     */
    zremrangebylexAsync(key: string, min: string, max: string): Promise<number>;
    ZREMRANGEBYLEXASYNC(key: string, min: string, max: string): Promise<number>;

    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyrankAsync(key: string, start: number, stop: number): Promise<number>;
    ZREMRANGEBYRANKASYNC(key: string, start: number, stop: number): Promise<number>;

    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyscoreAsync(key: string, min: string | number, max: string | number): Promise<number>;
    ZREMRANGEBYSCOREASYNC(key: string, min: string | number, max: string | number): Promise<number>;

    /**
     * Return a range of members in a sorted set, by index, with scores ordered from high to low.
     */
    zrevrangeAsync(key: string, start: number, stop: number): Promise<string[]>;
    zrevrangeAsync(key: string, start: number, stop: number, withscores: string): Promise<string[]>;
    ZREVRANGEASYNC(key: string, start: number, stop: number): Promise<string[]>;
    ZREVRANGEASYNC(key: string, start: number, stop: number, withscores: string): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by score, with scores ordered from high to low.
     */
    zrevrangebyscoreAsync(key: string, min: number | string, max: number | string): Promise<string[]>;
    zrevrangebyscoreAsync(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;
    zrevrangebyscoreAsync(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;
    zrevrangebyscoreAsync(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;
    ZREVRANGEBYSCOREASYNC(key: string, min: number | string, max: number | string): Promise<string[]>;
    ZREVRANGEBYSCOREASYNC(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;
    ZREVRANGEBYSCOREASYNC(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;
    ZREVRANGEBYSCOREASYNC(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Determine the index of a member in a sorted set, with scores ordered from high to low.
     */
    zrevrankAsync(key: string, member: string): Promise<number | null>;
    ZREVRANKASYNC(key: string, member: string): Promise<number | null>;

    /**
     * Get the score associated with the given member in a sorted set.
     */
    zscoreAsync(key: string, member: string): Promise<string>;
    ZSCOREASYNC(key: string, member: string): Promise<string>;

    /**
     * Add multiple sorted sets and store the resulting sorted set in a new key.
     */
    zunionstoreAsync: IOverloadedCommand<string | number, number>;
    ZUNIONSTOREASYNC: IOverloadedCommand<string | number, number>;

    /**
     * Incrementally iterate the keys space.
     */
    scanAsync: IOverloadedCommand<string, [string, string[]]>;
    SCANASYNC: IOverloadedCommand<string, [string, string[]]>;

    /**
     * Incrementally iterate Set elements.
     */
    sscanAsync: IOverloadedKeyCommand<string, [string, string[]]>;
    SSCANASYNC: IOverloadedKeyCommand<string, [string, string[]]>;

    /**
     * Incrementally iterate hash fields and associated values.
     */
    hscanAsync: IOverloadedKeyCommand<string, [string, string[]]>;
    HSCANASYNC: IOverloadedKeyCommand<string, [string, string[]]>;

    /**
     * Incrementally iterate sorted sets elements and associated scores.
     */
    zscanAsync: IOverloadedKeyCommand<string, [string, string[]]>;
    ZSCANASYNC: IOverloadedKeyCommand<string, [string, string[]]>;
}

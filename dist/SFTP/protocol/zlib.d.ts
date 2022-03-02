export class PacketReader {
    cleanup(): void;
    read(data: any): any;
}
export class PacketWriter {
    constructor(protocol: any);
    allocStart: number;
    allocStartKEX: number;
    _protocol: any;
    cleanup(): void;
    alloc(payloadSize: any, force: any): any;
    finalize(packet: any, force: any): any;
}
export class ZlibPacketReader {
    _zlib: Zlib;
    cleanup(): void;
    read(data: any): Buffer | (Buffer | Buffer[])[] | undefined;
}
export class ZlibPacketWriter {
    constructor(protocol: any);
    allocStart: number;
    allocStartKEX: number;
    _protocol: any;
    _zlib: Zlib;
    cleanup(): void;
    alloc(payloadSize: any, force: any): Buffer;
    finalize(payload: any, force: any): any;
}
declare class Zlib {
    constructor(mode: any);
    _err: any;
    _writeState: Uint32Array;
    _chunkSize: number;
    _maxOutputLength: number;
    _outBuffer: Buffer;
    _outOffset: number;
    _handle: any;
    writeSync(chunk: any, retChunks: any): Buffer | (Buffer | Buffer[])[] | undefined;
}
export {};

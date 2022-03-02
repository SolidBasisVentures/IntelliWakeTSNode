export class Channel extends DuplexStream {
    constructor(client: any, info: any, opts: any);
    allowHalfOpen: any;
    server: boolean;
    type: any;
    subtype: any;
    incoming: any;
    outgoing: any;
    _callbacks: any[];
    _client: any;
    _hasX11: boolean;
    _exit: {
        code: undefined;
        signal: undefined;
        dump: undefined;
        desc: undefined;
    };
    stdin: Channel;
    stdout: Channel;
    stderr: ClientStderr | ServerStderr;
    _waitWindow: boolean;
    _waitChanDrain: boolean;
    _chunk: any;
    _chunkcb: any;
    _chunkErr: any;
    _chunkcbErr: any;
    eof(): void;
    close(): void;
    setWindow(rows: any, cols: any, height: any, width: any): void;
    signal(signalName: any): void;
    exit(statusOrSignal: any, coreDumped: any, msg: any): void;
}
export const MAX_WINDOW: number;
export const PACKET_SIZE: number;
export function windowAdjust(self: any): void;
export const WINDOW_THRESHOLD: number;
import { Duplex as DuplexStream } from "stream";
declare class ClientStderr extends ReadableStream {
    constructor(channel: any, streamOpts: any);
    _channel: any;
}
declare class ServerStderr extends WritableStream {
    constructor(channel: any);
    _channel: any;
}
import { Readable as ReadableStream } from "stream";
import { Writable as WritableStream } from "stream";
export {};

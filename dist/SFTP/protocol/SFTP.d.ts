export function flagsToString(flags: any): string | null;
export namespace OPEN_MODE {
    const READ: number;
    const WRITE: number;
    const APPEND: number;
    const CREAT: number;
    const TRUNC: number;
    const EXCL: number;
}
export class SFTP extends EventEmitter {
    constructor(client: any, chanInfo: any, cfg: any);
    server: boolean;
    _debug: any;
    _isOpenSSH: any;
    _version: number;
    _extensions: {};
    _biOpt: any;
    _pktLenBytes: number;
    _pktLen: number;
    _pktPos: number;
    _pktType: number;
    _pktData: any;
    _writeReqid: number;
    _requests: {};
    _maxInPktLen: number;
    _maxOutPktLen: number;
    _maxReadLen: number;
    _maxWriteLen: number;
    maxOpenHandles: any;
    _client: any;
    _protocol: any;
    _callbacks: any[];
    _hasX11: boolean;
    _exit: {
        code: undefined;
        signal: undefined;
        dump: undefined;
        desc: undefined;
    };
    _waitWindow: boolean;
    _chunkcb: any;
    _buffer: any[];
    type: any;
    subtype: any;
    incoming: any;
    outgoing: any;
    stderr: {
        readable: boolean;
        writable: boolean;
        push: (data: any) => void;
        once: () => void;
        on: () => void;
        emit: () => void;
        end: () => void;
    };
    readable: boolean;
    push(data: any): boolean | undefined;
    _pkt: any;
    end(): void;
    destroy(): void;
    _init(): void;
    createReadStream(path: any, options: any): ReadStream;
    createWriteStream(path: any, options: any): WriteStream;
    open(path: any, flags_: any, attrs: any, cb: any): void;
    close(handle: any, cb: any): void;
    read(handle: any, buf: any, off: any, len: any, position: any, cb: any): void;
    readData(handle: any, buf: any, off: any, len: any, position: any, cb: any): void;
    write(handle: any, buf: any, off: any, len: any, position: any, cb: any): void;
    writeData(handle: any, buf: any, off: any, len: any, position: any, cb: any): void;
    fastGet(remotePath: any, localPath: any, opts: any, cb: any): void;
    fastPut(localPath: any, remotePath: any, opts: any, cb: any): void;
    readFile(path: any, options: any, callback_: any): void;
    writeFile(path: any, data: any, options: any, callback_: any): void;
    appendFile(path: any, data: any, options: any, callback_: any): void;
    exists(path: any, cb: any): void;
    unlink(filename: any, cb: any): void;
    rename(oldPath: any, newPath: any, cb: any): void;
    mkdir(path: any, attrs: any, cb: any): void;
    rmdir(path: any, cb: any): void;
    readdir(where: any, opts: any, cb: any): void;
    fstat(handle: any, cb: any): void;
    stat(path: any, cb: any): void;
    lstat(path: any, cb: any): void;
    opendir(path: any, cb: any): void;
    setstat(path: any, attrs: any, cb: any): void;
    fsetstat(handle: any, attrs: any, cb: any): void;
    futimes(handle: any, atime: any, mtime: any, cb: any): void;
    utimes(path: any, atime: any, mtime: any, cb: any): void;
    fchown(handle: any, uid: any, gid: any, cb: any): void;
    chown(path: any, uid: any, gid: any, cb: any): void;
    fchmod(handle: any, mode: any, cb: any): void;
    chmod(path: any, mode: any, cb: any): void;
    readlink(path: any, cb: any): void;
    symlink(targetPath: any, linkPath: any, cb: any): void;
    realpath(path: any, cb: any): void;
    ext_openssh_rename(oldPath: any, newPath: any, cb: any): void;
    ext_openssh_statvfs(path: any, cb: any): void;
    ext_openssh_fstatvfs(handle: any, cb: any): void;
    ext_openssh_hardlink(oldPath: any, newPath: any, cb: any): void;
    ext_openssh_fsync(handle: any, cb: any): void;
    ext_openssh_lsetstat(path: any, attrs: any, cb: any): void;
    ext_openssh_expandPath(path: any, cb: any): void;
    handle(reqid: any, handle: any): void;
    status(reqid: any, code: any, message: any): void;
    data(reqid: any, data: any, encoding: any): void;
    name(reqid: any, names: any): void;
    attrs(reqid: any, attrs: any): void;
}
export class Stats {
    constructor(initial: any);
    mode: any;
    uid: any;
    gid: any;
    size: any;
    atime: any;
    mtime: any;
    extended: any;
    isDirectory(): boolean;
    isFile(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
}
export namespace STATUS_CODE {
    const OK: number;
    const EOF: number;
    const NO_SUCH_FILE: number;
    const PERMISSION_DENIED: number;
    const FAILURE: number;
    const BAD_MESSAGE: number;
    const NO_CONNECTION: number;
    const CONNECTION_LOST: number;
    const OP_UNSUPPORTED: number;
}
export function stringToFlags(str: any): any;
import EventEmitter = require("events");
declare function ReadStream(sftp: any, path: any, options: any): void;
declare class ReadStream {
    constructor(sftp: any, path: any, options: any);
    path: any;
    flags: any;
    mode: any;
    start: any;
    end: any;
    autoClose: any;
    pos: any;
    bytesRead: number;
    closed: boolean;
    handle: any;
    sftp: any;
    _opening: boolean;
    open(): void;
    _read(n: any): any;
    _destroy(err: any, cb: any): void;
    close(cb: any): void;
    get pending(): boolean;
}
declare function WriteStream(sftp: any, path: any, options: any): void;
declare class WriteStream {
    constructor(sftp: any, path: any, options: any);
    path: any;
    flags: any;
    mode: any;
    start: any;
    autoClose: any;
    pos: any;
    bytesWritten: number;
    closed: boolean;
    handle: any;
    sftp: any;
    _opening: boolean;
    _final(cb: any): void;
    open(): void;
    _write(data: any, encoding: any, cb: any): any;
    _writev(data: any, cb: any): any;
    destroy: any;
    _destroy: any;
    close(cb: any): void;
    destroySoon: any;
    get pending(): boolean;
}
export {};

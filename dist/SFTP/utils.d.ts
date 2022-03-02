export class ChannelManager {
    constructor(client: any);
    _client: any;
    _channels: {};
    _cur: number;
    _count: number;
    add(val: any): number;
    update(id: any, val: any): void;
    get(id: any): any;
    remove(id: any): void;
    cleanup(err: any): void;
}
export function generateAlgorithmList(algoList: any, defaultList: any, supportedList: any): any;
export function onChannelOpenFailure(self: any, recipient: any, info: any, cb: any): void;
export function onCHANNEL_CLOSE(self: any, recipient: any, channel: any, err: any, dead: any): void;
export declare function isWritable(stream: any): any;

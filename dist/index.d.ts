import * as electron from 'electron';
interface StrictChannelMap {
    [k: string]: any;
}
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
declare type Omit<T, U> = Pick<T, Exclude<keyof T, U>>;
declare type IntersectMethodSignatures<S> = UnionToIntersection<S[keyof S]>;
declare type SendMethodSignatures<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (ChannelMap[C] extends void ? (channel: C) => void : (channel: C, payload: ChannelMap[C]) => void);
}>;
declare type SendToMethodSignatures<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (ChannelMap[C] extends void ? (webContentsId: number, channel: C) => void : (webContentsId: number, channel: C, payload: ChannelMap[C]) => void);
}>;
declare type ListenerRegistrarSignatures<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (channel: C, listener: ChannelMap[C] extends void ? (event: electron.Event) => void : (event: electron.Event, payload: ChannelMap[C]) => void) => void;
}>;
declare type RemoveAllListenersSignatures<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (channel: C) => void;
}>;
declare type StrictIpcModule<ChannelMap extends StrictChannelMap, LooseModule extends electron.EventEmitter> = Omit<LooseModule, 'on' | 'once' | 'removeAllListeners' | 'removeListener'> & {
    on: ListenerRegistrarSignatures<ChannelMap>;
    once: ListenerRegistrarSignatures<ChannelMap>;
    removeAllListeners: RemoveAllListenersSignatures<ChannelMap>;
    removeListener: ListenerRegistrarSignatures<ChannelMap>;
};
export declare type StrictIpcRenderer<ChannelMap extends StrictChannelMap> = Omit<StrictIpcModule<ChannelMap, electron.IpcRenderer>, 'send' | 'sendSync' | 'sendTo' | 'sendToHost'> & {
    send: SendMethodSignatures<ChannelMap>;
    sendSync: SendMethodSignatures<ChannelMap>;
    sendTo: SendToMethodSignatures<ChannelMap>;
    sendToHost: SendMethodSignatures<ChannelMap>;
};
export declare type StrictIpcMain<ChannelMap extends StrictChannelMap> = StrictIpcModule<ChannelMap, electron.IpcMain>;
export {};

/// <reference types="node" />
import * as electron from 'electron';
interface StrictChannelMap {
    [k: string]: any;
}
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
declare type IntersectMethodSignatures<S> = UnionToIntersection<S[keyof S]>;
export declare type StrictIpcMainEvent<ReturnType> = Omit<electron.IpcMainEvent, 'returnValue'> & {
    returnValue: ReturnType;
};
declare type Payload<ChannelMap extends StrictChannelMap, C extends keyof ChannelMap> = ChannelMap[C][0];
declare type Return<ChannelMap extends StrictChannelMap, C extends keyof ChannelMap> = ChannelMap[C][1];
declare type SendMethodSignatures<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (Payload<ChannelMap, C> extends void ? (channel: C) => void : (channel: C, payload: Payload<ChannelMap, C>) => void);
}>;
declare type SendSyncMethodSignatures<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (Payload<ChannelMap, C> extends void ? (channel: C) => Return<ChannelMap, C> : (channel: C, payload: Payload<ChannelMap, C>) => Return<ChannelMap, C>);
}>;
declare type SendToMethodSignatures<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (Payload<ChannelMap, C> extends void ? (webContentsId: number, channel: C) => void : (webContentsId: number, channel: C, payload: Payload<ChannelMap, C>) => void);
}>;
declare type ListenerRegistrarSignaturesMain<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (channel: C, listener: Payload<ChannelMap, C> extends void ? (event: StrictIpcMainEvent<Return<ChannelMap, C>>) => void : (event: StrictIpcMainEvent<Return<ChannelMap, C>>, payload: Payload<ChannelMap, C>) => void) => void;
}>;
declare type ListenerRegistrarSignaturesRenderer<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (channel: C, listener: Payload<ChannelMap, C> extends void ? (event: electron.IpcRendererEvent) => void : (event: electron.IpcRendererEvent, payload: Payload<ChannelMap, C>) => void) => void;
}>;
declare type RemoveAllListenersSignatures<ChannelMap extends StrictChannelMap> = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (channel: C) => void;
}>;
declare type StrictIpcModule<ChannelMap extends StrictChannelMap, LooseModule extends NodeJS.EventEmitter> = Omit<LooseModule, 'on' | 'once' | 'removeAllListeners' | 'removeListener'> & {
    on: ListenerRegistrarSignaturesMain<ChannelMap>;
    once: ListenerRegistrarSignaturesMain<ChannelMap>;
    removeAllListeners: RemoveAllListenersSignatures<ChannelMap>;
    removeListener: ListenerRegistrarSignaturesMain<ChannelMap>;
};
export declare type StrictIpcRenderer<ChannelMap extends StrictChannelMap> = Omit<StrictIpcModule<ChannelMap, electron.IpcRenderer>, 'on' | 'once' | 'removeListener' | 'send' | 'sendSync' | 'sendTo' | 'sendToHost'> & {
    on: ListenerRegistrarSignaturesRenderer<ChannelMap>;
    once: ListenerRegistrarSignaturesRenderer<ChannelMap>;
    removeListener: ListenerRegistrarSignaturesRenderer<ChannelMap>;
    send: SendMethodSignatures<ChannelMap>;
    sendSync: SendSyncMethodSignatures<ChannelMap>;
    sendToHost: SendMethodSignatures<ChannelMap>;
};
export declare type StrictIpcMain<ChannelMap extends StrictChannelMap> = StrictIpcModule<ChannelMap, electron.IpcMain>;
export declare type StrictWindowWebContents<ChannelMap extends StrictChannelMap> = Omit<electron.WebContents, 'send'> & {
    send: SendMethodSignatures<ChannelMap>;
};
export {};

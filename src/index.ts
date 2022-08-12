import * as electron from 'electron';

interface StrictChannelMap {
  [k: string]: any;
}

/**
 * Magic union-->intersection conversion, courtesy of StackOverflow!
 *
 * https://stackoverflow.com/a/50375712 / https://stackoverflow.com/a/50375286
 *
 * Uses some typescript trickery to transform a union to an intersection by
 * first defining the passed type as a parameter type for a function type,
 * then
 */
type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends ((k: infer I) => void) ? I : never;

type IntersectMethodSignatures<S> = UnionToIntersection<S[keyof S]>;

export declare type StrictIpcMainEvent<ReturnType> = Omit<electron.IpcMainEvent, 'returnValue'> & {
  returnValue: ReturnType;
};

/**
 * Returns the payload type of our type [PayloadType, ReturnType]
 */
declare type Payload<ChannelMap extends StrictChannelMap, C extends keyof ChannelMap> = ChannelMap[C][0];

/**
 * Returns the return type of our type [PayloadType, ReturnType]
 */
declare type Return<ChannelMap extends StrictChannelMap, C extends keyof ChannelMap> = ChannelMap[C][1];

/**
 * Intersection of strictly-typed `send` method signatures
 *
 * Note: signature is the same for `send` and `sendToHost`
 */
type SendMethodSignatures<
  ChannelMap extends StrictChannelMap
  > = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (
      Payload<ChannelMap, C> extends void ?
      (channel: C) => void :
      (channel: C, payload: Payload<ChannelMap, C>) => void
    )
  }>;

/**
 * Intersection of strictly-typed `sendSync` method signatures
 * 
 * Allows proper return value typings
 */
type SendSyncMethodSignatures<
  ChannelMap extends StrictChannelMap
  > = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (
      Payload<ChannelMap, C> extends void ?
      (channel: C) => Return<ChannelMap, C> :
      (channel: C, payload: Payload<ChannelMap, C>) => Return<ChannelMap, C>
    )
  }>;

/**
 * Intersection of strictly-typed `sendTo` method signatures
 */
type SendToMethodSignatures<
  ChannelMap extends StrictChannelMap
  > = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (
      Payload<ChannelMap, C> extends void ?
      (webContentsId: number, channel: C) => void :
      (webContentsId: number, channel: C, payload: Payload<ChannelMap, C>) => void
    )
  }>;

/**
 * Intersection of strictly-typed signatures for methods that register listeners
 *
 * Note: signature is the same for `on`, `once`, and `removeListener`
 */
type ListenerRegistrarSignaturesMain<
  ChannelMap extends StrictChannelMap
  > = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (
      channel: C,
      listener: Payload<ChannelMap, C> extends void ?
        (event: StrictIpcMainEvent<Return<ChannelMap, C>>) => void :
        (event: StrictIpcMainEvent<Return<ChannelMap, C>>, payload: Payload<ChannelMap, C>) => void
    ) => void
  }>;

type ListenerRegistrarSignaturesRenderer<
  ChannelMap extends StrictChannelMap
  > = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (
      channel: C,
      listener: Payload<ChannelMap, C> extends void ?
        (event: electron.IpcRendererEvent) => void :
        (event: electron.IpcRendererEvent, payload: Payload<ChannelMap, C>) => void
    ) => void
  }>;

/**
 * Intersection of strictly-typed `removeAllListeners` method signatures
 */
type RemoveAllListenersSignatures<
  ChannelMap extends StrictChannelMap
  > = IntersectMethodSignatures<{
    [C in keyof ChannelMap]: (channel: C) => void
  }>;

/**
 * Base type for a strict ipc module (main or renderer)
 *
 * For providing strictly-typed methods, a simple interface merge wouldn't do
 * the trick because the new method definitions would be treated as overloads
 * and the loosely typed definitions would be left intact. By omitting those
 * methods entirely before merging, the return type only defines the strictly
 * typed methods.
 */
type StrictIpcModule<
  ChannelMap extends StrictChannelMap,
  LooseModule extends NodeJS.EventEmitter
  > = Omit<
    LooseModule,
    'on' | 'once' | 'removeAllListeners' | 'removeListener'
  > & {
    on: ListenerRegistrarSignaturesMain<ChannelMap>;
    once: ListenerRegistrarSignaturesMain<ChannelMap>;
    removeAllListeners: RemoveAllListenersSignatures<ChannelMap>;
    removeListener: ListenerRegistrarSignaturesMain<ChannelMap>;
  };

/**
 * Type definition used to override default IpcRenderer with strict typing
 */
export type StrictIpcRenderer<ChannelMap extends StrictChannelMap> = Omit<
  StrictIpcModule<ChannelMap, electron.IpcRenderer>,
  'on' | 'once' | 'removeListener' |
  'send' | 'sendSync' | 'sendTo' | 'sendToHost'
> & {
  on: ListenerRegistrarSignaturesRenderer<ChannelMap>;
  once: ListenerRegistrarSignaturesRenderer<ChannelMap>;
  removeListener: ListenerRegistrarSignaturesRenderer<ChannelMap>;

  send: SendMethodSignatures<ChannelMap>;
  sendSync: SendSyncMethodSignatures<ChannelMap>;
  sendTo: SendToMethodSignatures<ChannelMap>;
  sendToHost: SendMethodSignatures<ChannelMap>;
};

/**
 * Type definition used to override default IpcMain with strict typing
 */
export type StrictIpcMain<
  ChannelMap extends StrictChannelMap
  > = StrictIpcModule<ChannelMap, electron.IpcMain>;

/**
 * Type definition used to override default WebContents with strict typing
 * 
 * Sample function that takes a window and returns the window.webContents properly cast:
 *  function getWebContents(window: BrowserWindow): StrictWindowWebContents<IpcChannelMap> {
 *    return window.webContents as StrictWindowWebContents<IpcChannelMap>;
 *  }
 * 
 * Sample usage:
 *   getWebContents(this._mainWindow).send("channel", payload);
 */
export declare type StrictWindowWebContents<ChannelMap extends StrictChannelMap> = Omit<electron.WebContents, 'send'> & {
  send: SendMethodSignatures<ChannelMap>;
};
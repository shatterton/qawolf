import { Socket } from "socket.io";

type EmitOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  event: string;
};

export type SubscribeType = "code" | "elementchooser" | "logs" | "run";

export type SubscribeMessage = {
  type: SubscribeType;
};

type SubscriptionCollection = {
  ids: string[];
};

export class SubscriptionTracker {
  readonly _sockets = new Map<string, Socket>();
  readonly _subscriptions = new Map<SubscribeType, SubscriptionCollection>();

  constructor() {
    this._subscriptions.set("code", { ids: [] });
    this._subscriptions.set("elementchooser", { ids: [] });
    this._subscriptions.set("logs", { ids: [] });
    this._subscriptions.set("run", { ids: [] });
  }

  disconnect(socket: Socket): void {
    this._sockets.delete(socket.id);

    for (const type of this._subscriptions.keys()) {
      this.unsubscribe(socket, type);
    }
  }

  emit(to: SubscribeType, { data, event }: EmitOptions): void {
    const collection = this._subscriptions.get(to);
    if (!collection) return;

    collection.ids.forEach((id) => {
      this._sockets.get(id)?.emit(event, data);
    });
  }

  subscribe(socket: Socket, message: SubscribeMessage): void {
    this._sockets.set(socket.id, socket);

    const collection = this._subscriptions.get(message.type);
    if (collection && !collection.ids.includes(socket.id)) {
      collection.ids.push(socket.id);
    }
  }

  unsubscribe(socket: Socket, type: SubscribeType): void {
    const collection = this._subscriptions.get(type);
    if (!collection) return;

    const index = collection.ids.indexOf(socket.id);
    if (index >= 0) {
      collection.ids.splice(index, 1);
    }
  }
}

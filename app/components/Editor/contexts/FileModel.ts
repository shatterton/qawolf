import { EventEmitter } from "events";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { JWT_KEY } from "../../../lib/client";
import { File } from "../../../lib/types";

// TODO update all paths
export class FileModel extends EventEmitter {
  _doc = new Y.Doc();
  _content = this._doc.getText("file.monaco");
  _file?: File;
  _metadata = this._doc.getMap("file");
  _provider?: WebsocketProvider;

  constructor() {
    super();

    this._content.observe(() => {
      this.emit("changed", { key: "content" });
    });

    this._metadata.observe(() => {
      console.log("metadata changed");
      this.emit("changed", { key: "isInitialized" });
      this.emit("changed", { key: "path" });
    });
  }

  bind<T>(key: string, callback: (value: T) => void): () => void {
    const onChange = (event: { key: string }) => {
      if (event.key === key) callback(this[key]);
    };

    this.on("changed", onChange);

    callback(this[key]);

    return () => this.off("changed", onChange);
  }

  get content(): string {
    return this.isInitialized
      ? this._content.toJSON()
      : this._file?.content || "";
  }

  delete(index: number, length: number): void {
    this._content.delete(index, length);
  }

  dispose(): void {
    this._doc.destroy();
    this._provider?.destroy();
    this._provider = null;
    this.removeAllListeners();
  }

  get id(): string | undefined {
    return this._file?.id;
  }

  get isInitialized(): boolean {
    return !!this._metadata.get("initialized");
  }

  insert(index: number, text: string): void {
    this._doc.getText("file.monaco").insert(index, text);
  }

  get isReadOnly(): boolean {
    return !!this._file?.is_read_only;
  }

  get path(): string {
    return this._metadata.get("path") || this._file?.path || "";
  }

  set path(value: string) {
    this._metadata.set("path", value);
  }

  setFile(file: File): void {
    this._file = file;

    this.emit("changed", { key: "content" });
    this.emit("changed", { key: "isInitialized" });
    this.emit("changed", { key: "isReadOnly" });
    this.emit("changed", { key: "path" });

    this._provider?.destroy();

    this._provider = new WebsocketProvider(file.url, file.id, this._doc, {
      params: { authorization: localStorage.getItem(JWT_KEY) },
    });
  }
}

import Debug from "debug";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import ws from "ws";

import { TextOperation } from "../types";

const debug = Debug("qawolf:CodeModel");

export class EditorModel {
  _doc = new Y.Doc();
  _provider?: WebsocketProvider;
  _helpersText = this._doc.getText("helpers.monaco");
  _testText = this._doc.getText("test.monaco");

  constructor() {
    this.connect();
  }

  connect(): void {
    // TODO provide connection details in connect
    this._provider = new WebsocketProvider(
      `ws://host.docker.internal:1234`,
      "test.cko55o88q0001gz3q6np62hho",
      this._doc,
      {
        params: { authorization: process.env.TEMP_AUTH! },
        WebSocketPolyfill: ws as any,
      }
    );
  }

  update(operations: TextOperation[]): boolean {
    if (!operations.length) {
      debug(`skip update: no changes`);
      return false;
    }

    operations.forEach((op) => {
      if (op.type === "delete") {
        this._testText.delete(op.index, op.length);
      } else if (op.type === "insert") {
        this._testText.insert(op.index, op.value);
      }
    });

    return true;
  }

  get helpersCode(): string {
    return this._helpersText.toJSON();
  }

  get testCode(): string {
    return this._testText.toJSON();
  }
}

import { EventEmitter } from "events";
import type { editor as editorNs } from "monaco-editor/esm/vs/editor/editor.api";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import { MonacoBinding } from "../hooks/MonacoBinding";
import { JWT_KEY } from "../../../lib/client";
import { Editor } from "../../../lib/types";

export class EditorController extends EventEmitter {
  readonly _doc = new Y.Doc();

  _branch: string;
  _helpersBinding: MonacoBinding;
  _helpersEditor: editorNs.IStandaloneCodeEditor;
  _testBinding: MonacoBinding;
  _testEditor: editorNs.IStandaloneCodeEditor;

  _testProvider: WebsocketProvider;

  _value: Editor;

  get code(): string {
    return "";
  }

  destroy(): void {
    this._testProvider.destroy();
  }

  get helpers(): string {
    return "";
  }

  setBranch(branch: string): void {
    this._branch = branch;
  }

  setHelpersEditor(monaco, editor: editorNs.IStandaloneCodeEditor): void {
    if (!this._testProvider) {
      throw new Error("TODO: set test editor and test id out of order");
    }

    this._helpersEditor = editor;
    this._helpersBinding = new MonacoBinding(
      monaco,
      this._doc.getText("helpers.monaco"),
      editor.getModel(),
      new Set([editor]),
      this._testProvider.awareness
    );
  }

  setTestEditor(monaco, editor: editorNs.IStandaloneCodeEditor): void {
    if (!this._testProvider) {
      throw new Error("TODO: set test editor and test id out of order");
    }

    this._testEditor = editor;
    this._testBinding = new MonacoBinding(
      monaco,
      this._doc.getText("test.monaco"),
      editor.getModel(),
      new Set([editor]),
      this._testProvider.awareness
    );
  }

  setValue(value: Editor): void {
    // TODO make sure the test does not change...
    console.log("set value", value?.test.id);

    if (value && !this._testProvider) {
      this._testProvider = new WebsocketProvider(
        `${location.protocol === "http:" ? "ws:" : "wss:"}//localhost:1234`,
        // TODO add branch...
        `test.${value.test.id}`,
        this._doc,
        { params: { authorization: localStorage.getItem(JWT_KEY) } }
      );
    }

    this._value = value;
  }

  updateCode(code: string): void {
    // this._state.set("test_code", code);
  }
}

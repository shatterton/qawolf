import { EventEmitter } from "events";
import type { editor as editorNs } from "monaco-editor/esm/vs/editor/editor.api";
import * as Y from "yjs";

import { Editor } from "../../../lib/types";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "../hooks/MonacoBinding";
import { JWT_KEY } from "../../../lib/client";

export class EditorController extends EventEmitter {
  readonly _doc = new Y.Doc();

  _branch: string;

  _helpersEditor: editorNs.IStandaloneCodeEditor;
  _helpersProvider: WebsocketProvider;

  _testEditor: editorNs.IStandaloneCodeEditor;
  _testProvider: WebsocketProvider;

  _value: Editor;
  _monacoBinding: MonacoBinding;

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

  setHelpersEditor(editor: editorNs.IStandaloneCodeEditor): void {
    this._helpersEditor = editor;

    // hydrate with current value
    // const value = this._state.get("helpers_code");
    // if (value !== undefined) editor.setValue(value);

    // update state when editor changes
    // editor.onDidChangeModelContent(() => {
    //   this._state.set("helpers_code", editor.getValue());
    // });
  }

  setTestEditor(monaco, editor: editorNs.IStandaloneCodeEditor): void {
    if (!this._testProvider) {
      throw new Error(
        "Need to update to allow setting test editor and test id out of order"
      );
    }

    this._testEditor = editor;
    this._monacoBinding = new MonacoBinding(
      monaco,
      this._doc.getText("monaco"),
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

    // TODO room name should be based on helpers.team_id

    // TODO room name should be based on test_id & branch...
  }

  updateCode(code: string): void {
    // this._state.set("test_code", code);
  }
}

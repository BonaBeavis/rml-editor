'use babel';

import RmlEditorView from './rml-editor-view';
import {CompositeDisposable} from 'atom';

export default {

  rmlEditorView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.rmlEditorView = new RmlEditorView(state.rmlEditorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.rmlEditorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rml-editor:toggle': () => this.toggle(),
      'rml-editor:map': () => this.map()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.rmlEditorView.destroy();
  },

  serialize() {
    return {
      rmlEditorViewState: this.rmlEditorView.serialize()
    };
  },

  toggle() {
    console.log('RmlEditor was toggled!');
    return (
      this.modalPanel.isVisible() ?
        this.modalPanel.hide() :
        this.modalPanel.show()
    );
  },

  map() {
    console.log('RmlEditoas toggled!');
    console.log(process.cwd());
    console.log(__dirname);
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      const editor = atom.workspace.getActiveTextEditor();
      const rml = editor.getText()
      console.log(rml)


      const RMLMapperWrapper = require('@rmlio/rmlmapper-java-wrapper');
      const fs = require('fs');

      const rmlmapperPath = __dirname + '/rmlmapper.jar';
      const tempFolderPath = '/home/beavis/repositories/rml-testground/';

      const wrapper = new RMLMapperWrapper(rmlmapperPath, tempFolderPath, true);
      var mappingFilePath = editor.getPath();
      const path = require('path');
      mappingFilePath = path.parse(mappingFilePath).dir;
      var folder = new File(mappingFilePath);
      var listOfFiles = folder.listOfFiles();
      const sources = {};
      for (file in mappingFilePath) {
        const filename = file
        // sources += ('student.csv': fs.readFileSync(mappingFilePath + '/student.csv', 'utf-8')
      }
      const test = this.rmlEditorView;
      const result = wrapper.execute(rml, {sources, generateMetadata: false, serialization: 'turtle'}).then(function (result) {
        console.log(result);
        test.setCount(result.output);
      })
      this.modalPanel.show();
    }
  }
};

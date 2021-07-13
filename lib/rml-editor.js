'use babel';

import {CompositeDisposable} from 'atom';
import {File} from 'atom';
import * as Path from 'path';

export default {

  subscriptions: null,
  outputFileName: 'output.nt',

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rml-editor:map': () => this.map()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  async executeRmlMapper(workdir, mappingFile, outputFile) {
    const mappingFileName = Path.parse(mappingFile).base;
    const outputFileName = Path.parse(outputFile).base;
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
      var cmd = "";
      cmd += "cd " + workdir;
      cmd += " &&"
      cmd += " java -jar " + Path.join(__dirname, "rmlmapper.jar");
      cmd += " -m " + mappingFileName;
      cmd += " -o " + outputFileName;
      exec(cmd, async (error, stdout, stderr) => {
        if (stderr) {
          const err = new Error(stderr);
          err.log = stderr;
          reject(err);
        } else {
          atom.workspace.open(outputFile);
        }
      })
    })
  },

  map() {
    const editor = atom.workspace.getActiveTextEditor();
    const mappingFile = editor.getPath();
    const workdir = Path.parse(mappingFile).dir;
    const outputFile = Path.join(workdir, this.outputFileName)
    new File(outputFile).create().then(this.executeRmlMapper(workdir, mappingFile, outputFile));
  }
};

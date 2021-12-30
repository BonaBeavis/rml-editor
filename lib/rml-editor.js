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
      'rml-editor:map': () => this.map(),
      'rml-editor:ontology': () => this.ontology()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  // RMLMapper
  async executeRmlMapper(workdir, mappingFile, outputFile) {
    const mappingFileName = Path.parse(mappingFile).base;
    const outputFileName = Path.parse(outputFile).base;
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
      var cmd = "";
      cmd += "cd " + workdir;
      cmd += " &&";
      cmd += " java -jar " + Path.join(__dirname, "rmlmapper.jar");
      cmd += " -m " + mappingFileName;
      cmd += " -o " + outputFileName;
      exec(cmd, async (error, stdout, stderr) => {
        if (stderr) {
          const err = new Error(stderr);
          err.log = stderr;
          reject(err);
          atom.notifications.addError("Error");
        } else {
          atom.notifications.addSuccess("Finished");
          atom.workspace.open(outputFile);
        }
      })
    })
  },

  map() {
    let editor;
    if (editor=atom.workspace.getActiveTextEditor()) {
      atom.notifications.addInfo("Starting RMLMapper...");

      const editor = atom.workspace.getActiveTextEditor();
      const mappingFile = editor.getPath();
      const workdir = Path.parse(mappingFile).dir;
      const outputFile = Path.join(workdir, this.outputFileName)
      new File(outputFile).create().then(this.executeRmlMapper(workdir, mappingFile, outputFile));
    } else {
      atom.notifications.addError("Open mapping file");
    }
  },

  // Nextflow
  ontology() {
    let editor;
    if (editor=atom.workspace.getActiveTextEditor()) {
      atom.notifications.addInfo("Starting nextflow...");

      const editor = atom.workspace.getActiveTextEditor();
      const openedFile = editor.getPath();
      const workdir = Path.parse(openedFile).dir;
      this.executeNextflow(workdir);
    } else {
      atom.notifications.addError("Open any file in the directory of the input data");
    }
  },

  async executeNextflow(workdir) {
    const fs = require('fs');
    const dir = workdir+"/public";
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
      var cmd = "";
      cmd += "cd " + workdir;
      cmd += " && ";
      cmd += Path.join(__dirname, "nextflow") + " pull https://gitlab.com/kupferdigital/ontoflow -r main";
      cmd += " && ";
      cmd += Path.join(__dirname, "nextflow") + " run https://gitlab.com/kupferdigital/ontoflow -r main";
      exec(cmd, async (error, stdout, stderr) => {
        if (stderr) {
          const err = new Error(stderr);
          err.log = stderr;
          reject(err);
          atom.notifications.addError("Error");
        } else {
          if (fs.existsSync(dir)) {
            atom.notifications.addSuccess("Finished: Results in public/");
            window.open(workdir+"/public/index.html");
          } else {
            atom.notifications.addError("Failed: check log");
          }
        }
      })
    })
  }
};

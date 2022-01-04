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
          atom.workspace.open(outputFile, {
            activateItem:true
          });
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
      atom.notifications.addError("Mapping file not found", {
        detail:'Open mapping file'
      });
    }
  },

  // Nextflow
  ontology() {
    const projectdir = atom.project.getPaths();
    this.executeNextflow(projectdir[0]);
  },

  async executeNextflow(workdir) {
    // configuration for checking if file/dir exists
    const fs = require('fs');
    const projectdir = workdir;
    const dir = workdir + "/output";
    const inputfile = workdir + "/config.json";
    const mappingfile = workdir + "/mapping.ttl";
    currentPane = atom.workspace.getActivePane();

    // check if mappingfile and config.json exists, then run nextflow
    if (fs.existsSync(mappingfile) && fs.existsSync(inputfile)) {
      this.cmdnextflow(projectdir);
    } else {
      atom.notifications.addError("Cannot run nextflow", {
        detail:'Files missing: Mapping file, config file\nRun nextflow again'
      });
    }

    // check if config.json exists: if not create config.json
    if (fs.existsSync(inputfile)) {
      atom.workspace.open(inputfile, {
        split:'left',
        activateItem:true,
        searchAllPanes:true
      });
    } else {
      // template for config.json
      // fs.writeFile(inputfile, '{\n\t"inputFiles": [\n\t\t"filepath1",\n\t\t"filepath2",\n\t\t"filepath3"\n\t]\n}', function (err) {
      //   if (err) throw err;
      //   console.log("File is created successfully.");
      // });
      atom.notifications.addInfo("No config file found", {
        detail:'Created new file: config.json\nRun nextflow again'
      })
      // template for config.json
      fs.writeFile(inputfile, '{\n\t"inputFiles": [\n\t\t"https://gitlab.com/kupferdigital/data-ecosystem/workflows/workflow-template/-/raw/main/files/data/LiefLag.txt",\n\t\t"https://gitlab.com/kupferdigital/data-ecosystem/workflows/workflow-template/-/raw/main/files/data/Messunsicherheit.txt",\n\t\t"https://gitlab.com/kupferdigital/data-ecosystem/workflows/workflow-template/-/raw/main/files/data/Proben.txt",\n\t\t"https://gitlab.com/kupferdigital/data-ecosystem/workflows/workflow-template/-/raw/main/files/data/Protokolle.txt",\n\t\t"https://gitlab.com/kupferdigital/data-ecosystem/workflows/workflow-template/-/raw/main/files/mapping/mapping.ttl"\n\t]\n}', function (err) {
        if (err) throw err;
        console.log("file was created successfully.");
      });
      atom.workspace.open(inputfile, {
        split:'left',
        activateItem:true,
        searchAllPanes:true
      });
    }

    // check if mapping file exists
    if (fs.existsSync(mappingfile)) {
      atom.workspace.open(mappingfile, {
        split:'right',
        activateItem:false,
        searchAllPanes:true
      });
    } else {
      atom.notifications.addError("Mapping file not found", {
        detail:'Create a mapping file'
      });
    }

    // check if directory output/ exists: open the file in this directory
    if (fs.existsSync(dir+"/output.ttl")) {
      atom.workspace.open(dir + "/output.ttl", {
        split:'right',
        activateItem:false,
        searchAllPanes:true
      });
    }
  },

  async cmdnextflow(workdir) {
    atom.notifications.addInfo("Starting nextflow...");

    const fs = require('fs');
    const dir = workdir + "/output";
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
      var cmd = "";
      cmd += "cd " + workdir;
      cmd += " && ";
      cmd += Path.join(__dirname, "nextflow") + " run -params-file config.json https://gitlab.com/kupferdigital/data-ecosystem/workflows/workflow-template -r main";
      exec(cmd, async (error, stdout, stderr) => {
        if (stderr) {
          const err = new Error(stderr);
          err.log = stderr;
          reject(err);
          atom.notifications.addError("Error");
        } else {
          if (fs.existsSync(dir)) {
            atom.notifications.addSuccess("Finished", {
              detail:'Results in output/'
            });
            atom.workspace.open(workdir+"/output/output.ttl", {
              split:'right',
              activateItem:true,
              searchAllPanes:true
            });
          } else {
            atom.notifications.addError("Failed", {
              detail:'Check log'
            });
          }
        }
      })
    })
  }

};

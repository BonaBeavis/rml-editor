# Rml-editor package

## Getting Started

### Prerequisites

- Java
- Docker: for running [nextflow](https://www.nextflow.io/)
    - make sure that docker has sudo privileges. If not, nextflow will fail
    - add `$USER` to the `docker` group
    - `sudo chmod 666 /var/run/docker.sock`

### Installation

```sh
apm install rml-editor
```

### Usage

#### `RMLMapper`

Press `ctrl` + `shift` + `o` with a mapping file open.

#### `Nextflow`

Press `ctrl` + `shift` + `n` for creating an ontology with nextflow. Therefore open your project folder and clear your pane to start safely.

Filenames:
- for mapping file: `mapping.ttl`
- config file for defining the input files path: `config.json`

### Contributing

```sh
apm develop rml-editor
```

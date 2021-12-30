# Rml-editor package

## Getting Started

### Prerequisites

- Java
- Docker: for creating an ontology with [ontoflow](https://gitlab.com/kupferdigital/ontoflow)
    - make sure that docker has sudo privileges. If not, nextflow will fail
    - add `$USER` to the `docker` group
    - `sudo chmod 666 /var/run/docker.sock`

### Installation

```sh
apm install rml-editor
```

### Usage

Press `ctrl` + `shift` + `o` with a mapping file open.
Press `ctrl` + `shift` + `n` with any input file open for creating an ontology.

### Contributing

```sh
apm develop rml-editor
```

# Rml-editor package

## Getting Started

### Prerequisites

- Java

### Installation

```sh
apm install rml-editor
```

For creating an ontology with [ontoflow](https://gitlab.com/kupferdigital/ontoflow) you need:
- [docker](https://docs.docker.com/)
    - make sure that docker has sudo privileges. If not, nextflow will fail
    - For linux:
        - add `$USER` to the `docker` group
        - `sudo chmod 666 /var/run/docker.sock`
- Java: `sudo apt install openjdk-11-jre-headless`

### Usage

Press `ctrl` + `shift` + `o` with a mapping file open.
Press `ctrl` + `shift` + `n` with any input file open for creating an ontology.

### Contributing

```sh
apm develop rml-editor
```

# Rml-editor package

## Getting Started

1. Install Atom as shown in this [manual for Linux](https://flight-manual.atom.io/getting-started/sections/installing-atom/#installing-atom-on-linux). For Debian/Ubuntu:

```sh
wget -qO - https://packagecloud.io/AtomEditor/atom/gpgkey | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] https://packagecloud.io/AtomEditor/atom/any/ any main" > /etc/apt/sources.list.d/atom.list'
sudo apt update
sudo apt install atom
```

### Prerequisites

- Java

    ```sh
    sudo apt install openjdk-11-jre-headless
    ```

- Docker (for running [nextflow](https://www.nextflow.io/))
    - install the docker engine using the [repository](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) or from [package](https://docs.docker.com/engine/install/ubuntu/#install-from-a-package)
    - make sure that docker has sudo privileges. If not, nextflow will fail
    - these [post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user) will solve this problem:

    ```sh
    sudo groupadd docker
    sudo usermod -aG docker $USER
    newgrp docker # or log out and in. You may need to reboot
    ```

    - additionally add sudo permissions to the docker-socket:

    ```sh
    sudo chmod 666 /var/run/docker.sock
    ```

### Installation

- Install the rml-editor with: (when it comes to erros, jump to step 3)

    ```sh
    apm install rml-editor
    ```

- or follow these steps:
1. Open Atom und press <kbd>ctrl</kbd> + <kbd>,</kbd> to open the settings
2. Go to `Install`, search for `rml-editor` and install it
3. When it comes to errors, you can install it as follows:

    ```sh
    cd ~/.atom/packages/
    git clone https://github.com/BonaBeavis/rml-editor.git
    ```

4. restart Atom with <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>F5</kbd>

### Usage

#### `RMLMapper`

Press <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>o</kbd> with a mapping file open.

#### `Nextflow`

Press <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>n</kbd> for creating an ontology with nextflow. Therefore open your project folder and clear your pane to start for safety.

Filenames:
- for mapping file: `mapping.ttl`
- config file for defining the input files path: `config.json`

### Contributing

```sh
apm develop rml-editor
```

# File Manager

This is a command-line file manager application that allows users to perform various file system operations. The application starts in the user's home directory and supports file navigation, manipulation, hashing, and compression operations using the Streams API.

## Installation

To get started with the file manager, follow these steps:

1. Clone the repository to your local machine.

## Running the File Manager

To start the file manager, use the following command:

```bash
npm run start -- --username=your_username
```

Replace `your_username` with your desired username. This username will be used in the greeting and goodbye messages.

Example:

```bash
npm run start -- --username=John
```

Once the file manager starts, you will see a welcome message and the current directory you are in. You can then input commands to perform various operations.


## Features

The file manager can perform the following operations:

1. **Navigation:**
    - `up` - Moves to the parent directory.
    - `cd <path>` - Changes the current directory to the specified path.
    - `ls` - Lists all files and directories in the current directory.

2. **File Operations:**
    - `cat <file>` - Reads and outputs the content of the specified file.
    - `add <file>` - Creates a new empty file in the current directory.
    - `rn <old_filename> <new_filename>` - Renames a file.
    - `cp <src> <dest>` - Copies a file from the source path to the destination path.
    - `mv <src> <dest>` - Moves a file from the source path to the destination path.
    - `rm <file>` - Deletes the specified file.

3. **Operating System Info:**
    - `os <arg>` - Retrieves OS-related information such as the EOL (end-of-line marker), current user name, CPU architecture, home directory, and system uptime.

4. **Hash Calculation:**
    - `hash <file>` - Calculates the SHA-256 hash for the specified file and displays it.

5. **File Compression/Decompression:**
    - `compress <src> <dest>` - Compresses a file using the Brotli algorithm and saves it to the destination path.
    - `decompress <src> <dest>` - Decompresses a Brotli-compressed file and saves it to the destination path.

6. **Exit:**
    - `.exit` - Exits the file manager.
    - `Ctrl+C` - Prints a new line and continues running the application. To exit, use `.exit`.

## Command List

- `up` - Move to the parent directory.
- `cd <path>` - Change directory to the specified path.
- `ls` - List files and directories in the current directory.
- `cat <file>` - Read the content of a file.
- `add <file>` - Create a new empty file.
- `rn <old_filename> <new_filename>` - Rename a file.
- `cp <src> <dest>` - Copy a file to a new location.
- `mv <src> <dest>` - Move a file to a new location.
- `rm <file>` - Remove a file.
- `os <arg>` - Retrieve OS information:
    - `--EOL` - End-of-line marker.
    - `--cpus` - CPU information.
    - `--homedir` - Home directory.
    - `--username` - Username.
    - `--architecture` - CPU architecture.
- `hash <file>` - Calculate the SHA-256 hash of a file.
- `compress <src> <dest>` - Compress a file using Brotli.
- `decompress <src> <dest>` - Decompress a Brotli-compressed file.
- `.exit` - Exit the file manager.

## Error Handling

If an invalid command is entered or an operation fails, the file manager will display an appropriate error message such as `Operation failed` or `Invalid input`.

## License

This project is licensed under the MIT License.

---

This `README.md` file gives a clear overview of the features and usage instructions for your file manager project. You can include it in your project repository so that users and contributors can easily understand how to use the file manager.
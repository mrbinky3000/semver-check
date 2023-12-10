# semver-check
A tool to determine if a version satisfies a semver range. This tool is also able to list versions of existing node modules that match a semver range.

### Why?
Trying to decipher the semver rules made my eyes gloss over.  I learn better by experimentation.  Creating and using this command line node tool helped me grock just how semver works.

### Installation
`npm i -g @mtoledo/semver-check`

### Usage
```
Usage: semver-check [options] [command]

A tool to determine if a version satisfies a semver range. This tool is also able to list versions of existing node modules that match a semver range.

Options:
  -V, --version                           output the version number
  -h, --help                              display help for command

Commands:
  filter [options] <packageName> <range>
  List all the versions of <packageName> that are satisfied by a semver <range>. Example `filter commander ^1.0.0`

  test <version> <range>
  Test to see if a version number satisfies a semver range.

  help [command]                          display help for command
```

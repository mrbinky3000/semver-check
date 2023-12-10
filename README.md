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

### Examples

See which versions of a React satisfy the semver range of ^16.0.0

```
$> semver-check filter react ^16.0.0

✅ The following versions of react satisfy the semver range of ^16.0.0:
 16.0.0, 16.1.0, 16.1.1, 16.2.0, 16.3.0, 16.3.1, 16.3.2, 16.4.0, 16.4.1, 16.4.2, 16.5.0, 16.5.1, 16.5.2, 16.6.0, 16.6.1, 16.6.2, 16.6.3, 16.7.0, 16.8.0, 16.8.1, 16.8.2, 16.8.3, 16.8.4, 16.8.5, 16.8.6, 16.9.0, 16.10.0, 16.10.1, 16.10.2, 16.11.0, 16.12.0, 16.13.0, 16.13.1, 16.14.0
```

Get those results in json format with some metadata.

```
$> semver-check filter -j react ^16.0.0

{"packageName":"react","range":"^16.0.0","validVersions":["16.0.0","16.1.0","16.1.1","16.2.0","16.3.0","16.3.1","16.3.2","16.4.0","16.4.1","16.4.2","16.5.0","16.5.1","16.5.2","16.6.0","16.6.1","16.6.2","16.6.3","16.7.0","16.8.0","16.8.1","16.8.2","16.8.3","16.8.4","16.8.5","16.8.6","16.9.0","16.10.0","16.10.1","16.10.2","16.11.0","16.12.0","16.13.0","16.13.1","16.14.0"]}
```

Test if a supplied version satisfies a semver range

```
semver-check test 1.0.0-alpha.1 ^1.0.0-alpha.0
✅ The version "1.0.0-alpha.1" satisfies the semver range "^1.0.0-alpha.0"
```

```
semver-check test 1.0.0-alpha.1 ^1.0.0-beta.0
❌ The version  "1.0.0-alpha.1" falls outside of the semver range "^1.0.0-beta.0"
```

It's wise to put quotes around semver ranges that use symbols that have a special meaning to your shell, like the tilde

```
$> semver-check test 1.0.0-alpha.1 ~1.0.0
zsh: no such user or named directory: 1.0.0
```

```
semver-check test 2.0.0  "~2.0.0"
✅ The version "2.0.0" satisfies the semver range "~2.0.0"
```

#!/usr/bin/env node
import { Command } from 'commander';
import * as semver from 'semver';
import fetch from 'npm-registry-fetch';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require('../package.json');

const program = new Command();

program.version(packageJSON.version).description(packageJSON.description);

program
  .command('filter <packageName> <range>')
  .description(
    'List all the versions of <packageName> that are satisfied by a semver <range>. Example `filter commander ^1.0.0`'
  )
  .option('-j --json', 'format the output as json')
  .action(async (packageName, range, options) => {
    const versions = await fetchPackageVersions(packageName);
    const validVersions = filterPackageVersionsBySemver(packageName, range, versions);
    if (validVersions.length) {
      if (options.json) {
        console.log(
          JSON.stringify({
            packageName,
            range,
            validVersions,
          })
        );
      } else {
        console.log(
          `✅ The following versions of ${packageName} satisfy the semver range of ${range}:\n ${validVersions.join(
            ', '
          )}`
        );
      }
    } else {
      console.log(`❌ Version ${range} is not valid for the specified npm package.`);
      console.log(`Existing versions for the package: ${versions.join(', ')}`);
      process.exitCode = 1;
    }
  });

program
  .command('test <version> <range>')
  .description('Test to see if a version number satisfies a semver range.')
  .action((version, range) => {
    const result = TestVersionSatisfiesSemverRange(version, range);
    console.log(result.explanation);
    process.exitCode = result.isValid ? 0 : 1;
  });

program.parse(process.argv);

// There is no official Typescript Type for the response.  I had to look it up online. In the
// future, if we need to use more parts of the response, look at the official documentation here
// https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
// and update this interface.
interface PackageMetadata {
  versions: Record<string, unknown>;
}

async function fetchPackageVersions(packageName: string) {
  try {
    const packageInfo = await fetch.json(`https://registry.npmjs.org/${packageName}`);
    return Object.keys(packageInfo.versions as PackageMetadata);
  } catch (error) {
    throw new Error(`Unable to fetch versions for package '${packageName}'`);
  }
}

function filterPackageVersionsBySemver(packageName: string, range: string, versions: string[]) {
  const validVersions: string[] = [];
  versions.forEach((version) => {
    if (semver.satisfies(version, range)) {
      validVersions.push(version);
    }
  });
  return validVersions;
}

interface TestResult {
  isValid: boolean;
  explanation: string;
}

function TestVersionSatisfiesSemverRange(version: string, range: string): TestResult {
  try {
    const isValid = semver.satisfies(version, range);
    return {
      isValid,
      explanation: isValid
        ? `✅ The version "${version}" satisfies the semver range "${range}"`
        : `❌ The version  "${version}" falls outside of the semver range "${range}"`,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        isValid: false,
        explanation: `💀 Invalid SemVer constraint format. Could not parse "${range}"`,
        // todo: show exactly WHY it failed.
      };
    }
  }
  return {
    isValid: false,
    explanation: 'Internal error. You should never see this.',
  };
}

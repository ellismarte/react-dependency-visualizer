const fs = require("fs");
const path = require("path");
const { argv } = require("yargs");
const jsonfile = require("jsonfile");
const shell = require("shelljs");
const chalk = require("chalk");

const PWD = process.env.PWD;
const directoriesToIgnore = new Set([`${PWD}/node_modules`, `${PWD}/cms`]);
const validExtensions = ["js", "ts", "tsx"];
const requireRegExp = new RegExp(/require\(("|'|`)(\..*)("|'|`)\)/);
const importRegExp = new RegExp(/import (.*) from ('|"|`)(.*)('|"|`)/);

const checkForinitializationErrors = () => {
  const errors = [];

  if (!argv.o) {
    errors.push(`
    Please provide output output path for the app using --o flag \n
    e.g. visualizeReactDependencies --o=/Users/ellis/Desktop \n`);
  }

  return errors;
};

const hasValidExtension = (file) => {
  const extension = file.split(".").pop().toLowerCase();
  if (!extension) {
    return false;
  } else if (validExtensions.find((valid) => extension.match(valid))) {
    return true;
  }

  return false;
};

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  let _filelist = filelist || [];
  files.forEach((file) => {
    if (fs.statSync(dir + file).isDirectory()) {
      if (!directoriesToIgnore.has(dir + file)) {
        _filelist = walkSync(`${dir}${file}/`, _filelist);
      }
    } else {
      if (hasValidExtension(file)) {
        _filelist.push(dir + file);
      }
    }
  });
  return _filelist;
};

const checkLineForDependency = (line) => {
  if (line.match(importRegExp)) {
    const match = line.match(importRegExp);
    return match[3];
  } else if (line.match(requireRegExp)) {
    const match = line.match(requireRegExp);
    return match[2];
  }

  return null;
};

const getDependencies = (filelist) =>
  filelist.map((filepath) => {
    const data = fs.readFileSync(filepath, "UTF-8");

    const lines = data.split(/\r?\n/);

    const deps = lines.reduce((dependencies, line) => {
      const dependencyPath = checkLineForDependency(line);
      if (dependencyPath) {
        const filesDirSplit = filepath.split("/");
        filesDirSplit.pop();

        const resolvedDependencyPath = path
          .resolve(filesDirSplit.join("/"), dependencyPath)
          .replace("/Users/ellis/Documents/Github/", "");

        // could be two files in the same directory with a different extension
        // this means we can be wrong.
        filelist.forEach((fp) => {
          if (fp.match(resolvedDependencyPath)) {
            dependencies.push(fp);
          }
        });
      }

      return dependencies;
    }, []);

    return {
      file: filepath.replace(`${PWD}/`, ""),
      dependencies: deps,
    };
  });

const generateGraphData = (dependencies) =>
  dependencies.reduce(
    (nodesAndLinks, dep) => {
      nodesAndLinks.nodes.push({ id: dep.file.replace(`${PWD}/`, "") });
      dep.dependencies.forEach((d) => {
        nodesAndLinks.links.push({
          source: d.replace(`${PWD}/`, ""),
          target: dep.file.replace(`${PWD}/`, ""),
        });
      });

      return nodesAndLinks;
    },
    { nodes: [], links: [] }
  );

const writeAppData = (dependencies) => {
  const file = path.resolve(__dirname, "../app/src/data/dependencies.json");
  const obj = dependencies;

  jsonfile.writeFile(file, obj, { spaces: 2, EOL: "\r\n" }, function (err) {
    if (err) console.error(err);
  });
};

const getAppName = () => {
  if (!argv.name) {
    return "app" + Math.random() * 9999;
  }

  return argv.name;
};

exports.visualizeReactDependencies = () => {
  const initializationErrors = checkForinitializationErrors();
  if (initializationErrors.length) {
    initializationErrors.forEach((e) => {
      console.log(e);
    });
    return;
  }

  const files = walkSync(`${process.env.PWD}/`, []);
  const dependencies = getDependencies(files);
  const graphData = generateGraphData(dependencies);
  const allNodes = new Set(graphData.nodes);

  graphData.links.forEach((link) => {
    if (!allNodes.has(link.source)) {
      graphData.nodes.push({ id: link.source });
      allNodes.add(link.source);
    }
  });

  writeAppData(graphData);

  const appName = getAppName();

  setTimeout(() => {
    shell.cp("-R", path.resolve(__dirname, "../app/"), `${argv.o}/${appName}`);

    console.log(
      chalk.greenBright(
        `We're done! Run "yarn install" and "yarn start" from ${argv.o}/${appName} to see your dependencies.`
      )
    );
  }, 4000);
};

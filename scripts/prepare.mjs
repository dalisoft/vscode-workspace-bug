import fs from "node:fs/promises";
import _fs from "node:fs";
import path from "node:path";
import json5 from "json5";

import pkg from "../package.json" assert { type: "json" };
import rootTSConfig from "../tsconfig.json" assert { type: "json" };

const { workspaces } = pkg;
const workspaceMap = {};
const suffixPatch = {
  '@shared/api': '/src'
}

for (const workspace of workspaces) {
  const projectPkg = json5.parse(
    await fs.readFile(path.resolve(workspace, "package.json")),
  );
  const tsConfigPath = path.resolve(workspace, "tsconfig.json");
  const jsConfigPath = path.resolve(workspace, "jsconfig.json");

  const isTsConfig = _fs.existsSync(tsConfigPath);
  const isJsConfig = _fs.existsSync(jsConfigPath);

  workspaceMap[projectPkg.name] = workspace;

  if (isTsConfig || isJsConfig) {
    // Prepare
    const projectConfigFile = await fs.readFile(
      isTsConfig ? tsConfigPath : jsConfigPath,
    );

    let projectConfigUpdated = false;
    const projectConfig = json5.parse(projectConfigFile);
    const { paths: projectPaths } = projectConfig.compilerOptions;

    // Create modify
    const references = [];
    if (projectPaths) {
      for (const projectPath in projectPaths) {
        const $paths = projectPaths[projectPath];
        const old$path = $paths[0];

        if (old$path.includes("node_modules/")) {
          const projectId = projectPath.substring(0, projectPath.indexOf("/*"));
          const projectRef = workspaceMap[projectId];

          const refPath = `../${projectRef}`;
          let $path = refPath;

          if (suffixPatch[projectId]) {
            $path += suffixPatch[projectId];
          }

          references.push({ path: refPath });
          $paths[0] = $path + '/*';

          if (projectConfig.include?.length > 0) {
            let i = 0;
            while (i < projectConfig.include.length) {
              const include = projectConfig.include[i];

              if (include.includes(projectId)) {
                projectConfig.include.splice(i, 1);
              } else {
                i++;
              }
            }
          }
          if (projectConfig.exclude?.length > 0) {
            let i = 0;
            while (i < projectConfig.exclude.length) {
              const exclude = projectConfig.exclude[i];

              if (exclude.includes(projectId)) {
                projectConfig.exclude.splice(i, 1);
              } else {
                i++;
              }
            }
            projectConfig.exclude.push("node_modules");
          }

          projectConfigUpdated = true;
        }
      }
    }

    // Apply modify
    projectConfig.extends = "../tsconfig";
    if (references.length > 0) {
      projectConfig.references = references;
    }

    // Save file
    if (projectConfigUpdated) {
      await fs.writeFile(
        isTsConfig ? tsConfigPath : jsConfigPath,
        JSON.stringify(projectConfig, null, 2),
      );
    }
  }
}

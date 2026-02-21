import path from 'path';
import fs from 'fs';

/**
 * @typedef Module
 * @property {string} name
 * @property {string} path
 * @property {string|undefined} content
 */

/**
 * @param {Module[]} project
 * @returns {[string, Module[]]}
 */
export function createExecutableFromProject(project) {
  const getModFnName = (name) => name.replace(/\./g, '_').replace(/^_/, '');
  /** @type {Module[]} */
  const contents = [];

  for (let i = 0; i < project.length - 1; i++) {
    const mod = project[i];

    const existing = contents.find((m) => m.path === mod.path);
    const moduleContent = (!existing && `-- module: "${mod.name}"\nlocal function _loaded_mod_${getModFnName(mod.name)}()\n${mod.content}\nend\n`) || '';
    const requireMapper = `\n_G.package.loaded["${mod.name}"] = _loaded_mod_${getModFnName(existing?.name || mod.name)}()`;

    contents.push({
      ...mod,
      content: moduleContent + requireMapper,
    });
  }

  contents.push(project[project.length - 1]);

  return [
    contents.reduce((acc, con) => acc + '\n\n' + con.content, ''),
    contents,
  ];
}

/**
 * Create the project structure from the main file's content.
 * @param {string} mainFile
 * @returns {Module[]}
 */
export function createProjectStructure(mainFile) {
  const sorted = [];
  const cwd = path.dirname(mainFile);

  const isSorted = (node) => sorted.find((sortedNode) => sortedNode.path === node.path);

  function dfs(currentNode) {
    const unvisitedChildNodes = exploreNodes(currentNode, cwd).filter((node) => !isSorted(node));

    for (let i = 0; i < unvisitedChildNodes.length; i++) {
      dfs(unvisitedChildNodes[i]);
    }

    if (!isSorted(currentNode)) {
      sorted.push(currentNode);
    }
  }

  dfs({ path: mainFile });

  return sorted.filter((mod) => mod.content !== undefined);
}

/**
 * Find child nodes for a node (a module).
 * @param {Module} node
 * @param {string} cwd
 * @returns {Module[]}
 */
function exploreNodes(node, cwd) {
  if (!fs.existsSync(node.path)) return [];

  node.content = fs.readFileSync(node.path, 'utf-8');

  const requirePattern = /(?<!^.*--.*)(?<=(require( *)(\n*)(\()?( *)("|'))).*(?=("|'))/gm;
  const requiredModules = node.content.match(requirePattern)?.map((mod) => ({
    name: mod,
    path: path.join(cwd, mod.replace(/\./g, '/') + '.lua'),
    content: undefined,
  })) || [];

  return requiredModules;
}

export function pack(startFile) {
  const projectStructure = createProjectStructure(startFile);
  const [executable] = createExecutableFromProject(projectStructure);
  return executable;
}

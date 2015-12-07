import { posix as pp } from 'path';

export default function tree(callback) {
  let structure = callback(file, directory, symlink);
  return { structure, walk, map };
}

// Shorthands
function file(content, _stats = {}) {
  return {
    type: 'file',
    content
  };
}

function directory(items = {}, _stats = {}) {
  return {
    type: 'directory',
    items
  };
}

function symlink(path, _stats = {}) {
  return {
    type: 'symlink',
    path
  };
}

// Manipulators
function walk(callback) {
  _walk('', this.structure, callback);
}

function _walk(parent, structure, callback, map = false) {
  let names = Object.keys(structure);
    // .sort((a, b) => {
    //   let ta = structure[a].type, tb = structure[b].type;
    //   if (ta === 'directory' && tb !== 'directory') return -1;
    //   if (ta !== 'directory' && tb === 'directory') return +1;
    //   return a.localeCompare(b);
    // });

  for (let name of names) {
    let node = structure[name];
    let path = pp.join(parent, name);

    if (!map)
      callback(path, name, node);

    if (node.type === 'directory') {
      _walk(path, node.items, callback, map);
    }

    if (map)
      structure[name] = callback(path, name, node);
  }
}

function map(callback) {
  _walk('', this.structure, callback, true);
}

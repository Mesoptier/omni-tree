import { posix as pp } from 'path';

export function tree(callback) {
  let _tree = callback(file, directory, symlink);
  let result = { tree: _tree };
  result.walk = walk.bind(result);
  result.map = map.bind(result);
  return result;
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
  _walk('', this.tree, callback);
  return this;
}

function _walk(parent, _tree, callback, map = false) {
  let names = Object.keys(_tree.items);
    // .sort((a, b) => {
    //   let ta = _tree[a].type, tb = _tree[b].type;
    //   if (ta === 'directory' && tb !== 'directory') return -1;
    //   if (ta !== 'directory' && tb === 'directory') return +1;
    //   return a.localeCompare(b);
    // });

  for (let name of names) {
    let node = _tree.items[name];
    let path = pp.join(parent, name);

    if (!map) {
      callback(path, name, node);
    }

    if (node.type === 'directory') {
      _walk(path, node, callback, map);
    }

    if (map) {
      _tree.items[name] = callback(path, name, node);
    }
  }
}

function map(callback) {
  _walk('', this.tree, callback, true);
  return this;
}

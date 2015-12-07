import tree from '../src/tree';

let structure = tree((f, d, s) => {
  return {
    'd.txt': f('content'),
    'a': d({
      'b': d({
        'b1.txt': f('content'),
        'b2.txt': f('content', { mode: '0777' })
      }),
      'c': d({ /* Empty directory */ }, { mode: '0775' })
    }),
    'symlink': s('a/b/b1.txt')
  };
});

structure.map((path, name, node) => {
  if (node.type === 'file')
    return `file: ${path}`;
  if (node.type === 'symlink')
    return `symlink: ${path} -> ${node.path}`;
  return node;
});

console.log(require('util').inspect(structure.structure, { depth: null }));

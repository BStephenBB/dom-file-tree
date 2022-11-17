const NODES = Object.freeze({
  HTML: 'HTML',
  TEXT: '#text',
  HEAD: 'HEAD',
  COMMENT: '#comment',
})

function buildNode() {
  // TODO 
  // will need to either render a file or folder node
  // going to have to create and stitch together a bunch of elements
}

function renderNode(nodeInfo) {
  const { node, parent, depth = 0 } = nodeInfo
  const children = [...node.childNodes]
  const nodeName = node.nodeName

  // don't render comments
  if (nodeName === NODES.COMMENT) return
  // account for HTML node (we don't want to render it, but need to render it's children)
  const isHTMLNode = nodeName === NODES.HTML
  const newParent = isHTMLNode ? parent : buildNode(nodeInfo)
  const newDepth = isHTMLNode ? depth : depth + 1

  children.forEach((child) => renderNode({ node: child, parent: newParent, depth: newDepth }))
}

// some random html to render the file tree with:
const htmlString =
  '<html><head><meta charset="UTF-8"><title>Page title</title></head><body><p>Some Text <!-- A Comment --> More Text</p><section>hello<div>world<button>foobar</button></div></section></body></html>'
const parser = new DOMParser()
const html = parser.parseFromString(htmlString, 'text/html').querySelector('html')

// render the file tree
renderNode({ node: html, parent: document.querySelector('.file-tree') })

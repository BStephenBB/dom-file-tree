const NODES = Object.freeze({
  HTML: 'HTML',
  TEXT: '#text',
  HEAD: 'HEAD',
  COMMENT: '#comment',
})

function buildFolder({ node, parent, depth }) {
  // create elements
  const text = document.createTextNode(node.nodeName)
  const span = document.createElement('span')
  const div = document.createElement('div')
  const summary = document.createElement('summary')
  const details = document.createElement('details')
  // set indent
  summary.style.setProperty('--indent-padding', `${depth * INDENT_INCREMENT}px`)
  // account for head tag
  if (node.nodeName === NODES.HEAD) {
    details.classList.add('head')
  }
  // connect elements
  span.append(text)
  div.append(span)
  summary.append(div)
  details.append(summary)
  // append to parent
  parent.append(details)

  return details
}

function buildFile() {
  // TODO
}

const buildNode = (nodeInfo) =>
  nodeInfo.node.nodeName === NODES.TEXT ? buildFile(nodeInfo) : buildFolder(nodeInfo)


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

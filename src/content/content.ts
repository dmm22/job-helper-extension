import type { StorageSchema } from "../types"

let lastExecution = 0
const throttleSeconds = 2

const observer = new MutationObserver(() => {
  const now = Date.now()

  if (now - lastExecution >= throttleSeconds * 1000) {
    lastExecution = now
    traverseDomAndApplyStyles()
  }
})

const traverseDomAndApplyStyles = async () => {
  createAndAppendStylesheet()
  const appliedCompanyNames = await getAppliedCompanyNames()
  if (!appliedCompanyNames) console.log(appliedCompanyNames)
  if (!appliedCompanyNames) return

  const leafNodes = getLeafNodes(appliedCompanyNames)
  if (!leafNodes) console.log(leafNodes)
  if (!leafNodes) return

  applyStyles(appliedCompanyNames, leafNodes)
}

const getAppliedCompanyNames = async () => {
  const jobRecords = await getFromStorage("jobRecords")
  return jobRecords?.map(record => record.companyName) || null
}

const getLeafNodes = (appliedCompanyNames: string[]) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Element) => {
      if (node.childElementCount === 0 && !excludedTags.has(node.localName)) {
        return NodeFilter.FILTER_ACCEPT
      }

      return NodeFilter.FILTER_SKIP
    }
  })

  const appliedCompanyRe = appliedCompanyNames && convertArrayToRegex(appliedCompanyNames)

  let currentNode: Node | null = walker.currentNode

  let nodes = []

  while (currentNode) {
    currentNode = walker.nextNode()

    if (!currentNode?.textContent) continue
    if (appliedCompanyRe.test(currentNode.textContent)) {
      nodes.push(currentNode)
    }
  }

  return nodes.length > 0 ? (nodes as Element[]) : null
}

const applyStyles = (appliedCompanyNames: string[], leafNodes: Element[]) => {
  const appliedCompanyNamesRe = convertArrayToRegex(appliedCompanyNames)

  leafNodes.forEach(node => {
    const nodeInnerHTMLSegments = node.innerHTML.replace(/(>|<)/g, match => `${match}¿`).split("¿")
    console.log(nodeInnerHTMLSegments)

    const newInnerHTML = nodeInnerHTMLSegments
      .map(segment => {
        if (/"/.test(segment)) return segment

        return segment.replace(appliedCompanyNamesRe, keyword => {
          const startingChar = keyword.match(/^(\s|\(|>)/)?.[0]
          const endingChar = keyword.match(/(\s|\)|\.|\,|<)$/)?.[0]

          let formattedKeyword = startingChar ? keyword.slice(1) : keyword
          if (endingChar) formattedKeyword = formattedKeyword.slice(0, -1)

          return `${startingChar ?? ""}<span class="appliedCompanyName">${formattedKeyword}</span>${
            endingChar ?? ""
          }`
        })
      })
      .join("")

    node.innerHTML = newInnerHTML
  })
}

const createAndAppendStylesheet = () => {
  const style = document.createElement("style")

  style.textContent = `
    .appliedCompanyName {
      text-decoration: line-through;
      text-decoration-thickness: 2px;
      text-decoration-color: #525252;
    }
  `

  document.head.appendChild(style)
}

const convertArrayToRegex = (array: string[]) => {
  const escapedArr = array.map(str => {
    let newStr = str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return `((^|\\s|>|\\()${newStr}($|\\s|\\)|\\.|,|<))`
  })

  const regexPattern = escapedArr.join("|")

  return new RegExp(`(${regexPattern})`, "gi")
}

const getFromStorage = async <T extends keyof StorageSchema>(key: T) => {
  const savedValue = await chrome.storage.local.get(key)
  return Object.keys(savedValue).length === 0 ? null : (savedValue[key] as StorageSchema[T])
}

var excludedTags = new Set([
  "body",
  "style",
  "script",
  "img",
  "svg",
  "path",
  "link",
  "button",
  "form",
  "rect",
  "reach-portal",
  "table",
  "ul",
  "footer",
  "main",
  "nav",
  "g",
  "iframe",
  "fieldset",
  "legend",
  "defs",
  "noscript",
  "clipPath",
  "input",
  "textarea"
])

observer.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true
})

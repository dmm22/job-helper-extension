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

  const allElements = document.body.querySelectorAll("*")

  const appliedCompanyRe = convertArrayToRegex(appliedCompanyNames)
  const inclusionRe = convertArrayToRegex(inclusions)
  const exclusionRe = convertArrayToRegex(exclusions)
  const allKeywordRe = convertArrayToRegex([...appliedCompanyNames, ...inclusions, ...exclusions])
  const addedClassRe = /(appliedCompanyName|positiveHighlight|negativeHighlight)/

  allElements.forEach(el => {
    if (el.childElementCount !== 0 || excludedTags.has(el.localName) || !el.textContent) return

    let classes = ""

    if (appliedCompanyNames.length > 0 && appliedCompanyRe.test(el.textContent)) {
      classes += "appliedCompanyName"
    }

    if (inclusionRe.test(el.textContent)) {
      classes += " positiveHighlight"
    }

    if (exclusionRe.test(el.textContent)) {
      classes += " negativeHighlight"
    }

    if (!classes || addedClassRe.test(el.className)) return

    const innerHtmlSegments = el.innerHTML.replace(/(>|<)/g, match => `${match}¿`).split("¿")

    const newInnerHTML = innerHtmlSegments
      .map(segment => {
        if (/"/.test(segment)) return segment

        return segment.replace(allKeywordRe, keyword => {
          const startingChar = keyword.match(/^(\s|\(|>)/)?.[0]
          const endingChar = keyword.match(/(\s|\)|\.|\,|<)$/)?.[0]

          let formattedKeyword = startingChar ? keyword.slice(1) : keyword
          if (endingChar) formattedKeyword = formattedKeyword.slice(0, -1)

          return `${startingChar ?? ""}<span class="${classes}">${formattedKeyword}</span>${
            endingChar ?? ""
          }`
        })
      })
      .join("")

    el.innerHTML = newInnerHTML
  })
}

const getAppliedCompanyNames = async () => {
  const jobRecords = await getFromStorage("jobRecords")
  return jobRecords?.map(record => record.companyName) || []
}

const createAndAppendStylesheet = () => {
  const style = document.createElement("style")

  style.textContent = `
    .appliedCompanyName {
      text-decoration: line-through;
      text-decoration-thickness: 2px;
      text-decoration-color: #525252;
    }

    .positiveHighlight {
      padding-inline: 3px;
      background-color: rgb(74, 222, 128, 0.6);
      color: black;
    }
    
    .negativeHighlight {
      padding-inline: 3px;
      background-color: rgb(255, 167, 167, 0.6);
      color: black;
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

function createKeywordRegex(arr: string[]) {
  const escapedArr = arr.map(str => {
    let newStr = str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return `((^|\\s|>|\\()${newStr}($|\\s|\\)|\\.|,|<))`
  })

  const regexPattern = escapedArr.join("|")

  return new RegExp(`(${regexPattern})`, "gi")
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

var inclusions = [
  "node.js",
  "node",
  "nodejs",
  "reactjs",
  "react",
  "react.js",
  "python",
  "react",
  "javascript",
  "html",
  "html5",
  "css",
  "css3",
  "php",
  "laravel",
  "rest",
  "typescript",
  "sql",
  "restful",
  "nextjs",
  "next.js",
  "prisma",
  "api",
  "json"
]

var exclusions = [
  "blockchain",
  "smart contract",
  "wordpress",
  "drupal",
  "mocha",
  "native",
  "ruby on rails",
  "java"
]

observer.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true
})

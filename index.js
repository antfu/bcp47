const normalize = require('bcp-47-normalize')
const bcp47 = require('bcp-47')
const Prism = require('prismjs')

const input = document.getElementById('input')
const parsedOutput = document.getElementById('parsed')
const normalizedOutput = document.getElementById('normalized')
const normalizedInfo = document.getElementById('normalizedInfo')
const intl = document.getElementById('intl')
const normalizedIntl = document.getElementById('normalizedIntl')

input.value = new URLSearchParams(location.search).get('locale') || 'zh-hans-cn'

const JSON_LANG = {
  'property': {
    pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    greedy: true
  },
  'string': {
    pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    greedy: true
  },
  'comment': /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
  'number': /-?\d+\.?\d*(?:e[+-]?\d+)?/i,
  'punctuation': /[{}[\],]/,
  'operator': /:/,
  'boolean': /\b(?:true|false)\b/,
  'null': {
    pattern: /\bnull\b/,
    alias: 'keyword'
  }
}

function update() {
  const value = input.value
  const normalized = normalize(value)
  parsedOutput.innerText = ''

  let warning
  parsed = Prism.highlight(JSON.stringify(bcp47.parse(value, {
    warning(reason) {
      warning = reason
    }
  }), null, 2), JSON_LANG, 'json')

  parsedOutput.innerHTML = parsed
  normalizedOutput.innerText = warning || normalized
  normalizedInfo.innerHTML = Prism.highlight(JSON.stringify(bcp47.parse(normalized), null, 2), JSON_LANG, 'json')

  try {
    intl.innerText = Intl.getCanonicalLocales(value)
  }
  catch (e) {
    intl.innerText = e.toString()
  }

  try {
    normalizedIntl.innerText = Intl.getCanonicalLocales(normalized)
  } catch (e) {
    normalizedIntl.innerText = e.toString()
  }
}

update()

input.addEventListener('input', update)

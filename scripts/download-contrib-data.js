#!/usr/bin/env node
const {join} = require('path')
const {outputJson} = require('fs-extra')
const {loadJson} = require('./prepare-data/util')

const CONTRIB_DATA_URL = 'https://raw.githubusercontent.com/axel1234567890/covid/main/chiffres-cles.json'

async function main() {
  const records = await loadJson(CONTRIB_DATA_URL)
  const filtered = records
    .filter(r => {
      if (r.date < '2020-03-02') {
        return false
      }

      if (r.sourceType === 'sante-publique-france') {
        return true
      }

      if (r.sourceType === 'ministere-sante' && r.date < '2020-05-04') {
        return true
      }

      return false
    })

  await outputJson(join(__dirname, '..', 'data', 'contrib-data.json'), false, {spaces: 2})
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})


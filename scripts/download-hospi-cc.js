#!/usr/bin/env node
/* eslint unicorn/string-content: off */
require('dotenv').config()
const {join} = require('path')
const Airtable = require('airtable')
const {outputJson} = require('fs-extra')

async function extractFromAirtable(databaseId, tabName) {
  const airtable = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(databaseId)
  const records = await airtable(tabName).select().all()

  return records.map(record => record.fields)
}

const valuesMap = {
  casConfirmes: 'Cas confirmés modifié',
  deces: 'Décès à l’hôpital modifié',
  decesEhpad: 'Décès en EHPAD et EMS modifié',
  hospitalises: 'Hospitalisations modifié',
  reanimation: 'En réanimation modifié',
  gueris: 'Retours à domicile modifié',
  casConfirmesEhpad: 'Cas confirmés EHPAD/EMS modifié',
  nouvellesHospitalisations: 'Nouveaux patients hospitalises modifié',
  nouvellesReanimations: 'nouveaux patients en reanimation modifié'
}

function convertRow(row) {
  const convertedRow = {
    date: row.Date,
    code: 'FRA',
    nom: 'France',
    source: {nom: 'Ministère de la Santé modifié'},
    sourceType: 'ministere-sante'
  }

  Object.keys(valuesMap).forEach(key => {
    if (valuesMap[key] in row && Number.isInteger(row[valuesMap[key]])) {
      convertedRow[key] = row[valuesMap[key]]
    }
  })

  return convertedRow
}

async function buildHospiCc() {
  const rows = await extractFromAirtable('appvqjbgBnxfnGtka', 'Onglet vue d\'ensemble modifié')
  return rows.map(row => convertRow(row))
}

async function main() {
  const records = await buildHospiCc()
  await outputJson(join(__dirname, '..', 'data', 'hospi-cc.json'), records)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})

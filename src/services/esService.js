import { Client } from '@elastic/elasticsearch'
import moment from 'moment'

const { filterSort } = require('../utils')

const client = new Client({
  node: process.env.ES_HOST,
  auth: {
    username: process.env.ES_USER,
    password: process.env.ES_PWD,
  },
})

export async function fetchList ({ table, filters, search, from, size, sort }) {
  // const sqlQuery = filterSort.getSqlQuery({
  const queryJson = filterSort.getQueryDsl({
    table,
    filters,
    search,
    from,
    size,
    sort,
  })
  // console.log('queryJson -> ', JSON.stringify(queryJson))

//   const result = await client.transport
//     .request({
//       method: 'POST',
//       path: '/_opendistro/_sql?format=json',
//       body: {
//         query: sqlQuery,
//       },
//     })
//     .catch((err) => {
//       console.log('Error: ', err.message)
//     })
  const result = await client
    .search({
      index: table,
      from,
      size,
      body: queryJson
    })
    .catch((err) => {
      console.log('Error: ', err.message)
    })

  if (!result || !result.body || !result.body.hits) return

  const data = {
    from: from,
    size: size,
    total: result.body.hits.total.value,
    [table]: [],
  }

  await result.body.hits.hits.forEach((row) => {
    data[table].push({
      id: row._id,
      ...row._source,
    })
  })

  // console.log(data)
  return { body: data }
}

export async function fetchListAll ({ table, from, size }) {
  const result = await client
    .search({
      index: table,
      from,
      size,
      body: {
        query: { bool: { must_not: { exists: { field: 'deleted_at' } } } },
        sort: [{ '@timestamp': 'desc' }],
      },
    })
    .catch((err) => {
      console.log('Error: ', err.message)
    })

  if (!result || !result.body || !result.body.hits) return

  const data = {
    from: from,
    size: size,
    total: result.body.hits.total.value,
    [table]: [],
  }
  await result.body.hits.hits.forEach((row) => {
    data[table].push({
      id: row._id,
      ...row._source,
    })
  })

  return { body: data }
}

export async function fetchItem (table, id) {
  const result = await client
    .get({
      index: table,
      id: id,
    })
    // .catch((err) => {
    //   console.log('Error: ', err.message)
    // })

  // if (
  //   !result ||
  //   !result.body ||
  //   !result.body._source ||
  //   result.body._source.deleted_at !== null
  // ) {
  //   return
  // }

  // const data = {
  //   id: result.body._id,
  //   ...result.body._source,
  // }

  if (!result) return

  const data = result

  return { [table]: data }
}

export async function createItem (table, item) {
  const body = {
    ...item,
    updated_at: null,
    deleted_at: null,
    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    '@timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
  }

  return client.index({
    index: table,
    body: body,
  })
}

export async function updateItem (table, id, item) {
  if (!id) return
  return client
    .update({
      index: table,
      id: id,
      body: {
        doc: {
          ...item,
          updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
          '@timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    })
    .catch((err) => {
      console.log('Error: ', err.message)
    })
}

export async function deleteItem (table, id) {
  if (!id) return
  return client
    .update({
      index: table,
      id: id,
      body: {
        doc: {
          deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    })
    .catch((err) => {
      console.log('Error: ', err.message)
    })
}

export async function forceDeleteItem (table, id) {
  if (!id) return
  return client
    .delete({
      index: table,
      id: id,
    })
    .catch((err) => {
      console.log('Error: ', err.message)
    })
}

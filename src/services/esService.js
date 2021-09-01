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

/**
 * @description 엘라스틱서치 검색후 결과를 반환함
 * @param {JSON} root0 - 검색정보
 * @param {string} root0.table - 대상테이블이름
 * @param {JSON} root0.filters - 검색필터
 * @param {JSON} root0.search - 검색필터
 * @param {number} root0.from - limit 페이징 시작위치
 * @param {number} root0.size - offset 페이징 페이지사이즈
 * @param {JSON} root0.sort - 정렬필터
 * @returns {JSON} - 검색결과
 */
export async function fetchList ({ table, filters, search, from, size, sort }) {
  const queryJson = filterSort.getQueryDsl({
    table,
    filters,
    search,
    from,
    size,
    sort,
  })

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

/**
 * @description 엘라스틱서치 전체데이터를 반환함 (페이징 처리함)
 * @param {JSON} root0 - 검색정보
 * @param {string} root0.table - 대상테이블이름
 * @param {number} root0.from - limit 페이징 시작위치
 * @param {number} root0.size - offset 페이징 페이지사이즈
 * @returns {JSON} - 검색결과
 */
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

/**
 * @description 엘라스틱서치 레코드정보를 반환함
 * @param {string} table - 대상테이블이름
 * @param {string} id - 찾고자 하는 레코드의 아이디
 * @returns {JSON} - 검색결과
 */
export async function fetchItem (table, id) {
  const result = await client.get({
    index: table,
    id: id,
  })

  if (!result) return

  const data = result

  return { [table]: data }
}

/**
 * @description 엘라스틱서치 레코드를 생성함
 * @param {string} table - 대상테이블이름
 * @param {JSON} item - 생성하고자 하는 레코드정보
 * @returns {JSON} - 생성결과
 */
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

/**
 * @description 엘라스틱서치 레코드를 수정함
 * @param {string} table - 대상테이블이름
 * @param {string} id - 수정하고자 하는 레코드의 아이디
 * @param {JSON} item - 수정하고자 하는 레코드정보
 * @returns {JSON} - 수정결과
 */
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

/**
 * @description 엘라스틱서치 레코드를 삭제함
 * (단) 물리적이 아닌 논리적으로 삭제함, delete_at에 삭제시간만 등록하며 이 후 삭제된 것으로 인식함
 * @param {string} table - 대상테이블이름
 * @param {string} id - 삭제하고자 하는 레코드의 아이디
 * @returns {JSON} - 삭제결과
 */
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

/**
 * @description 엘라스틱서치 레코드를 물리적으로 삭제함
 * @param {string} table - 대상테이블이름
 * @param {string} id - 삭제하고자 하는 레코드의 아이디
 * @returns {JSON} - 삭제결과
 */
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

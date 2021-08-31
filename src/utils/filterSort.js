//* eslint-disable */
const { Op } = require('sequelize')

const RANGE = {
  gt: ' > ',
  gte: ' >= ',
  lt: ' < ',
  lte: ' <= ',
  eq: ' = ',
  ne: ' <> ',
  like: ' LIKE ',
  isnull: ' IS NULL',
  isnotnull: ' IS NOT NULL',
}

// 필드:{min:0, max:10} 와 같은쿼리를 엘라스틱에서 처리하기 위해
// 필드.min --> `필드`.`min`  와 같이 반환한다.
function wrapKey(key) {
  const ksplit = key.split('.')
  let result = ''
  for (const i in ksplit) {
    if (result !== '') result += '.'
    result += '`' + ksplit[i] + '`'
  }
  return result
}

// 문자이면 ' ' 문자로 감싼다.
// like 처리시 % 를 붙이려면 append='%' 를 입력받는다.
function wrapValue(value, append) {
  return typeof value === 'number' ? value : '\'' + value + (append || '') + '\''
}

function parseSort(key, value) {
  const jsonObj = {}
  jsonObj[key] = { order: value }
  return JSON.parse(JSON.stringify(jsonObj))
}

export const filterSort = {
  /**
   * 0. filter Key 가 Model Column 비교하여 Sequelize 구문으로 변환
   * 1. 있을 경우: 추가
   * 2. 없을 경우: 무시
   * @param where
   * @param filter
   * @param Model
   * @returns {{}}
   */
  setFilter(where, filter, Model) {
    where = where || { [Op.and]: [] }
    const attributes = Object.keys(Model.rawAttributes)
    for (const [key, value] of Object.entries(filter)) {
      if (attributes.findIndex((element) => element === key) > -1) {
        const operator = Object.keys(value)[0]
        const values = Object.values(value)[0]
        where[Op.and].push({
          [key]: { [Op[operator]]: values },
        })
      }
    }

    return where
  },

  /**
   * 0. filter Key 가 Model Column 비교하여 Sequelize 구문으로 변환
   * 1. 있을 경우: 추가
   * 2. 없을 경우: 무시
   * @param where
   * @param filter
   * @param Model
   * @returns {{filter: {}, otherFilter: []}}
   */
  setFilterOr(where, filter, Model) {
    where = where || { [Op.or]: [] }
    const attributes = Object.keys(Model.rawAttributes)

    for (const [key, value] of Object.entries(filter)) {
      if (attributes.findIndex((element) => element === key) > -1) {
        where[Op.or].push({
          [key]: { [Op.substring]: ['%' + value + '%'] },
        })
      }
    }

    return where
  },

  /**
   * 0. Sort Key 가 Model Column 비교하여 Sequelize 구문으로 변환
   * 1. 있을 경우: 추가
   * 2. 없을 경우:
   * @param order
   * @param filter
   * @param Model
   * @returns {*[]}
   */
  setSort(order, filter, Model) {
    order = order || []
    // const otherSort = []
    const attributes = Object.keys(Model.rawAttributes)

    filter.forEach((obj) => {
      const key = Object.keys(obj)[0]
      if (attributes.findIndex((element) => element === key) > -1) {
        order.push([key, obj[key]])
      }
    }, [])

    // return {sort: order, otherSort: otherSort }
    return order
  },

  // 엘라스틱서치 전용
  getSqlQuery({ table, filter, search, from, size, sort }) {
    let sqlQuery = ''

    if (filter !== undefined) {
      for (const [key, value] of Object.entries(filter)) {
        sqlQuery += 'AND '

        if (value instanceof Object) {
          if (value instanceof Array) {
            // "주소": ["서울", "서울특별시"]
            //  ==>  select * from realty where (`주소` like '서울%' and `주소` like '서울특별시%')

            let whereIn = ''
            for (const value2 of value) {
              if (whereIn !== '') whereIn += 'OR '
              whereIn += `${wrapKey(key)} LIKE ` + wrapValue(value2, '%') + ' '
            }

            sqlQuery += `(${whereIn}) `
          } else {
            // "면적": { "gte": 10, "lte": 19 }
            //  ==>  select * from realty where (`면적` >= 10 and `면적` <= 19)

            let whereSub = ''
            for (const [key2, value2] of Object.entries(value)) {
              if (whereSub !== '') whereSub += 'AND '
              const operator = RANGE[key2.toLowerCase()]
              if (key2.toLowerCase() === 'like') {
                whereSub +=
                  `${wrapKey(key)} ${operator} ` + wrapValue(value2, '%') + ' '
              } else {
                whereSub += `${wrapKey(key)} ${operator} ` + wrapValue(value2) + ' '
              }
            }

            sqlQuery += whereSub
          }
        } else {
          // "주소": "서울"
          //  ==>  select * from realty where `주소` = '서울'

          sqlQuery += `${wrapKey(key)} = ` + wrapValue(value) + ' '
        }
      }
    }

    if (search !== undefined) {
      if (search.fields !== undefined && search.keyword !== undefined) {
        // "search": {"fields": ["건축물명", "주소"],"keyword": "자이"}
        //  ==>   select * from realty where (`건축물명` like '자이%' and `주소` like '자이%')

        let whereIn = ''
        for (const fields of search.fields) {
          if (whereIn !== '') whereIn += 'OR '
          whereIn +=
            `\`${fields}\` LIKE ` + wrapValue(search.keyword, '%') + ' '
        }
        sqlQuery += `AND (${whereIn}) `
      }
    }

    sqlQuery =
      `SELECT * FROM ${table} ` +
      (sqlQuery === '' ? '' : 'WHERE `deleted_at` is null ' + sqlQuery)

    if (sort !== undefined) {
      let orderby = ''
      for (const row of sort) {
        if (orderby !== '') orderby += ', '
        const col = Object.keys(row)
        orderby += `\`${col[0]}\` ${row[col]} `
      }

      sqlQuery += 'ORDER BY ' + orderby + ' '
    }

    if (from !== undefined && size !== undefined) {
      sqlQuery += `LIMIT ${from}, ${size} `
    }

    return sqlQuery
  },

  // 엘라스틱서치 전용
  getQueryDsl({ table, filters, search, from, size, sort }) {
    //
    const queryJson = {
      query: {
        bool: {
          must: [],
          must_not: {
            exists: { field: 'deleted_at' }
          }
        }
      }
    }

    if (search !== undefined) {
      if (search.fields !== undefined && search.keyword !== undefined) {
        // 여러필드검색 ->   "search": {"fields": ["건축물명", "주소", "매물소개"],"keyword": "자이"}
        const jsonObj = { query_string: { query: search.keyword, fields: search.fields } }
        queryJson.query.bool.must.push(jsonObj)
      }
    }

    if (filters !== undefined) {
      for (const [key, value] of Object.entries(filters)) {
        let jsonObj;
        if (value instanceof Object) {
          if (value instanceof Array) {
            // 여러검색어 ->  "filter": {"주소": ["서울", "서울특별시"]}
            jsonObj = { terms: { [key]: value } }
          } else {
            const nJsonObj = []
            for (const [nKey, nValue] of Object.entries(value)) {
              if (nValue instanceof Object) {
                // 중첩검색 전처리
                if (nValue instanceof Array) {
                  // 중첩검색>여러검색어 ->  "filter": {"주소": ["서울", "서울특별시"]}
                  nJsonObj.push({ terms: { [`${key}.${nKey}`]: nValue } })
                } else {
                  // 중첩검색>범위검색 ->  "filter": {"면적": { "gte": 10, "lte": 19 }}
                  nJsonObj.push({ range: { [`${key}.${nKey}`]: nValue } })
                }
              }
            }

            if (nJsonObj.length > 0) {
              // 중첩검색
              jsonObj = { nested: { path: key, query: { bool: { must: nJsonObj } } } }
            } else {
              // 범위검색 ->  "filter": {"면적": { "gte": 10, "lte": 19 }}
              jsonObj = { range: { [key]: value } }
            }
          }
        } else {
          // 단일검색 ->  "filter": {"매물유형": "아파트"}
          jsonObj = { term: { [key]: value } }
        }

        queryJson.query.bool.must.push(jsonObj)
      }
    }

    queryJson.sort = []
    if (sort === undefined) {
      // 정의하지 않았을때
      const jsonObj = {}
      jsonObj['@timestamp'] = { order: 'desc' }
      queryJson.sort.push(jsonObj)
    } else {
      if (sort instanceof Array) {
        // 배열일때
        for (const row of sort) {
          const col = Object.keys(row)
          queryJson.sort.push(parseSort(col[0], row[col]))
        }
      } else if (sort instanceof Object) {
        // 배열이 아닐때
        const col = Object.keys(sort)
        queryJson.sort.push(parseSort(col[0], sort[col]))
      }
    }

    if (from !== undefined) queryJson.from = from
    if (size !== undefined) queryJson.size = size

    return queryJson
  }

}

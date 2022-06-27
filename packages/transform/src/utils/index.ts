import { isObject } from 'lodash'
export const getArrAndFirstParams = (obj, arrKey: string, firstKey: string) => {
  const firstVal = (obj || {})[firstKey]
  const arrVal = Array.from(
    new Set([firstVal, ...((obj || {})[arrKey] || [])].filter(i => i))
  )

  const [first] = arrVal

  return {
    [arrKey]: arrVal,
    [firstKey]: first
  }
}
export const getIdForApi = (obj, key) => {
  const data = obj || {}
  let id = data[key]

  if (isObject(id)) {
    const { id: objId, _id = '' } = (id || {}) as any
    id = objId || _id
  } else if (data[`${key}_id`]) {
    id = data[`${key}_id`]
  } else if (data[`${key}Id`]) {
    id = data[`${key}Id`]
  }

  return id
}

export const strArrClean = (arr): string[] =>
  arr.filter(i => i).filter((t, i, arr) => arr.indexOf(t) === i)

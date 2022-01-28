export function rangeArray(size: number) {
  const _array: Array<number> = []
  for (let i = 0; i < size; i++) {
    _array[i] = i
  }
  return _array
}

export const queryString = (params?: Record<string, string>): string => {
  if (!params || params === null) {
    return ''
  }
  return (
    `?${
      Object.keys(params)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&')}`
  )
}

/**
 * 将http转为https
 * @param url 链接
 */
export const parse2Https = (url: string) => {
  if (!url) return url
  return url.startsWith('https') ? url : url.replace('http', 'https')
}

export const parseDate = function (date: string) {
  const t = Date.parse(date)
  if (typeof t === 'number') {
    return new Date(Date.parse(date.replace(/-/g, '/')))
  }
  return new Date()
}

export function parseWeekday(sDate: any) {
  const dt = typeof sDate === 'string' ? new Date(sDate.replace(/-/g, '/')) : sDate
  const a = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return a[dt.getDay()]
}

/**
 * compareVersion('1.11.0', '1.9.9')
// 1 新版本 0相同版本 -1低版本
 */
export function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    } if (num1 < num2) {
      return -1
    }
  }

  return 0
}

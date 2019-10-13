export function getTableData(data = []) {
  return data.map((item, index) => {
    return {
      isDone: item.isDone,
      index,
      title: item.title,
      description: item.description,
      bucket: item.bucket && item.bucket.title || ''
    }
  })
}
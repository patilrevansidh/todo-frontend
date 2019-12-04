export function getHeader(row) {
  const headers = [];
  Object.keys(row).filter(dataKey => {
    var mainHeaders = {};
    let cellValue = row[dataKey];
    let cellType = typeof row[dataKey];
    cellValue =
      (cellType == "string" && isJson(cellValue) && JSON.parse(cellValue)) ||
      cellValue;
    cellType = typeof cellValue;
    if (cellType !== "object" || cellValue == null) {
      mainHeaders = {
        header: dataKey
      };
      headers.push(mainHeaders);
    } else if (Array.isArray(cellValue) && cellValue.length > 0) {
      const subRow = cellValue[0];
      mainHeaders = {
        header: dataKey,
        subHeaders: []
      };
      Object.keys(subRow).forEach(sK => {
        let subRowValue = subRow[sK];
        let subcellType = typeof row[dataKey];
        subRowValue =
          (subcellType == "string" &&
            isJson(subRowValue) &&
            JSON.parse(subRowValue)) ||
          subRowValue;
        subcellType = typeof subRowValue;
        let sb;
        if (typeof sb === "object" && subRowValue != null) {
          sb = getHeader(sK);
        } else {
          sb = sK;
        }
        mainHeaders.subHeaders.push(sb);
      });
      headers.push(mainHeaders);
    } else {
      mainHeaders = getHeader(cellValue);
      headers.push(...mainHeaders);
    }
  });
  return headers;
}

function isJson(str) {
  if (str == null || str === undefined) return false;
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function getKeys(obj) {
  if (typeof obj === 'object' && Object.keys(obj).length > 0) {
    return Object.keys(obj)
  }
}
function getSubHeaders(arr) {
  return getTestHeaders(arr[0])
}
function isSimpleValue(cellValue) {
  const cellType = typeof cellValue;
  if (cellType === 'number') return true;
  if (cellType === 'object' && cellValue == null) return true;
  if (cellType === 'string' && !isJson(cellValue)) return true
  return false
}

export function getTestHeaders(obj) {
  const headers = [];
  Object.keys(obj).forEach(objKey => {
    const cellValue = obj[objKey];
    const cellType = typeof cellValue;
    if (isSimpleValue(cellValue)) {
      headers.push({ header: objKey })
    }
    if (Array.isArray(cellValue) && cellValue.length > 0) {
      const subHeaders = getSubHeaders(cellValue);
      headers.push({ header: objKey, subHeaders: subHeaders })
    } else if (cellType === 'object' && cellValue && Object.keys(cellValue)) {
      const sbHeaders = getKeys(cellValue);
      headers.push({ header: objKey })
    }
  })
  return headers;

}

export function getAggridTestHeader(header = []) {
  var agHeader = [];
  header.forEach(h => {
    if (h.header) {
      if (!h.subHeaders) {
        const title = getcamelCasetoTitle(h.header);
        agHeader.push({
          headerName: title,
          field: h.header,
          sortable: true,
          filter: "agTextColumnFilter",
          floatingFilterComponent: "partialMatchFilter"
        });
      }
      if (h.subHeaders && h.subHeaders.length > 0) {
        const title = getcamelCasetoTitle(h.header);
        const children = getAggridTestHeader(h.subHeaders)
        agHeader.push({
          headerName: title,
          field: h.header,
          children,
          sortable: true,
          filter: "agTextColumnFilter",
          floatingFilterComponent: "partialMatchFilter"
        });
      }
    }
  });
  return agHeader;
}

function getSubHeader(subHeaders=[]){
  const children = getAggridTestHeader(subHeaders);
  return children;
}

function getcamelCasetoTitle(text = "") {
  if (typeof text !== 'string') console.log(text);
  return (
    text
      .replace(/([a-z])([A-Z][a-z])/g, "$1 $2")
      .charAt(0)
      .toUpperCase() + text.slice(1).replace(/([a-z])([A-Z][a-z])/g, "$1 $2")
  );
}

;
function getExeceptionRowsSingleRecord(data) {
  const repeatingValues = {};
  const repeatingRows = []
  let hasNestedObject = false;
  Object.keys(data).forEach(key => {
    let cellValue = data[key];
    let cellType = typeof data[key];
    const isJsonString = cellType == "string" && isJson(cellValue)
    if(isJsonString){
      cellValue = JSON.parse(cellValue)
      cellType = typeof cellValue;
    }
    if ((cellType === "number" || cellType === "string" || cellValue == null || cellValue =='null') && !isJsonString) {
      repeatingValues[key] = cellValue;
    }
    if(Array.isArray(cellValue)){
      cellValue.forEach(cell=>{
        hasNestedObject = true;
        const nonReaptRow = getExeceptionRowsSingleRecord(cell);
        nonReaptRow.forEach(item=>{
          repeatingRows.push({...repeatingValues, ...item})
        })
      })
    }
  });
  if (!hasNestedObject) {
    return [repeatingValues];
  }
  return repeatingRows;
}

export function getExceptionRows(data = []) {
  let rowsData = [];
  data.forEach(d => {
    const singleObjectRows = getExeceptionRowsSingleRecord(d);
    rowsData = [...rowsData, ...singleObjectRows];
  });
  return rowsData;
}
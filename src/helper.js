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
      headers.push({header:objKey})
    }
    if (Array.isArray(cellValue) && cellValue.length > 0) {
      const subHeaders = getSubHeaders(cellValue);
      headers.push({ header: objKey, subHeaders:subHeaders })
    } else if (cellType === 'object' && cellValue && Object.keys(cellValue)) {
      const sbHeaders = getKeys(cellValue);
      headers.push({header: objKey})
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
      if (h.subHeaders && Array.isArray(h.subHeaders)) {
        const headerTitle = getcamelCasetoTitle(h.header);
        const children = getAggridTestHeader(h.subHeaders)
        return {
          headerName:headerTitle,
          children: children
        }
        // var children = h.subHeaders.map(sbH => {
        //   let headerName = typeof sbH =='string' &&getcamelCasetoTitle(sbH);
        //   if (!sbH.subHeaders) {
        //     const child = {
        //       headerName,
        //       field: sbH,
        //       resizable: true,
        //       sortable: true,
        //       filter: "agTextColumnFilter",
        //       floatingFilterComponent: "partialMatchFilter"
        //     };
        //     return child;
        //   }
        //   if(sbH.subHeaders){
        //     const nested = getAggridTestHeader(sbH.subHeaders)
        //     return {
        //       headerName,

        //     }
        //   }
        // });
        // agHeader.push({ headerName: headerTitle, children: children });
      }
    } else if (Array.isArray(h)) {
      // var subHeader = getAggridTestHeader(h);
      // agHeader.push(...subHeader);
    }
  });
  return agHeader;
}

function getcamelCasetoTitle(text = "") {
  if(typeof text !=='string') console.log(text);
  return (
    text
      .replace(/([a-z])([A-Z][a-z])/g, "$1 $2")
      .charAt(0)
      .toUpperCase() + text.slice(1).replace(/([a-z])([A-Z][a-z])/g, "$1 $2")
  );
}
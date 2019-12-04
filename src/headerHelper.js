// import { store } from "../../App";
// import { admincontrolTableDef, portalcontrolTableDef } from "./TableHeaders";
export const TABLE_HEADER_TYPE = {
    EXCEPTION_TABLE: " EXCEPTION_TABLE",
    RULE_TABLE: "RULE_TABLE",
    CONTROL_TABLE: "CONTROL_TABLE",
    CONTROL_SUMMARY: "CONTROL_SUMMARY"
}
// export function getTableTitleString({ type, data, state }) {
//     const { isAdminPage, productFamily, categoryType, control } = state;
//     switch (type) {
//         case TABLE_HEADER_TYPE.EXCEPTION_TABLE:
//             if (isAdminPage) return null
//             let exceptionTableHeader =
//                 // control && productFamily.productFamilyName + " > " +
//                 // control.controlType + " Controls > " +
//                 control.name
//             //   + " > " + control.controlId
//             return "Control Exception Log" + " : " + exceptionTableHeader;
//             return exceptionTableHeader + " : " + "Exceptions";

//         case TABLE_HEADER_TYPE.RULE_TABLE:
//             let ruleTableHeader =
//                 //  control && productFamily.productFamilyName + " > " + control.controlType +
//                 // " Controls > " + 
//                 control.name + " Control"
//             // + " > " + control.controlId
//             ruleTableHeader = ruleTableHeader + " : Rules"
//             return ruleTableHeader;

//         case TABLE_HEADER_TYPE.CONTROL_TABLE:
//             let categoryTitle = categoryType && categoryType.categoryType + " " + "Controls";
//             //  categoryType && categoryType.categoryName &&
//             //    categoryType.categoryType + " Controls > " + categoryType.categoryName
//             //  || categoryType && categoryType.categoryType + " " + "Controls";
//             return productFamily.productFamilyName + " : " + categoryTitle;

//         case TABLE_HEADER_TYPE.CONTROL_SUMMARY:
//             const controlListTitle = isAdminPage
//                 ? `${productFamily.productFamilyName} Health Check: ${productFamily.rulesCount || 0}`
//                 : productFamily.productFamilyName + " Health Check: " + data.exceptionSummary.length + " issues"
//             return controlListTitle;
//         default:
//             return;

//     }
// }
// export function getTableTitle(type = "", data) {
//     const state = store.getState();
//     const isAdminPage = state.doActionsReducer.isAdminPage
//     const productFamily = state.doActionsReducer.productFamily
//     const categoryType = state.doActionsReducer.categoryType
//     const control = state.doActionsReducer.control
//     const rule = state.doActionsReducer.rule
//     const headerInfo = { isAdminPage, productFamily, categoryType, control, rule }
//     return getTableTitleString({ type, data, state: headerInfo })
// }

export function getAggridHeader(header = []) {
    var agHeader = [];
    header.forEach(h => {
        if (h.header) {
            if (!h.subHeaders) {
                const title = getcamelCasetoTitle(h.header)
                agHeader.push({
                    headerName: title, field: h.header, sortable: false,
                    filter: "agSetColumnFilter",
                    filterParams: {}
                })
            };
            if (h.subHeaders && Array.isArray(h.subHeaders)) {
                const headerTitle = getcamelCasetoTitle(h.header)
                var children = h.subHeaders.map(sbH => {
                    const headerName = getcamelCasetoTitle(sbH)
                    return {
                        headerName, field: sbH, resizable: true, sortable: false,
                        filter: "agSetColumnFilter",
                        filterParams: {}
                    }
                });
                agHeader.push({ headerName: headerTitle, children: children })
            }
        }
        else if (Array.isArray(h)) {
            var subHeader = getAggridHeader(h)
            agHeader.push(...subHeader)
        }
    })
    return agHeader
}

function isJson(str) {
    if (str == null || str === undefined) return false
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}

export function getRowsData(rowData) {
    let finalRows = [];
    rowData.forEach(data => {
        const row = getSingleRow(data);
        finalRows = [...finalRows, ...row]
    })

    return finalRows
}
function getSingleRow(rowData) {
    var finalRows = [];
    const columns = Object.keys(rowData);
    let nonReapeatingCols = {};
    let repeatingCols = [];
    columns.forEach(field => {
        const cellValue = rowData[field];
        const typeofCell = typeof cellValue;
        const isJsonString = typeofCell == "number" ? false : isJson(cellValue);
        if ((typeofCell === 'string' || typeofCell === "number") && !isJsonString) {
            nonReapeatingCols = {
                ...nonReapeatingCols, [field]: cellValue
            }
        }
    });
    columns.forEach(field => {
        const cellValue = rowData[field];
        const isJsonString = isJson(cellValue);
        const typeofCell = typeof cellValue;
        if (typeofCell === 'string' && isJsonString) {
            const parsed = JSON.parse(cellValue)
            const rws = nestedRow(parsed);
            repeatingCols = [...repeatingCols, ...rws]

        }
    });
    repeatingCols.forEach(rw => {
        finalRows.push({ ...rw, ...nonReapeatingCols });
    })
    return finalRows;
}
export function nestedRow(nestedObj) {
    var rws = [];
    var commonFieldsOfRow = {}
    Object.keys(nestedObj).forEach(ky => {
        const val = nestedObj[ky];
        if (!Array.isArray(val)) {
            commonFieldsOfRow = {
                ...commonFieldsOfRow, [ky]: val
            }
        }
    });
    Object.keys(nestedObj).forEach(ky => {
        const val = nestedObj[ky];
        if (Array.isArray(val)) {
            val.forEach(grow => {
                rws.push({
                    ...commonFieldsOfRow, ...grow
                })

            })
        }
    });
    return rws;
}

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
                mainHeaders.subHeaders.push(sK);
            });
            headers.push(mainHeaders);
        } else {
            mainHeaders = getHeader(cellValue);
            headers.push(...mainHeaders);
        }
    });
    return headers;
}


// export function getTableColumnDef(type, isAdminPage) {
//     switch (type) {
//         case TABLE_HEADER_TYPE.CONTROL_TABLE:
//             const colDef = isAdminPage ? admincontrolTableDef : portalcontrolTableDef
//             return colDef
//         case TABLE_HEADER_TYPE.RULE_TABLE:
//             return isAdminPage ? [...ruleColDef, ...adminActionColumn] : [...ruleColDef, portalActionColumn];
//         default:
//             return ""
//     }
// }
function getcamelCasetoTitle(text = "") {
    return text.replace(/([a-z])([A-Z][a-z])/g, "$1 $2").charAt(0).toUpperCase() + text.slice(1).replace(/([a-z])([A-Z][a-z])/g, "$1 $2");

}

const ruleColDef = [
    { headerName: "Rule Id", field: "ruleId", width: 100 },
    { headerName: "Rule Name", field: "ruleName", width: 295 },
    { headerName: "Rule Description", field: "ruleDesc", width: 290 },
    { headerName: "Rule Definition", field: "ruleDef", width: 260 },
]
const adminActionColumn = [
    {
        headerName: "Status", field: "activeFlag", width: 78
    },
    {
        headerName: "Action", field: "Edit", cellRenderer: "editButton", cellStyle: { height: "35px" }, width: 85, sortable: false
    }
];
const portalActionColumn = {
    headerName: "View", field: "ruleId", cellRenderer: "viewButton", cellStyle: { height: "35px" }, width: 67
};
function getExeceptionRowsSingleRecord(data) {
    const repeatingRows = {};
    const rowsFromObject = [];
    let hasNestedObject = false
    Object.keys(data).forEach(key => {
        const cellValue = data[key];
        const cellType = typeof data[key];
        if (cellType === "number" || cellType === "string" || cellValue == "null") {
            repeatingRows[key] = cellValue;
        }
    });
    Object.keys(data).forEach(key => {
        const cellValue = data[key];
        const cellType = typeof data[key];
        if ((cellType === "object" && cellValue != null) || Array.isArray(cellValue)) {
            cellValue.forEach(inner => {
                hasNestedObject = true
                rowsFromObject.push({ ...repeatingRows, ...inner });
            });
        }
    });
    if (!hasNestedObject) {
        rowsFromObject.push(repeatingRows)
    }
    return rowsFromObject;
}
export function getExceptionRows(data = []) {
    let rowsData = []
    data.forEach(d => {
        const singleObjectRows = getExeceptionRowsSingleRecord(d)
        rowsData = [...rowsData, ...singleObjectRows]
    })
    return rowsData
}











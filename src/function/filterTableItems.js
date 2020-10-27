import { DEFAULT_ROWS_PAR_PAGE } from "../config/config";

/**
 * itemsをフィルターし、tableItemを返す
 * @param {object} items 全アイテム
 * @return {object} テーブルに表示するアイテム 
 */
function filterTableItems(items, now_page) {
    let tableItems = items.filter(col => {
        return ((now_page - 1) * DEFAULT_ROWS_PAR_PAGE + 1 <= col["#"] && col["#"] <= (now_page) * DEFAULT_ROWS_PAR_PAGE)
    })
    return tableItems
}

export default filterTableItems;
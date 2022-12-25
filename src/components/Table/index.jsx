import { Table } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ResizableTitle from "../ResizableTitle";
import ReactDragListView from "react-drag-listview";
import EditOutlined from "@ant-design/icons/EditOutlined";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import { cloneDeep, set } from "lodash";

const MResizableTitle = React.memo(ResizableTitle);

const TableComponent = ({
  columns: cols,
  withHeader,
  dataSource,
  expandable,
  ...props
}) => {
  const [columns, setColumns] = useState(cols);
  const [isExpanded, setIsExpanded] = useState(
    !isUndefined(expandable) &&
      (!isUndefined(expandable?.defaultExpandAllRows) ||
        (!isUndefined(expandable?.defaultExpandedRowKeys) &&
          !isEmpty(expandable?.defaultExpandedRowKeys)) ||
        (!isUndefined(expandable?.expandedRowKeys) &&
          !isEmpty(expandable?.expandedRowKeys)))
  );
  const [dragProps, setDragProps] = useState({ onDragEnd: (fi, ti) => {} });

  const onDragEnd = useCallback(
    (fromIndex, toIndex) => {
      const data = cloneDeep(columns);
      let indexRest = 0;
      if (!isUndefined(expandable)) indexRest = indexRest + 1;
      if (!isUndefined(props.rowSelection)) indexRest = indexRest + 1;

      const item = data.splice(fromIndex - indexRest, 1)[0];
      data.splice(toIndex - indexRest, 0, item);

      setColumns(data);
    },
    [columns, expandable, props.rowSelection]
  );

  useEffect(() => {
    if (!isExpanded) {
      setDragProps({
        onDragEnd,
        nodeSelector: "th",
        handleSelector: ".table-sort-order",
      });
    } else {
      setDragProps({ onDragEnd: (fi, ti) => {} });
    }
  }, [isExpanded, columns, onDragEnd]);

  const handleResize = useCallback(
    (path) =>
      (_, { size }) => {
        const newColumns = [...columns];
        set(newColumns, [...path, "width"], size.width);
        setColumns(newColumns);
      },
    [columns]
  );

  const setTitle = useCallback(
    (columnsArray, path) => {
      if (isEmpty(columnsArray)) return [];
      return columnsArray.map((col, index) => ({
        ...col,
        title: <span className="table-not-sort-order">{col.title}</span>,
        children: setTitle(col.children, [...path, `${index}`, "children"]),
        onHeaderCell: (column) => ({
          width: column.width,
          onResize: handleResize([...path, `${index}`]),
        }),
      }));
    },
    [handleResize]
  );

  const mergeColumns = useMemo(() => {
    return columns.map((col, index) => ({
      ...col,
      title: isExpanded ? (
        <span className="table-not-sort-order">{col.title}</span>
      ) : (
        <span className="table-sort-order">{col.title}</span>
      ),
      children: setTitle(col.children, [`${index}`, "children"]),
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize([`${index}`]),
      }),
    }));
  }, [columns, handleResize, isExpanded, setTitle]);

  return (
    <>
      {withHeader && (
        <div className="react-header-editable">
          <EditOutlined />
        </div>
      )}
      <ReactDragListView {...dragProps}>
        <Table
          bordered
          {...props}
          components={{
            header: {
              cell: MResizableTitle,
            },
          }}
          columns={mergeColumns}
          dataSource={dataSource}
          expandable={{
            ...expandable,
            onExpandedRowsChange: (expandedRows) => {
              setIsExpanded(expandedRows.length >= 1);
            },
          }}
        />
      </ReactDragListView>
    </>
  );
};

export default TableComponent;

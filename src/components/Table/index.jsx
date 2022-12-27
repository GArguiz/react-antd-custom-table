import { Table } from "antd";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ResizableTitle from "./ResizableTitle";
import ReactDragListView from "react-drag-listview";
import EditOutlined from "@ant-design/icons/EditOutlined";
import SaveOutlined from "@ant-design/icons/SaveOutlined";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import set from "lodash/set";
import map from "lodash/map";
import forEach from "lodash/forEach";
import compact from "lodash/compact";
import cloneDeep from "lodash/cloneDeep";
import includes from "lodash/includes";
import VisibleColumnModal from "./VisibleColumnModal";

import "./table.css";

const MResizableTitle = React.memo(ResizableTitle);

const TableComponent = ({
  columns: cols,
  withHeader,
  dataSource,
  onSavePreferences,
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

  const [showModal, setShowModal] = useState(false);

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
    return filterColumns(
      map(columns, (col, index) => ({
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
      }))
    );
  }, [columns, handleResize, isExpanded, setTitle]);

  const onDragEnd = useCallback(
    (fromIndex, toIndex) => {
      const data = cloneDeep(mergeColumns);
      let indexRest = 0;
      if (!isUndefined(expandable)) indexRest = indexRest + 1;
      if (!isUndefined(props.rowSelection)) indexRest = indexRest + 1;

      const item = data.splice(fromIndex - indexRest, 1)[0];
      data.splice(toIndex - indexRest, 0, item);

      setColumns(data);
    },
    [expandable, props.rowSelection, mergeColumns]
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

  const handleModalOk = (targetKeys, transferData) => {
    const newColumns = cloneDeep(columns);
    forEach(transferData, ({ key }) => {
      if (includes(targetKeys, key)) {
        set(newColumns, key + ".isHidden", true);
      } else {
        set(newColumns, key + ".isHidden", false);
      }
    });
    setColumns(newColumns);
    setShowModal(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      {withHeader && (
        <div className="react-header-editable">
          <SaveOutlined onClick={() => onSavePreferences(mergeColumns)} />
          <EditOutlined onClick={() => setShowModal(!showModal)} />
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
      <VisibleColumnModal
        isModalOpen={showModal}
        columns={columns}
        handleOK={handleModalOk}
        handleCancel={handleModalCancel}
      />
    </>
  );
};

const filterColumns = (columns) => {
  return compact(
    map(columns, ({ isHidden, children, ...rest }) => {
      if (isHidden) {
        return null;
      } else {
        return {
          ...rest,
          children: filterColumns(children),
        };
      }
    })
  );
};

TableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array,
  withHeader: PropTypes.bool,
  expandable: PropTypes.object,
};
export default TableComponent;

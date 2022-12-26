import PropTypes from "prop-types";
import React, { useState } from "react";

import { Transfer, Modal } from "antd";

import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";

export default function VisibleColumnModal({
  columns,
  isModalOpen,
  handleOK,
  handleCancel,
}) {
  const [targetKeys, setTargetKeys] = useState(getTargetKeys(columns));
  const [transferDataSource, settransferDataSource] = useState(
    flatten(columns)
  );
  const [selectedKeys, setSelectedKeys] = useState([]);
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };
  return (
    <Modal
      title="Hide Columns"
      open={isModalOpen}
      onOk={() => handleOK(targetKeys)}
      onCancel={handleCancel}
    >
      <Transfer
        style={{ width: "100%" }}
        dataSource={transferDataSource}
        titles={["Show", "Hidden"]}
        targetKeys={targetKeys}
        onSelectChange={onSelectChange}
        onChange={onChange}
        selectedKeys={selectedKeys}
        showSelectAll={false}
        className="tree-transfer"
        render={(item) => item.title}
      />
    </Modal>
  );
}

const flatten = (list = [], parentTitle = "", path = []) => {
  let transferDataSource = [];
  list.forEach(({ children, title, ...rest }, index) => {
    if (!isUndefined(children) && !isEmpty(children)) {
      const childrenDataSource = flatten(
        children,
        parentTitle + "/" + title,
        path + `[${index}].children`
      );
      transferDataSource = [...transferDataSource, ...childrenDataSource];
    } else {
      transferDataSource.push({
        ...rest,
        title: parentTitle + "/" + title,
        key: path + `[${index}]`,
      });
    }
  });
  return transferDataSource;
};

const getTargetKeys = (columns) => {
  return filter(columns, (col) => col.isHidden);
};

VisibleColumnModal.propTypes = {
  columns: PropTypes.array,
  isModalOpen: PropTypes.bool.isRequired,
  handleOK: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

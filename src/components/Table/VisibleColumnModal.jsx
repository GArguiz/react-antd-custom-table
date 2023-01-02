import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { Transfer, Modal } from "antd";
import { flatten, getTargetKeys } from "./util";

export default function VisibleColumnModal({
  columns,
  isModalOpen,
  handleOK,
  handleCancel,
}) {
  const [targetKeys, setTargetKeys] = useState(getTargetKeys(columns));
  const [transferDataSource, setTransferDataSource] = useState(
    flatten(columns)
  );
  const [selectedKeys, setSelectedKeys] = useState([]);
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  useEffect(() => {
    setTransferDataSource(flatten(columns));
  }, [columns]);

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };
  return (
    <Modal
      title="Hide Columns"
      open={isModalOpen}
      onOk={() => handleOK(targetKeys, transferDataSource)}
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

VisibleColumnModal.propTypes = {
  columns: PropTypes.array,
  isModalOpen: PropTypes.bool.isRequired,
  handleOK: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

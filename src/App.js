import { Content } from "antd/es/layout/layout";
import "./App.css";
import Table from "./components/Table";
import { Badge, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React, { useMemo, useState } from "react";
const items = [
  {
    key: "1",
    label: "Action 1",
  },
  {
    key: "2",
    label: "Action 2",
  },
];

const MTable = React.memo(Table);
function App() {
  const expandedRowRender = useMemo(() => {
    const columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Status",
        key: "state",
        render: () => <Badge status="success" text="Finished" />,
      },
      {
        title: "Upgrade Status",
        dataIndex: "upgradeNum",
        key: "upgradeNum",
      },
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        render: () => (
          <Space size="middle">
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown
              menu={{
                items,
              }}
            >
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ];
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        date: "2014-12-24 23:12:00",
        name: "This is production name",
        upgradeNum: "Upgraded: 56",
      });
    }
    return <MTable columns={columns} dataSource={data} pagination={false} />;
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
      fixed: "left",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "John",
          value: "John",
        },
      ],
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: "Other",
      children: [
        {
          title: "Age",
          dataIndex: "age",
          key: "age",
          width: 150,
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: "Address",
          children: [
            {
              title: "Street",
              dataIndex: "street",
              key: "street",
              width: 150,
            },
            {
              title: "Block",
              children: [
                {
                  title: "Building",
                  dataIndex: "building",
                  key: "building",
                  width: 100,
                },
                {
                  title: "Door No.",
                  dataIndex: "number",
                  key: "number",
                  width: 100,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Company",
      children: [
        {
          title: "Company Address",
          dataIndex: "companyAddress",
          key: "companyAddress",
          width: 200,
        },
        {
          title: "Company Name",
          dataIndex: "companyName",
          key: "companyName",
          width: 100,
        },
      ],
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 80,
      fixed: "right",
    },
  ];
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: "John Brown",
      age: i + 1,
      street: "Lake Park",
      building: "C",
      number: 2035,
      companyAddress: "Lake Street 42",
      companyName: "SoftLake Co",
      gender: "M",
    });
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const onSavePreferences = (changedColumns) => {
    console.log("changedColumns", changedColumns);
  };

  return (
    <Content style={{ padding: "10px 50px" }}>
      <MTable
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        withHeader
        dataSource={data}
        onSavePreferences={onSavePreferences}
        expandable={{
          expandedRowRender: () => expandedRowRender,
          // defaultExpandedRowKeys: ["0"],
        }}
      />
      ;
    </Content>
  );
}

export default App;

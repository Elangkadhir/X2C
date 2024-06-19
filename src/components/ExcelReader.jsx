import { Table, Checkbox, Button, Input, Modal, Form } from "antd";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";

const ExcelReader = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const [filterModal, setFilterModal] = useState(false);
  const showFilterModal = () => {
    setFilterModal(true);
  };

  const filterOk = () => {
    setFilterModal(false);
  };
  const filterCancel = () => {
    setFilterModal(false);
  };

  const handleName = (e) => {
    setCustomerName(e.target.value);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/card", { state: { selectedRows, customerName } });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
      setShowTable(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleSelect = (record) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(record)) {
        return prevSelectedRows.filter((row) => row !== record);
      } else {
        return [...prevSelectedRows, record];
      }
    });
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const columns = [
    {
      title: "Select",
      dataIndex: "index",
      render: (_, record) => (
        <Checkbox
          checked={selectedRows.includes(record)}
          onChange={() => handleSelect(record)}
        />
      ),
    },
    ...(data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          dataIndex: key,
          key: key,
        }))
      : []),
  ];

  const [form] = useForm();

  const handleFilter = (values) => {
    const { areaName } = values;
    const filtered = data.filter((item) =>
      item.areaName.toLowerCase().includes(areaName.toLowerCase())
    );
    setData(filtered);
    filterOk();
  };

  return (
    <div className="w-full h-screen p-5">
      <Modal
        title="Enter Customer Name"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input onChange={handleName} />
      </Modal>

      <Modal
        title="Filter Modal"
        open={filterModal}
        onOk={filterOk}
        onCancel={filterCancel}
        footer={[]}
      >
        <Form
          form={form}
          onFinish={handleFilter}
          name="basic"
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Area Name"
            name="areaName"
            rules={[
              {
                required: true,
                message: "Please input the area name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex justify-between items-center p-5">
        <div>
          {/* <img src={Andavar} alt="" className="w-20 h-20 rounded-md" /> */}
        </div>
        <div className=" text-blue-700 font-bold text-5xl">
          X<span className="text-red-600">2</span>C
        </div>
      </div>
      <div className="flex justify-between items-center p-5">
        <div>
          <Button onClick={showFilterModal}>Filter</Button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {!showTable && (
          <div className="flex justify-center items-center p-10">
            <button
              onClick={triggerFileInput}
              className="px-4 py-2 bg-white w-56 h-56 rounded-full text-black shadow-md hover:bg-blue-200  bg-gradient-to-r from-red-400 to-blue-500 p-5"
            >
              Click to Upload File
            </button>
            <input
              id="fileInput"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
      {showTable && (
        <div>
          <div>
            <Table
              className="w-full"
              columns={columns}
              dataSource={data}
              rowKey="name"
              pagination={{
                pageSize: 5,
              }}
              scroll={{ x: "max-content" }}
            />
          </div>
          <div className=" flex justify-end pb-5">
            <Button type="primary" onClick={showModal}>
              Create
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelReader;

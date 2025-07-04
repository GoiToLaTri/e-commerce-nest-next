"use client";

import { IInventory } from "@/models";
import {
  TableProps,
  Table,
  Image,
  Button,
  Tag,
  Input,
  TablePaginationConfig,
} from "antd";
import Link from "next/link";
import React, { useState } from "react";
import "@/styles/table.style.css";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { useInventories } from "@/hooks/useInventories";
import { FilterValue } from "antd/es/table/interface";
import { DropdownMenu } from "../menu/dropdown-menu";
import { EllipsisOutlined } from "@ant-design/icons";
import { SearchProps } from "antd/es/input";
const { Search } = Input;

export function InventoryTable() {
  const [params, setParams] = useState({
    page: 1,
    limit: 4,
    sortField: "quantity",
    sortOrder: "desc",
    filters: {},
  });

  const { data, isLoading } = useInventories({ ...params });
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sorter: any
  ) => {
    const sortOrder =
      sorter.order === "ascend"
        ? "asc"
        : sorter.order === "descend"
        ? "desc"
        : undefined;

    setParams((prev) => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || 8,
      sortField: (sorter.field as string) || "",
      sortOrder: sortOrder || "",
      filters: filters,
    }));
  };

  const columns: TableProps<IInventory>["columns"] = [
    {
      title: "#",
      key: "index",
      render: (_text, _record, index) => index + 1,
      // render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, record) => (
        <Image src={record.product.thumbnail} alt="thumbnail" width={64} />
      ),
    },
    {
      title: "Model",
      dataIndex: "product.model",
      key: "model",
      render: (_, _record) => _record.product.model,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: true,
    },
    {
      title: "Imported",
      dataIndex: "total_imported",
      key: "total_imported",
    },
    {
      title: "Exported",
      dataIndex: "total_exported",
      key: "total_exported",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (value) => convertNumberToCurrency(value),
      sorter: true,
    },
    {
      title: "Pricing",
      dataIndex: "product_price",
      key: "product_price",
      render: (_, record) => convertNumberToCurrency(record.product.price),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, _record) => (
        <>
          {(() => {
            let color: string;
            let content: string;
            if (_record.quantity === 0) {
              color = "error";
              content = "Out of stock";
            } else if (
              _record.quantity > 0 &&
              _record.quantity <= _record.min_alert_quantity
            ) {
              color = "warning";
              content = "Low stock";
            } else {
              color = "success";
              content = "In stock";
            }
            return <Tag color={color}>{content.toUpperCase()}</Tag>;
          })()}
        </>
      ),
      // filters: [
      //   { text: "In stock", value: "In stock" },
      //   { text: "Low stock", value: "Low stock" },
      //   { text: "Out of stock", value: "Out of stock" },
      // ],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const dropdownItems = [
          {
            key: "import",
            link: `/admin/inventory/${record.id}/import`,
            label: "Import",
          },
          {
            key: "export",
            link: `/admin/inventory/${record.id}/export`,
            label: "Export",
          },
          {
            key: "adjustment",
            link: `/admin/inventory/${record.id}/adjustment`,
            label: "Adjustment",
          },
        ];
        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Link href={`/admin/inventory/${record.id}`}>
              <Button
                type="text"
                className="!bg-[#924dff] leading-[1.6] !p-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300 "
              >
                Detail
              </Button>
            </Link>
            <DropdownMenu
              menu={{
                items: dropdownItems.map((item) => ({
                  key: item.key,
                  label: <Link href={`${item.link}`}>{item.label}</Link>,
                })),
              }}
            >
              <Button
                shape="circle"
                type="text"
                className={`!bg-transparent !border-0 !text-[1rem] flex items-end gap-[0.5rem] hover:!border-0 hover:!bg-[rgba(255,255,255,.04)]`}
              >
                <EllipsisOutlined style={{ fontSize: 24, fontWeight: 600 }} />
              </Button>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const onSearch: SearchProps["onSearch"] = (value) =>
    setParams((prev) => ({ ...prev, search: value }));

  return (
    <div>
      <div className="flex justify-center mb-4">
        <Search
          placeholder="Enter your text"
          allowClear
          onSearch={onSearch}
          style={{ width: 400 }}
          size="large"
        />
      </div>
      <Table<IInventory>
        rowKey="id"
        columns={columns}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: data?.total || 0,
          showSizeChanger: true,
        }}
        loading={isLoading}
        onChange={handleTableChange}
        dataSource={data?.data}
      />
    </div>
  );
}

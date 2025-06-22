import { IInventory } from "@/models";
import { TableProps, Table, Image, Button, Tag } from "antd";
import Link from "next/link";
import React from "react";
import "@/styles/table.style.css";
import { convertNumberToCurrency } from "@/utils/currency.util";

export interface InventoryTableProps {
  data: IInventory[];
}

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
            content = "Sold out";
          } else if (
            _record.quantity > 0 &&
            _record.quantity <= _record.min_alert_quantity
          ) {
            color = "warning";
            content = "Sold out";
          } else {
            color = "success";
            content = "Available";
          }
          return <Tag color={color}>{content.toUpperCase()}</Tag>;
        })()}
      </>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8 }}>
        <Link href={`/admin/inventory/${record.id}`}>
          <Button
            type="primary"
            className="!bg-[#924dff] leading-[1.6] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
          >
            Detail
          </Button>
        </Link>
        <Link href={`/admin/inventory/${record.id}/import`}>
          <Button
            type="primary"
            className="!bg-[#924dff] leading-[1.6] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
          >
            Import
          </Button>
        </Link>
        <Link href={`/admin/inventory/${record.id}/import`}>
          <Button
            type="primary"
            className="!bg-[#924dff] leading-[1.6] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
          >
            Export
          </Button>
        </Link>
        <Link href={`/admin/inventory/${record.id}/ajustment`}>
          <Button
            type="primary"
            className="!bg-[#924dff] leading-[1.6] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
          >
            Ajustment
          </Button>
        </Link>
      </div>
    ),
  },
];

export function InventoryTable({ data }: InventoryTableProps) {
  console.log(data);
  return <Table<IInventory> rowKey="id" columns={columns} dataSource={data} />;
}

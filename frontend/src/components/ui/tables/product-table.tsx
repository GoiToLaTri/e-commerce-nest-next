import { IProduct } from "@/models";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { formatDate } from "@/utils/date.util";
import { TableProps, Table, Image, Button, Switch } from "antd";
import Link from "next/link";
import React from "react";
import "@/styles/table.style.css";

export interface ProductTableProps {
  data: IProduct[];
}

const columns: TableProps<IProduct>["columns"] = [
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
    render: (url) => <Image src={url} alt="thumbnail" width={64} />,
  },
  {
    title: "Model",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "Brand",
    dataIndex: "LaptopBrand",
    key: "laptopbrand",
    render: (_, record) => record.LaptopBrand.name ?? "N/A",
  },
  {
    title: "Created at",
    dataIndex: "created_at",
    key: "created_at",
    render: (date) => formatDate(date),
  },
  {
    title: "Updated at",
    dataIndex: "updated_at",
    key: "updated_at",
    render: (date) => formatDate(date),
  },
  {
    title: "Sale status",
    dataIndex: "sale_status",
    key: "sale_status",
    render: (_, record) => <Switch />,
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8 }}>
        <Link href={`/product/laptop/${record.id}`}>
          <Button type="primary">View</Button>
        </Link>
        <Link href={`/product/${record.id}/edit`}>
          <Button>Sale</Button>
        </Link>
      </div>
    ),
  },
];

export function ProductTable({ data }: ProductTableProps) {
  return <Table<IProduct> rowKey="id" columns={columns} dataSource={data} />;
}

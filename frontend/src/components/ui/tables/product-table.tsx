"use client";

import { IProduct } from "@/models";
import { formatDate } from "@/utils/date.util";
import {
  TableProps,
  Table,
  Image,
  Button,
  Switch,
  TablePaginationConfig,
} from "antd";
import Link from "next/link";
import React, { useState } from "react";
import "@/styles/table.style.css";
import { useProducts } from "@/hooks/useProducts";
import { SearchProps } from "antd/es/input";
import { FilterValue } from "antd/es/table/interface";
import { useBrands } from "@/hooks/useBrands";
import { SearchInput } from "../input/search-input";

export function ProductTable() {
  const [params, setParams] = useState({
    page: 1,
    limit: 4,
    sortField: "created_at",
    sortOrder: "asc",
    filters: {},
  });
  const { data, isLoading } = useProducts({ ...params });
  const { data: brands } = useBrands();

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
      filters: brands?.map((brand: { name: string }) => ({
        text: brand.name,
        value: brand.name,
      })),
      render: (_, record) => record.LaptopBrand.name ?? "N/A",
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      render: (date) => formatDate(date),
    },
    {
      title: "Updated at",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: true,
      render: (date) => formatDate(date),
    },
    {
      title: "Sale status",
      dataIndex: "sale_status",
      key: "sale_status",
      filters: [
        { text: "Active", value: "true" },
        { text: "Disable", value: "false" },
      ],
      render: (_, record) => <Switch defaultValue={record.status} />,
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

  const onSearch: SearchProps["onSearch"] = (value) =>
    setParams((prev) => ({ ...prev, search: value }));

  // console.log(data);
  return (
    <div>
      <div className="flex justify-center mb-4">
        <SearchInput
          placeholder="Enter your text"
          onSearch={onSearch}
          style={{ width: 400 }}
          name="product-search"
        />
      </div>
      <Table<IProduct>
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
        showSorterTooltip={{ target: "sorter-icon" }}
        dataSource={data?.data}
      />
    </div>
  );
}

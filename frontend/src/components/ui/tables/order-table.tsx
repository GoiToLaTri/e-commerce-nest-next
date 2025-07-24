"use client";

import { IOrder } from "@/models";
import { formatDate } from "@/utils/date.util";
import { TableProps, Table, TablePaginationConfig, Tag } from "antd";
import { useState } from "react";
import "@/styles/table.style.css";
import { SearchProps } from "antd/es/input";
import { FilterValue } from "antd/es/table/interface";
import { useOrders } from "@/hooks/useOrders";
import OrderDetailModal from "@/components/modals/order-detail-modal";
import UpdateOrderStatusModal from "@/components/modals/update-orders-status-modal";
import { SearchInput } from "../input/search-input";

export function OrderTable() {
  const [params, setParams] = useState({
    page: 1,
    limit: 6,
    sortField: "createdAt",
    sortOrder: "asc",
    filters: {},
  });
  const { data, isLoading } = useOrders({ ...params });

  const columns: TableProps<IOrder>["columns"] = [
    {
      title: "#",
      key: "index",
      render: (_text, _record, index) => index + 1,
      // render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Client",
      dataIndex: "shippingInfo",
      key: "shipping-info-fullname",
      render: (_, record) => record.shippingInfo.fullName,
    },
    {
      title: "Phone",
      dataIndex: "shippingInfo",
      key: "shipping-info-phone",
      render: (_, record) => record.shippingInfo.phone,
    },
    {
      title: "Payment status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      filters: [
        { text: "SUCCESS", value: "SUCCESS" },
        { text: "FAILED", value: "FAILED" },
        { text: "PENDING", value: "PENDING" },
        { text: "REFUNDED", value: "REFUNDED" },
      ],
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          SUCCESS: "green",
          FAILED: "red",
          PENDING: "orange",
          REFUNDED: "blue",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Order status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      filters: [
        { text: "PENDING", value: "PENDING" },
        { text: "PROCESSING", value: "PROCESSING" },
        { text: "COMPLETED", value: "COMPLETED" },
        { text: "CANCELLED", value: "CANCELLED" },
      ],
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          PENDING: "orange",
          PROCESSING: "gold",
          COMPLETED: "green",
          CANCELLED: "red",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (date) => formatDate(date),
    },
    {
      title: "Updated at",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <OrderDetailModal id={record.id} />
          <UpdateOrderStatusModal id={record.id} />
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
          name="order-search"
        />
      </div>
      <Table<IOrder>
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

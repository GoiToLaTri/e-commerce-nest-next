"use client";

import { useInventory } from "@/hooks/useInventory";
import { useProductInventoryLog } from "@/hooks/useProductInventoryLog";
import { IInventoryLogData } from "@/models";
import { formatDate } from "@/utils/date.util";
import { Table, TablePaginationConfig, TableProps, Tag } from "antd";
import { FilterValue } from "antd/es/table/interface";
import { useState } from "react";

export interface InventoryLogTableProps {
  id: string;
}

const columns: TableProps<IInventoryLogData>["columns"] = [
  {
    title: "#",
    key: "index",
    render: (_text, _record, index) => index + 1,
    // render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "Date",
    dataIndex: "created_at",
    key: "creaeted_at",
    showSorterTooltip: { target: "full-header" },
    sortDirections: ["descend"],
    sorter: true,
    render: (value) => formatDate(value),
  },
  {
    title: "Change type",
    dataIndex: "change_type",
    key: "change_type",
    render: (_, _record) => (
      <>
        {(() => {
          let color: string;
          let content: string;
          if (_record.change_type === "import") {
            color = "processing";
            content = "Import";
          } else if (_record.change_type === "export") {
            color = "success";
            content = "export";
          } else {
            color = "warning";
            content = "adjustment";
          }
          return <Tag color={color}>{content.toUpperCase()}</Tag>;
        })()}
      </>
    ),
    filters: [
      { text: "Import", value: "import" },
      { text: "Export", value: "export" },
      { text: "Adjustment", value: "adjustment" },
    ],
  },
  {
    title: "Quantity",
    dataIndex: "quantity_change",
    key: "quantity_change",
    sorter: true,
    render: (_, record) => {
      if (record.change_type === "import")
        return `+${Math.abs(record.quantity_change)}`;
      if (record.change_type === "export")
        return `-${Math.abs(record.quantity_change)}`;
      if (record.change_type === "adjustment")
        return `${record.quantity_change > 0 ? "+" : "-"}${Math.abs(
          record.quantity_change
        )}`;
    },
  },
  {
    title: "Reference",
    dataIndex: "reference",
    key: "reference",
  },
  {
    title: "Created by",
    dataIndex: "created_by",
    key: "created_by",
  },
];

export default function InventoryLogTable({ id }: InventoryLogTableProps) {
  const [params, setParams] = useState({
    page: 1,
    limit: 8,
    sortField: "created_at",
    sortOrder: "asc",
    filters: {},
  });
  const { data: inventory } = useInventory(id);
  const productId = inventory?.product.id;
  const { data, isLoading } = useProductInventoryLog({
    id: productId || "",
    page: params.page,
    limit: params.limit,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    filters: params.filters,
  });

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
    setParams({
      page: pagination.current || 1,
      limit: pagination.pageSize || 8,
      sortField: (sorter.field as string) || "",
      sortOrder: sortOrder || "",
      filters: filters,
    });
  };

  //   console.log(data);
  //   console.log(data?.data);
  return (
    <Table<IInventoryLogData>
      rowKey="id"
      columns={columns}
      dataSource={data?.data}
      pagination={{
        current: params.page,
        pageSize: params.limit,
        total: data?.total || 0,
        showSizeChanger: true,
      }}
      loading={isLoading}
      onChange={handleTableChange}
      showSorterTooltip={{ target: "sorter-icon" }}
    />
  );
}

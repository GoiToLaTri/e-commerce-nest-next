"use client";

import { useGetTopSpendingUser } from "@/hooks/useGetTopSpendingUser";
import { TopSpendingUser } from "@/models";
import { Image, Spin, Table, TableProps } from "antd";
import "@/styles/top-spending-user-table.style.css";

export default function TopSpendingUserTable() {
  const { data, isLoading, isFetching } = useGetTopSpendingUser();
  const loading = Boolean(isFetching || isLoading);
  // console.log(data);

  const columns: TableProps<TopSpendingUser>["columns"] = [
    {
      title: "#",
      key: "index",
      render: (_text, _record, index) => index + 1,
      // render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Avatar",
      dataIndex: "user.avatar",
      key: "user.avatar",
      render: (_, record) => (
        <Image
          src={record.user.avatar}
          alt="Avatar"
          width={40}
          className="!rounded-full !bg-white"
          preview={false}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "user.name",
      key: "user.name",
      render: (_, record) => record.user.name,
    },
    {
      title: "Email",
      dataIndex: "user.email",
      key: "user.email",
      render: (_, record) => record.user.email,
    },
    {
      title: "Spend",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (value: number) => {
        if (value >= 1_000_000_000) {
          return (value / 1_000_000_000).toFixed(1) + "B";
        } else if (value >= 1_000_000) {
          return (value / 1_000_000).toFixed(1) + "M";
        } else if (value >= 1_000) {
          return (value / 1_000).toFixed(1) + "K";
        } else {
          return value.toString();
        }
      },
    },
  ];

  return (
    <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 shadow-lg w-[860px] h-[400px]">
      <div className="flex justify-between mb-4">
        <div>
          <h4 className="font-semibold">Top spending client</h4>
        </div>
      </div>
      <div>{loading && <Spin />}</div>
      {!loading && (!data || data.length === 0) && <div>No content</div>}
      {!loading && data && (
        <div className="bg-[#241932] p-2 rounded-xl">
          <Table<TopSpendingUser>
            rowKey="id"
            columns={columns}
            loading={loading}
            showSorterTooltip={{ target: "sorter-icon" }}
            pagination={false}
            dataSource={data}
            className="top-spending-user-table"
          />
        </div>
      )}
    </div>
  );
}

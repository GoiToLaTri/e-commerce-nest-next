import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  ProductOutlined,
} from "@ant-design/icons";

const icon_size = 24;

export const adminSideBarItem = [
  {
    label: "Dashboard",
    icon: <AppstoreOutlined style={{ fontSize: icon_size }} />,
    href: "/admin/dashboard",
  },
  {
    label: "Product",
    icon: <ProductOutlined style={{ fontSize: icon_size }} />,
    href: "/admin/product/manage",
  },
  {
    label: "Add Product",
    icon: <AppstoreAddOutlined style={{ fontSize: icon_size }} />,
    href: "/admin/product/add",
  },
];

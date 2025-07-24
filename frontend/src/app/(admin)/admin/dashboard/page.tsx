import {
  DashboardBottom,
  DashboardMiddle,
  DashboardTop,
} from "@/components/layout/header";

export default function Dashboard() {
  return (
    <div>
      <div className="mb-5">
        <DashboardTop />
      </div>
      <div className="mb-5">
        <DashboardMiddle />
      </div>
      <div className="mb-[8rem]">
        <DashboardBottom />
      </div>
    </div>
  );
}

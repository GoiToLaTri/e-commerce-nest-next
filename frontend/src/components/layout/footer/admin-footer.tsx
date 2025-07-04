import Link from "next/link";
import {
  FacebookFilled,
  GithubFilled,
  InstagramOutlined,
  LinkedinFilled,
  XOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { Tooltip } from "antd";

export function AdminFooter() {
  return (
    <footer className="bg-[#0f081a] text-[#7a7990] relative">
      <div className="w-full h-px px-10 absolute inset-0">
        <div
          className="z-[1] w-full max-w-[80rem] h-px mx-auto absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(66,18,126,0), rgba(66,18,126,0) 0, #4F2288 50%, rgba(66,18,126,0))",
          }}
        />
      </div>
      <div className="py-[4rem] px-0 w-full">
        <div className="px-[2.5rem]">
          <div className="w-full max-w-[80rem] mx-auto">
            <div className="flex items-center justify-between gap-[2rem]">
              <div className="flex items-center gap-[.5rem] text-[.875rem] opacity-[.8] text-[#7a7990]">
                <span>
                  © {new Date().getFullYear()} Zwind. All rights reserved.
                </span>
              </div>
              <div
                className="flex items-center justify-end gap-4 opacity-[.8]"
                style={{ gridColumnGap: "1rem" }}
              >
                <Link
                  href="https://www.facebook.com/zwind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7a7990] hover:text-[#fff] mx-4"
                >
                  <Tooltip title="Facebook" placement="top" arrow={false}>
                    <FacebookFilled style={{ fontSize: "20px" }} />
                  </Tooltip>
                </Link>
                <Link
                  href="https://www.twitter.com/zwind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7a7990] hover:text-[#fff] mx-4"
                >
                  <Tooltip title="Twitter" placement="top" arrow={false}>
                    <XOutlined style={{ fontSize: "20px" }} />
                  </Tooltip>
                </Link>
                <Link
                  href="https://www.instagram.com/zwind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7a7990] hover:text-[#fff] mx-4"
                >
                  <Tooltip title="Instagram" placement="top" arrow={false}>
                    <InstagramOutlined style={{ fontSize: "20px" }} />
                  </Tooltip>
                </Link>
                <Link
                  href="https://www.linkedin.com/company/zwind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7a7990] hover:text-[#fff] mx-4"
                >
                  <Tooltip title="LinkedIn" placement="top" arrow={false}>
                    <LinkedinFilled style={{ fontSize: "20px" }} />
                  </Tooltip>
                </Link>
                <Link
                  href="https://github.com/zwind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7a7990] hover:text-[#fff] mx-4"
                >
                  <Tooltip title="GitHub" placement="top" arrow={false}>
                    <GithubFilled style={{ fontSize: "20px" }} />
                  </Tooltip>
                </Link>
                <Link
                  href="https://www.youtube.com/zwind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7a7990] hover:text-[#fff] mx-4"
                >
                  <Tooltip title="YouTube" placement="top" arrow={false}>
                    <YoutubeFilled style={{ fontSize: "20px" }} />
                  </Tooltip>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

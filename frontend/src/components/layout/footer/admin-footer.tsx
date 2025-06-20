import { ZwindLogo } from "@/components/ui";
import Link from "next/link";
import FooterLinks from "./footer-links";
import {
  FacebookFilled,
  GithubFilled,
  InstagramOutlined,
  LinkedinFilled,
  XOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { Tooltip } from "antd";

const importantLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

const servicesLinks = [
  { label: "Consulting", href: "/service/consulting" },
  { label: "Support", href: "/service/support" },
  { label: "Training", href: "/service/training" },
];

const productsLinks = [
  { label: "Laptops", href: "/products/laptops" },
  { label: "Accessories", href: "/products/accessories" },
  { label: "Software", href: "/products/software" },
];

const solutionLinks = [
  { label: "Enterprise Solutions", href: "/solutions/enterprise" },
  { label: "Education Solutions", href: "/solutions/education" },
  { label: "Government Solutions", href: "/solutions/government" },
];

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
            {/* <div
              className="grid gap-12 mb-8"
              style={{ gridTemplateColumns: "1.5fr repeat(4, 1fr)" }}
            >
              <div className="flex">
                <div>
                  <Link href="/" className="text-[#fff]">
                    <ZwindLogo />
                  </Link>
                  <div className="mt-[24px] leading-[24px]">
                    Optimized technology solutions and high-quality laptops for
                    individuals, businesses, and organizations. We offer genuine
                    products along with fast, efficient consulting and
                    implementation services.
                  </div>
                </div>
              </div>
              <FooterLinks title="Important Links" links={importantLinks} />
              <FooterLinks title="Services" links={servicesLinks} />
              <FooterLinks title="Products" links={productsLinks} />
              <FooterLinks title="Solution" links={solutionLinks} />
            </div>
            <div
              className="h-[1px] w-full mx-auto mb-[2rem]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(234, 236, 240, 0), rgba(234, 236, 240, .12) 50%, rgba(234, 236, 240, 0))",
              }}
            /> */}
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

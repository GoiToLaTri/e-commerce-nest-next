import Link from "next/link";

export interface FooterLinksProps {
  title?: string;
  links: { label: string; href: string }[];
}

export default function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div className="p-0 list-none">
      {title && (
        <h3 className="text-[14px] font-medium mb-[16px] text-[#fff]">
          {title}
        </h3>
      )}
      <ul>
        {links.map((link) => (
          <li className="mb-[12px]" key={link.href}>
            <Link href={link.href} className="text-[#7a7990] hover:text-[#fff]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

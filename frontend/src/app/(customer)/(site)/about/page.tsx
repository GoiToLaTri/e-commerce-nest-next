import { envConfig } from "@/common/configs";
import { ZwindLogoXXL } from "@/components/ui/logo/zwind-logo-xxl";
import { Image } from "antd";

export default function About() {
  const FRONTEND_URL = envConfig.FRONTEND_URL;

  return (
    <div className="mb-[8rem]">
      {/* Background Image */}
      <div className="absolute top-0 left-0 about-image">
        <Image
          src={`${FRONTEND_URL}/images/186262-3840x2160-desktop-4k-leaf-background-photo.jpg`}
          alt="about background"
          preview={false}
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 backdrop-blur-sm bg-black/40 min-h-screen flex items-center justify-center px-6 py-20 overlay-content-bg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold uppercase mb-6">
              About Us
            </h1>
            <p className="text-xl leading-8">
              At ZWIND, we are passionate about empowering individuals and
              businesses through cutting-edge technology. Founded with the
              mission to make quality laptops and smart IT solutions accessible
              to all, we combine innovation with reliability. Whether
              you&apos;re a student, professional, gamer, or an enterprise, our
              tailored products and services are designed to elevate your
              experience.
            </p>
          </div>

          {/* Logo */}
          <div className="hidden md:block">
            <ZwindLogoXXL />
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <section id="vision" className="bg-[#101010] text-white px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6">Our Vision</h2>
          <p className="text-xl leading-8">
            At ZWIND, our vision is to become a trusted and leading provider of
            innovative technology solutions, not just in products, but in the
            way we inspire and empower lives. We believe that technology is more
            than a tool — it&apos;s a bridge to knowledge, growth, and limitless
            potential. Our goal is to help individuals unlock new opportunities,
            support businesses in optimizing their operations, and contribute to
            a more connected, intelligent future. We strive to build a world
            where every person and organization, regardless of size or industry,
            can thrive through accessible, reliable, and forward-thinking
            technological solutions.
          </p>
        </div>
      </section>

      {/* Commitment Section */}
      <section id="commitment" className="bg-[#181818] text-white px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div>
            <Image
              src={`${FRONTEND_URL}/images/businesspeople-standing-city-street-shaking-hands_74855-1112.avif`}
              alt="commit"
              width={500}
              className="rounded-xl shadow-lg"
              preview={false}
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-4xl font-semibold mb-4">Our Commitment</h2>
            <div className="space-y-6 text-xl leading-8">
              <p>
                At ZWIND, our commitment is rooted in excellence, trust, and a
                desire to create long-term impact in everything we do.
              </p>
              <p>
                We are not just a retailer of laptops — we are a technology
                partner that stands behind every product and service we deliver.
                We are committed to offering only high-quality devices, tailored
                IT solutions, and unmatched customer service that solve
                real-world problems and help individuals and businesses thrive
                in a digital-first world.
              </p>
              <p>
                Every laptop we offer is thoughtfully selected and rigorously
                tested to meet modern needs — from productivity and portability
                to performance and durability. Every solution we build is
                designed with scalability, security, and efficiency in mind,
                ensuring our clients can grow with confidence.
              </p>
              <p>
                We believe in transparency, accountability, and the power of
                relationships. Our interactions with clients are built on active
                listening, clear communication, and a shared goal of success.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

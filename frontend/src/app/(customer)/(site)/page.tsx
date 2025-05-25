import { GlobalContainer } from "@/components/ui";
import { Button } from "antd";

export default function Home() {
  return (
    <div>
      <section className="pt-[6rem] pb-[8rem] relative flex flex-col items-center justify-center text-[rgb(201,204,216)] text-[1.25rem] font-normal leading-[1.6]">
        <GlobalContainer>
          <div className="zwind-content text-[rgb(201,204,216)] text-[1.25rem] font-normal leading-[1.6]">
            <h1 className="text-center max-w-[42rem] mx-auto text-[4rem] leading-[1.4] font-normal mb-6 tracking-wide">
              The #1 Laptops & Technology Solutions
            </h1>
            <p className="zwind-subtitle text-center max-w-[42rem] mx-auto text-[1.25rem] leading-[1.6] mb-8">
              The destination for genuine laptops, expert technical services,
              and an exceptional customer experience.
            </p>
          </div>
          <div className="zwind-buttons flex justify-center items-center gap-4 mt-[2.5rem]">
            <Button
              type="primary"
              size="large"
              className="!bg-[#924dff] !rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300 !py-"
            >
              Explore Laptops
            </Button>
            <Button
              type="default"
              size="large"
              className="!rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] !bg-transparent !border !border-[#924dff] !text-[#924dff] hover:!bg-[#f5f0ff] transition-colors duration-300"
            >
              Our Services
            </Button>
          </div>
        </GlobalContainer>
      </section>
      <section>
        <div className="mt-[36px] flex flex-col items-center">
          <h2 className="text-3xl font-semibold text-center mb-3 text-white">
            Why Choose Zwind?
          </h2>
          <p className="text-lg text-center mb-8 text-[rgb(201,204,216)] max-w-xl leading-[1.6]">
            We combine technology, expertise, and service to bring you the best
            experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 flex items-start gap-4 shadow-lg">
              <span className="text-3xl">✅</span>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-white">
                  Genuine Laptops
                </h3>
                <p className="text-[rgb(201,204,216)]">From trusted brands</p>
              </div>
            </div>
            <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 flex items-start gap-4 shadow-lg">
              <span className="text-3xl">🔧</span>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-white">
                  Expert Services
                </h3>
                <p className="text-[rgb(201,204,216)]">
                  Professional repair &amp; upgrade
                </p>
              </div>
            </div>
            <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 flex items-start gap-4 shadow-lg">
              <span className="text-3xl">🚚</span>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-white">
                  Fast Delivery
                </h3>
                <p className="text-[rgb(201,204,216)]">Nationwide support</p>
              </div>
            </div>
            <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 flex items-start gap-4 shadow-lg">
              <span className="text-3xl">🛡️</span>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-white">
                  Transparent Policies
                </h3>
                <p className="text-[rgb(201,204,216)]">
                  Clear pricing &amp; warranty
                </p>
              </div>
            </div>
            <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 flex items-start gap-4 shadow-lg sm:col-span-2 mb-[8rem]">
              <span className="text-3xl">💬</span>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-white">
                  Customer-First
                </h3>
                <p className="text-[rgb(201,204,216)]">Consultation and care</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-[8rem]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-6 text-white">
            Our Services
          </h2>
          <p className="text-lg text-center mb-10 text-[rgb(201,204,216)] max-w-2xl mx-auto leading-[1.6]">
            We offer a comprehensive suite of services to keep your devices
            running smoothly and efficiently.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-8 shadow-lg">
              <span className="text-4xl mb-4">🛠️</span>
              <h3 className="font-semibold text-xl mb-2 text-white">
                Laptop Repair
              </h3>
              <p className="text-[rgb(201,204,216)] text-center leading-[1.6]">
                Hardware and software troubleshooting, screen and battery
                replacement, and more.
              </p>
            </div>
            <div className="flex flex-col items-center bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-8 shadow-lg">
              <span className="text-4xl mb-4">⚡</span>
              <h3 className="font-semibold text-xl mb-2 text-white">
                Upgrades
              </h3>
              <p className="text-[rgb(201,204,216)] text-center leading-[1.6]">
                RAM, SSD, and component upgrades to boost your laptop’s
                performance.
              </p>
            </div>
            <div className="flex flex-col items-center bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-8 shadow-lg">
              <span className="text-4xl mb-4">🔒</span>
              <h3 className="font-semibold text-xl mb-2 text-white">
                Data Recovery
              </h3>
              <p className="text-[rgb(201,204,216)] text-center leading-[1.6]">
                Secure data backup and recovery solutions for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

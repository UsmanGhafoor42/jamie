import AnotherHeroSection from "@/components/shared/AnotherHeroSection";
import Image from "next/image";
import React from "react";

const gangSheetSizes = [
  { size: 'Small - 11.00" x 12.50"', price: "$8.35" },
  { size: 'Medium - 22.50" x 12.50"', price: "$12.50" },
  { size: 'Large - 22.50" x 25.00"', price: "$20.75" },
  { size: 'Extra Large - 22.50" x 60.00"', price: "$30.00" },
];

const individualSheetSizes = [
  { size: '2.00" x 2.50"', transfer: 20, price: "$8.50" },
  { size: '3.00" x 3.50"', transfer: 14, price: "$9.00" },
  { size: '4.00" x 5.00"', transfer: 10, price: "$10.00" },
  { size: '5.00" x 6.00"', transfer: 8, price: "$9.00" },
  { size: '7.00" x 8.5"', transfer: 3, price: "$9.30" },
  { size: '9.00" x 10.50"', transfer: 1, price: "$3.80" },
  { size: '11.00" x 12.50"', transfer: 1, price: "$4.00" },
];

interface GangSheetPlan {
  title: string;
  imageUrl: string;
  description: string;
  table: React.ReactNode;
}

const plans: GangSheetPlan[] = [
  {
    title: "Gang Sheets",
    imageUrl: "/images/pricing-card-img.png",
    description:
      "Multiple designs and copies can be ganged to print together on each sheet.",
    table: (
      <table className="w-full text-left mt-6 leading-10">
        <thead>
          <tr>
            <th className="font-semibold pb-2">Sizes</th>
            <th className="font-semibold pb-2 text-right">Prices</th>
          </tr>
        </thead>
        <tbody>
          {gangSheetSizes.map((row, i) => (
            <tr key={i}>
              <td className="py-1">• {row.size}</td>
              <td className="py-1 text-right">{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    title: "Individual Sheets",
    imageUrl: "/images/pricing-card-img.png",
    description:
      "One design per sheet. Print size is listed below. Cut size will be about 1/4 inch larger than print size.",
    table: (
      <table className="w-full text-left mt-6 leading-10">
        <thead>
          <tr>
            <th className="font-semibold pb-2">Sizes</th>
            <th className="font-semibold pb-2 text-center">Transfer</th>
            <th className="font-semibold pb-2 text-right">Prices</th>
          </tr>
        </thead>
        <tbody>
          {individualSheetSizes.map((row, i) => (
            <tr key={i}>
              <td className="py-1">• {row.size}</td>
              <td className="py-1 text-center">{row.transfer}</td>
              <td className="py-1 text-right">{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
];

const page = () => {
  return (
    <div>
      <AnotherHeroSection title="Pricing" />
      <PricingPlan plans={plans} />
      <div className="py-20 bg-gray-200 text-black flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full px-4 flex flex-col items-center">
          <h2 className="text-2xl md:text-4xl text-center font-bold mb-4">
            Volume Discount
          </h2>
          <p className="text-lg text-gray-500 mb-4 text-center md:w-xl w-full">
            When the items you order total the amounts below, the discount
            percent will be applied.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
            <div className="rounded-2xl p-8 shadow-xl flex flex-col md:flex-row items-center border border-[var(--green)] bg-white relative md:w-[780px] w-full">
              <div className="md:w-1/2 w-full flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-1 text-center">
                  Item Total
                </h3>
                <ul className="leading-10">
                  <li>$100.00 - $249.99</li>
                  <li>$250.00 - $499.99</li>
                  <li>$500.00 - $749.99</li>
                  <li>$750.00 - $999.99</li>
                  <li>$1000.00 Plus</li>
                </ul>
              </div>
              <hr className="w-1/2 rotate-90 hidden md:block" />
              <div className="md:w-1/2 w-full flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-1 text-center">
                  %Discount
                </h3>
                <ul className="leading-10">
                  <li>5.00%</li>
                  <li>7.50%</li>
                  <li>10.00%</li>
                  <li>12.50%</li>
                  <li>15.00%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-20 layout text-black flex flex-col justify-center md:gap-10 gap-4 items-center">
        {/* <div className="max-w-3xl w-full px-4 flex flex-col items-center"> */}
        <h2 className="text-2xl md:text-4xl text-center font-bold mb-4">
          Shipping Cost?
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-[500px] border border-[var(--green)] p-8 rounded-lg flex flex-col gap-8">
            <h3 className="text-2xl font-bold">
              Standard flat rate shipping is $12.50
            </h3>
            <p>
              The standard shipping is UPS ground service for 1 or 2 day
              delivery within the northeast US. Outside of the northeast,
              standard shipping is via FedEx 2nd day.
            </p>
          </div>
          <div className="w-full md:w-[500px] border border-[var(--green)] p-8 rounded-lg flex flex-col gap-8">
            <h3 className="text-2xl font-bold">
              Next Day flat rate shipping is $30.00
            </h3>
            <p>
              Next Day shipping is available anywhere in the US via FedEx Next
              Day Service. Tracking info will be emailed to you when transfers
              are shipped.
            </p>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

const PricingPlan = ({ plans }: { plans: GangSheetPlan[] }) => {
  return (
    <div className="py-20 text-black flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full px-4">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-8 shadow-xl flex flex-col items-center border border-[var(--green)] bg-white relative min-w-[280px]"
            style={{ boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)" }}
          >
            {/* Green Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md">
              <Image
                src="/images/pricing-card-img.png"
                alt="icon"
                width={100}
                height={100}
              />
            </div>
            <div className="pt-10 w-full flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-1 text-center">
                {plan.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 text-center max-w-xs">
                {plan.description}
              </p>
              {plan.table}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;

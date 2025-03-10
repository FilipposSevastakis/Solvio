import React from "react";
import { Chart } from "react-google-charts";

const options = {
  vAxis: { title: "Counts" },
  hAxis: { title: "Date", direction: 1 },
  seriesType: "bars",
  series: { 24: { type: "line" } },
  bar: { groupWidth: "100%" },
  colors: Array(24).fill("gray").concat(["brown"]),
  legend: { position: "none" },
  backgroundColor: "#faf6de",
};

const SubmissionChart2 = ({ data }) => {
  return (
    <div className="w-full p-6 bg-orange-100 rounded-lg shadow-lg mt-9">
      <h1 className="text-left text-base sm:text-base font-semibold text-gray-800 mb-4">
        Daily submissions
      </h1>
      <div className="rounded-lg overflow-hidden">
        <Chart
          chartType="ComboChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      </div>
    </div>
  );
};

export default SubmissionChart2;

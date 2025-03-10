import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const Histogram = ({ data }) => {

  let minExecTime = Number.MAX_VALUE;
  let maxExecTime = Number.MIN_VALUE;
  let sumExecTime = 0;

  for (let i = 1; i < data.length; i++) {
    const execTime = data[i];
    sumExecTime += execTime;
    if (execTime < minExecTime) {
      minExecTime = execTime;
    }
    if (execTime > maxExecTime) {
      maxExecTime = execTime;
    }
  }
  const avgExecTime = sumExecTime / (data.length - 1);

  return (
    <div className="w-full p-6 bg-orange-100 rounded-lg shadow-lg mt-9 mb-7">
      <h1 className="text-left text-base sm:text-base font-semibold mb-4 text-gray-800">
        Execution Time Histogram
      </h1>
      {/* <div className="flex w-full justify-center items-start gap-5 mb-7">
        <h1 className="text-center text-xl sm:text-xl font-semibold text-gray-800">
          Min. execution time: <span className="value">{minExecTime}</span>
        </h1>
        <h1 className="text-center text-xl sm:text-xl font-semibold text-gray-800">
          Max. execution time: <span className="value">{maxExecTime}</span>
        </h1>
        <h1 className="text-center text-xl sm:text-xl font-semibold text-gray-800">
          Avg. execution time: <span className="value">{avgExecTime}</span>
        </h1>
      </div> */}
      <div className="rounded-lg overflow-hidden">
        <Chart chartType="Histogram" width="100%" height="400px" data={data} options={{
          legend: { position: "none" },
          hAxis: { title: "Execution Time" },
          histogram: { bucketSize: 3 },
          colors: ['darkred'],
          backgroundColor: "#faf6de",
        }} />
      </div>
    </div>

  );
};

export default Histogram;
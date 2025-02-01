import React from 'react';

const Card1 = ({ title, val1, val2 }) => {
  return (
    <div className="w-1/3 p-6 bg-orange-100 rounded-lg shadow-lg">
      <h1 className="text-left text-base sm:text-base font-semibold text-gray-800">
        {title}
      </h1>
      <div className="flex justify-left items-baseline gap-2">
        <h2 className="text-center text-3xl font-bold text-gray-900">{val1}</h2>
        <p className="text-center text-sm text-gray-600">+{val2} today</p>
      </div>
    </div>
  );
};

const Card2 = ({ title, val1 }) => {
  return (
    <div className="w-1/3 p-6 bg-orange-100 rounded-lg shadow-lg">
      <h1 className="text-left text-base sm:text-base font-semibold text-gray-800">
        {title}
      </h1>
      <div className="flex justify-left items-baseline">
        <h2 className="text-center text-3xl font-bold text-gray-900">{val1}</h2>
      </div>
    </div>
  );
};

const SummaryCards = ({ val1, val2, val3, val4 }) => {
  return (
    <div className="flex w-full justify-center items-start gap-5">
      <Card1 title="Total problems solved" val1={val1} val2={val2}/>
      <Card2 title="Average solution time" val1={val3}/>
      <Card2 title="Current queue length" val1={val4}/>
    </div>
  );
};

export default SummaryCards;
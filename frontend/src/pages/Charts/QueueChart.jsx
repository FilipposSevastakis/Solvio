import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const QueueChart = ({ data }) => {
    return (
      <div className="w-full p-6 bg-orange-100 rounded-lg shadow-lg mt-9">
      <h1 className="text-left text-base sm:text-base font-semibold text-gray-800">
        Hourly Queue Length
      </h1>
        
      <BarChart width={900} height={400} data={data} margin={{ top: 30, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default  QueueChart;
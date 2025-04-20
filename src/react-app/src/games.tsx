import React from "react";
import { aaa_platforms } from "./gen/aaa_platforms";
import { yearly_categories } from "./gen/yearly_categories";
import Table from "./table";

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AAAPlatforms: React.FC = () => {
  return <Table data={[...aaa_platforms]} />;
};

export const GameCountsByYear: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...yearly_categories]}>
        <Line dataKey="indie_games" stroke="#8884d8" yAxisId="all"/>
        <Line dataKey="aaa_games" stroke="red" yAxisId="all"/>
        <Line dataKey="all_games" stroke="green" yAxisId="all"/>
        <XAxis dataKey="year" />
        <YAxis yAxisId="all" scale="log" domain={[1, 100000]} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const AAAByYear: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...yearly_categories]}>
        <Line dataKey="aaa_games" stroke="red" yAxisId="aaa"/>
        <XAxis dataKey="year" />
        <YAxis yAxisId="aaa" scale="linear" domain={[0, 250]} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}

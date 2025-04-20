import React from "react";
import { aaa_platforms } from "./gen/aaa_platforms";
import { yearly_categories } from "./gen/yearly_categories";
import { open_world_absolute } from "./gen/open_world_absolute";
import { fractions } from "./gen/fractions";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ThemeProvider } from "@emotion/react";

const theme = createTheme({
  palette: {
    DataGrid: {
      bg: 'transparent',
      pinnedBg: 'transparent',
      headerBg: 'transparent',
    },
  },
});

export const AAAPlatforms: React.FC = () => {
  const aaa_platforms_columns: GridColDef[] = [
    {
      field: "name",
      type: "string",
      headerName: "Name",
      align: 'left',
      width: 150,
    },
    {
      field: "generation",
      type: "string",
      headerName: "Generation",
      headerAlign: 'right',
      align: 'right',
      width: 100,
    },
    {
      field: "category",
      type: "string",
      headerName: "Category",
      headerAlign: 'right',
      align: 'right',
      width: 160,
    },
    {
      field: "slug",
      type: "string",
      headerName: "IGDB Slug",
      headerAlign: 'right',
      align: 'right',
      width: 150,
    },
    {
      field: "id",
      type: "string",
      headerName: "IGDB ID",
      headerAlign: 'right',
      align: 'right',
    }

  ];
  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
      <DataGrid
        className="transparentGrid"
        rows={[...aaa_platforms]}
        columns={aaa_platforms_columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 100]}
        sx={{
          border: 0,
          backgroundColor: 'transparent',
         }}
      />
      </ThemeProvider>
    </React.StrictMode>
  );
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

export const OpenWorldAbsolute: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...open_world_absolute]}>
        <Line dataKey="indie_open_world_games" stroke="#8884d8" yAxisId="linear_counts"/>
        <Line dataKey="aaa_open_world_games" stroke="red" yAxisId="linear_counts"/>
        <XAxis dataKey="year" />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 175]} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const OpenWorldFraction: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...fractions]}>
        <Line dataKey="indie_open_world_fraction" stroke="#8884d8" yAxisId="linear_counts"/>
        <Line dataKey="aaa_open_world_fraction" stroke="red" yAxisId="linear_counts"/>
        <XAxis dataKey="year" />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 1.0]} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
}

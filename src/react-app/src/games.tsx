import React from "react";
import { aaa_platforms } from "./gen/aaa_platforms";
import { yearly_categories } from "./gen/yearly_categories";
import { absolutes } from "./gen/absolutes";
import { fractions } from "./gen/fractions";

import { Label, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ThemeProvider } from "@emotion/react";

const colors = {
  indie: '#8884d8',
  aaa: 'red',
  population: 'orange',
}

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
        <Line dataKey="indie_games" stroke={colors.indie} yAxisId="all"/>
        <Line dataKey="aaa_games" stroke={colors.aaa} yAxisId="all"/>
        <Line dataKey="all_games" stroke={colors.population} yAxisId="all"/>
        <XAxis dataKey="year" />
        <YAxis yAxisId="all" scale="log" domain={[1, 100000]} >
          <Label value="Games (Log Count)" angle={-90} position={"insideLeft"}/>
        </YAxis>
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const AAAByYear: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...yearly_categories]}>
        <Line dataKey="aaa_games" stroke={colors.aaa} yAxisId="aaa"/>
        <XAxis dataKey="year" />
        <YAxis yAxisId="aaa" scale="linear" domain={[0, 250]} >
          <Label value="Games (Count)" angle={-90} position={"insideLeft"}/>
        </YAxis>
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const OpenWorldAbsolute: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...absolutes]}>
        <Line dataKey="indie_open_world_games" stroke={colors.indie} yAxisId="linear_counts"/>
        <Line dataKey="aaa_open_world_games" stroke={colors.aaa} yAxisId="linear_counts"/>
        <XAxis dataKey="year" />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 175]} >
          <Label value="Games (Count)" angle={-90} position={"insideLeft"}/>
        </YAxis>
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const OpenWorldFraction: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...fractions]}>
        <Line dataKey="indie_open_world_fraction" stroke={colors.indie} yAxisId="linear_counts"/>
        <Line dataKey="aaa_open_world_fraction" stroke={colors.aaa} yAxisId="linear_counts"/>
        <XAxis dataKey="year" />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 1.0]} >
          <Label value="Games (Fraction)" angle={-90} position={"insideLeft"}/>
        </YAxis>
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const LateStageFranchiseAbsolute: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...absolutes]}>
        <Line dataKey="indie_late_franchise_games" stroke={colors.indie} yAxisId="linear_counts"/>
        <Line dataKey="aaa_late_franchise_games" stroke={colors.aaa} yAxisId="linear_counts" />
        <XAxis dataKey="year"/>
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 175]} >
          <Label value="Games (Count)" angle={-90} position={"insideLeft"}/>
        </YAxis>
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const LateStageFranchiseFraction: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...fractions]}>
        <Line dataKey="indie_late_franchise_fraction" stroke={colors.indie} yAxisId="linear_counts"/>
        <Line dataKey="aaa_late_franchise_fraction" stroke={colors.aaa} yAxisId="linear_counts"/>
        <XAxis dataKey="year" />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 1.0]} >
          <Label value="Games (Fraction)" angle={-90} position={"insideLeft"}/>
        </YAxis>
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
}

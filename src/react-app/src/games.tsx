import React from "react";
import { aaa_platforms } from "./gen/aaa_platforms";
import { yearly_categories } from "./gen/yearly_categories";
import { absolutes } from "./gen/absolutes";
import { fractions } from "./gen/fractions";
import { ratings } from "./gen/ratings";

import { Dot, Label, Legend, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ThemeProvider } from "@emotion/react";

function invertColor(hex) {
  hex = hex.replace('#', '');
  const num = parseInt(hex, 16);
  const invertedNum = 0xFFFFFF ^ num;
  const invertedHex = invertedNum.toString(16).padStart(6, '0');
  return '#' + invertedHex;
}

const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const light_colors = {
  indie: '#062626',
  aaa: '#0000ff',
  population: 'orange',
  aaa_open_world: '#40b0b0',
  aaa_late_franchise: '#63878a',
  indie_open_world: '#d1b897',
  indie_late_franchise: '#80845e',
  text: 'black',
}

const dark_colors = {
  ...light_colors,
  aaa: '#8884d8',
  aaa_late_franchise: '#c1d1e3',
  indie: '#f9d9d9',
  indie_open_world: '#8cde94',
  indie_late_franchise: invertColor(light_colors.indie_late_franchise),
  text: "#f8f8f8",
}

const colors = isDarkMode ? dark_colors : light_colors;

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
        <XAxis dataKey="year" stroke={colors.text} />
        <YAxis yAxisId="all" scale="log" domain={[1, 100000]} stroke={colors.text} >
          <Label value="Games (Log Count)" angle={-90} position={"insideLeft"} fill={colors.text} />
        </YAxis>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const AAAByYear: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...yearly_categories]}>
        <Line dataKey="aaa_games" stroke={colors.aaa} yAxisId="aaa"/>
        <XAxis dataKey="year" stroke={colors.text} />
        <YAxis yAxisId="aaa" scale="linear" domain={[0, 250]} stroke={colors.text} >
          <Label value="Games (Count)" angle={-90} position={"insideLeft"} fill={colors.text} />
        </YAxis>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const OpenWorldAbsolute: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...absolutes]}>
        <Line dataKey="indie_open_world_games" stroke={colors.indie_open_world} yAxisId="linear_counts"/>
        <Line dataKey="aaa_open_world_games" stroke={colors.aaa_open_world} yAxisId="linear_counts"/>
        <XAxis dataKey="year" stroke={colors.text} />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 175]} stroke={colors.text} >
          <Label value="Games (Count)" angle={-90} position={"insideLeft"} fill={colors.text} />
        </YAxis>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const OpenWorldFraction: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...fractions]}>
        <Line dataKey="indie_open_world_fraction" stroke={colors.indie_open_world} yAxisId="linear_counts"/>
        <Line dataKey="aaa_open_world_fraction" stroke={colors.aaa_open_world} yAxisId="linear_counts"/>
        <XAxis dataKey="year" stroke={colors.text} />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 1.0]} stroke={colors.text} >
          <Label value="Games (Fraction)" angle={-90} position={"insideLeft"} fill={colors.text} />
        </YAxis>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const LateStageFranchiseAbsolute: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...absolutes]}>
        <Line dataKey="indie_late_franchise_games" stroke={colors.indie_late_franchise} yAxisId="linear_counts"/>
        <Line dataKey="aaa_late_franchise_games" stroke={colors.aaa_late_franchise} yAxisId="linear_counts" />
        <XAxis dataKey="year" stroke={colors.text} />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 175]} stroke={colors.text} >
          <Label value="Games (Count)" angle={-90} position={"insideLeft"} fill={colors.text} />
        </YAxis>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const LateStageFranchiseFraction: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[...fractions]}>
        <Line dataKey="indie_late_franchise_fraction" stroke={colors.indie_late_franchise} yAxisId="linear_counts"/>
        <Line dataKey="aaa_late_franchise_fraction" stroke={colors.aaa_late_franchise} yAxisId="linear_counts"/>
        <XAxis dataKey="year" stroke={colors.text} />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 1.0]} stroke={colors.text} >
          <Label value="Games (Fraction)" angle={-90} position={"insideLeft"} fill={colors.text} />
        </YAxis>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const RatingsByYear: React.FC = () => {
  const cleanedRatings = ratings.map((row) => {
    const cleanedRow: any = { ...row };
    Object.keys(cleanedRow).forEach((key) => {
      if (cleanedRow[key] === "") {
        cleanedRow[key] = undefined; // or null
      }
    });
    return cleanedRow;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={cleanedRatings}>
        <Line dataKey="indie_ratings_p50" stroke={colors.indie} yAxisId="linear_counts" connectNulls />
        <Line dataKey="aaa_ratings_p50" stroke={colors.aaa} yAxisId="linear_counts" connectNulls />
        <Line dataKey="aaa_open_world_ratings_p50" stroke={colors.aaa_open_world} yAxisId="linear_counts" connectNulls />
        <Line dataKey="aaa_late_franchise_ratings_p50" stroke={colors.aaa_late_franchise} yAxisId="linear_counts" connectNulls />
        <XAxis dataKey="year" stroke={colors.text} />
        <YAxis yAxisId="linear_counts" scale="linear" domain={[0, 1.0]} stroke={colors.text} >
          <Label value="Rating (P50)" angle={-90} position={"insideLeft"} fill={colors.text} />
        </YAxis>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

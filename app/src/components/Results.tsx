import useStore from "../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { Box, BoxProps, Button, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import Scene from "./client/Scene";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ResultsProps extends BoxProps {
  showId: string;
  scene: any;
}

const colors = [
  "#FF5733", "#33FF57", "#3357FF", "#F39C12", "#8E44AD",
  "#16A085", "#C0392B", "#2980B9", "#D35400", "#2ECC71",
  "#9B59B6", "#E74C3C", "#1ABC9C", "#34495E", "#27AE60",
  "#F1C40F", "#7F8C8D", "#E67E22", "#2980B9", "#BDC3C7"
];

const Results: React.FC<ResultsProps> = ({
  showId,
  scene,
  ...props
}: ResultsProps) => {
  const shows = useStore((state) => state.shows);
  const responses = useStore((state) => state.responses);
  const filteredResponses = responses
    .filter((response) => response?.show?.id === showId)
    .filter((response) => response.scene?.id === scene.id);

  let data: any[] = [];

  if (scene.type === "bool") {
    data = [
      {
        name: "Page A",
        yes: filteredResponses.filter((response) => response.value === "1")
          .length,
        no: filteredResponses.filter((response) => response.value === "0")
          .length,
      },
    ];
  }

  if (scene.type === "choice") {
    const entry: { name: string; [key: string]: any } = {
      name: "Page A",
    };

    scene?.options?.forEach((option: any) => {
      const key: string = option?.options_id?.key;
      entry[key] = filteredResponses.filter((response) => response.value === key).length;
    });

    data = [entry];
  }

  return (
    <Box {...props}>
      <Typography variant="h6">
        responses: {filteredResponses.length}
      </Typography>
      {data && scene.type === "bool" && (
        <>
          <BarChart width={200} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="yes" fill="#8884d8" />
            <Bar dataKey="no" fill="#82ca9d" />
          </BarChart>
        </>
      )}
      {data && scene.type === "choice" && (
        <>
          <BarChart width={200} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {scene.options.map((option: any, index: number) => (
              <Bar
                key={option.options_id.key}
                dataKey={option.options_id.key}
                fill={colors[index]}
                name={option.options_id.value}
              />
            ))}
          </BarChart>
        </>
      )}
      {/* <pre>{JSON.stringify(filteredResponses, null, 4)}</pre> */}
    </Box>
  );
};

export default Results;

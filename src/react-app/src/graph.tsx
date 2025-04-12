import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  x: number;
  y: number;
}

interface Series {
  name: string;
  values: DataPoint[];
}

interface GraphProps {
  data: Series[];
  width?: number;
  height?: number;
}

const Graph: React.FC<GraphProps> = ({ data, width = 500, height = 300 }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous content

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const allPoints = data.flatMap(d => d.values);
    const xExtent = d3.extent(allPoints, d => d.x) as [number, number];
    const yExtent = d3.extent(allPoints, d => d.y) as [number, number];

    const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
    g.append("g").call(d3.axisLeft(yScale));

    // Line generator
    const line = d3
      .line<DataPoint>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "4px")
      .style("border-radius", "4px")
      .style("font-size", "12px");

    // Draw each series
    data.forEach((series, i) => {
      g.append("path")
        .datum(series.values)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      g.selectAll(`.dot-${i}`)
        .data(series.values)
        .enter()
        .append("circle")
        .attr("class", `dot-${i}`)
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 3)
        .attr("fill", "black")
        .on("mouseover", (event, d) => {
          tooltip
            .style("visibility", "visible")
            .text(`(${d.x}, ${d.y})`);
        })
        .on("mousemove", event => {
          tooltip
            .style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
    });
  }, [data, width, height]);

  return <svg ref={ref} width={width} height={height} />;
};

export default Graph;

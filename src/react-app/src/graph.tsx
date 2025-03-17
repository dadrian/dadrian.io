import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Graph: React.FC = () => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      svg.append("circle")
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 40)
        .attr("fill", "blue");
    }
  }, []);

  return <svg ref={ref} width={100} height={100} />;
};

export default Graph;

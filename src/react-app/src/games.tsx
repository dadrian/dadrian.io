import React from "react";
import { aaa_platforms } from "./gen/aaa_platforms";
import Table from "./table";

const AAAPlatforms: React.FC = () => {
  return <Table data={[...aaa_platforms]} />;
};

export default AAAPlatforms;

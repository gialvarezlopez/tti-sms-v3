import React from "react";

type Props = {
  templateSelected: number | undefined;
};
const NextStep = ({ templateSelected }: Props) => {
  return <div className="px-6">Last este {templateSelected}</div>;
};

export default NextStep;

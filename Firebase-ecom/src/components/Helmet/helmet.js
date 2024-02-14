import React from "react";

const helmet = (props) => {
  document.title = "GadgetCo -" + props.title;
  return <div className="w-100">{props.children}</div>;
};

export default helmet;

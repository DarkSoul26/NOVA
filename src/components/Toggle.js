import React, { useState } from "react";
import ReactSwitch from "react-switch";
import Iframe from "react-iframe";

function Toggle({ lookerstudio }) {
  const [checked, setChecked] = useState(true);

  const handleChange = (val) => {
    setChecked(val);
  };

  return (
    <div className="app" style={{ textAlign: "center", paddingBottom: "2%" }}>
      <ReactSwitch
        checked={checked}
        onChange={handleChange}
        // style={{ margin: "20%" }}
      />
      <br />
      {checked && <Iframe url={lookerstudio} width="50%" height="500px" />}
    </div>
  );
}

export default Toggle;

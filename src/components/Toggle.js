import React, { useState } from "react";
import ReactSwitch from "react-switch";
import Iframe from "react-iframe";

function Toggle() {
  const [checked, setChecked] = useState(true);

  const handleChange = (val) => {
    setChecked(val);
  };

  return (
    <div className="app" style={{ textAlign: "center", paddingBottom: "10%" }}>
      <ReactSwitch
        checked={checked}
        onChange={handleChange}
        // style={{ margin: "20%" }}
      />
      <br />
      {checked && (
        <Iframe
          url="https://lookerstudio.google.com/embed/reporting/5bf87f04-4a58-4198-bb7f-b7e85058e552/page/tEnnC"
          width="50%"
          height="600px"
        />
      )}
    </div>
  );
}

export default Toggle;

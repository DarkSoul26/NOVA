import React, { useState } from "react";
import axios from "axios";

function TextAreat(props) {
  const spokenData = props.spoken;

  const [paraphrase, setParaphrase] = useState("");

  function handleParaphrasing() {
    const options = {
      method: "POST",
      url: "https://text-summarizer1.p.rapidapi.com/summarize",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.API_KEY,
        "X-RapidAPI-Host": "text-summarizer1.p.rapidapi.com",
      },
      data: '{"text":{props.spoken},"language":"en","output_sentences":5}',
    };

    axios
      .request(options)
      .then(function (response) {
        setParaphrase(response.data.required?.[0]);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <div className="row">
      <div id="spokenData" className="col">
        <h2 style={{ margin: "2%" }}>Spoken Data</h2>
        <p>{spokenData}</p>
      </div>
      <div id="paraphrasedData" className="col">
        <button
          onClick={handleParaphrasing}
          style={{ margin: "2%" }}
          type="button"
          className="btn btn-info"
        >
          Paraphrase
        </button>
        <p>{paraphrase}</p>
        <p>
          Temporarily because of subscription we wont be able to see paraphrased
          result !
        </p>
        <p>Sorry for this!</p>
      </div>
    </div>
  );
}

export default TextAreat;

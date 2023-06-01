/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
// import ParticlesBackground from "./ParticlesBackground";
import Summariser from "./Summariser";
import Toggle from "./Toggle";
import "../App.css";

export class Chat extends Component {
  componentDidMount() {
    (function(d, m) {
      var kommunicateSettings = {
        // appId: "36d4f23f4b42c8b8a1c5561b950a7ac1a",
        appId: "16e3105f0a89c6c2c6bd3bf573e406564",
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
        voiceOutput: true,
        voiceName: "Google US English",
        voiceRate: 1,
      };
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
  }

  render() {
    return (
      <div>
        <h1 style={{ color: "white", fontSize: "50px" }}>NOVA</h1>
        <div style={{ marginTop: "7%" }}>
          <img src="nova.gif"></img>
        </div>
        <hr style={{ margin: "5%", marginLeft: "25%", marginRight: "25%" }} />
        <h2 style={{ color: "white", fontSize: "40px" }}>Article Summariser</h2>
        <Summariser />
        <hr style={{ margin: "5%", marginLeft: "25%", marginRight: "25%" }} />
        <h2 style={{ color: "white", fontSize: "40px" }}>
          Expense Data Visualisation
        </h2>
        <Toggle lookerstudio="https://lookerstudio.google.com/embed/reporting/5bf87f04-4a58-4198-bb7f-b7e85058e552/page/tEnnC" />
        <hr style={{ margin: "5%", marginLeft: "25%", marginRight: "25%" }} />
        <h2 style={{ color: "white", fontSize: "40px" }}>
          Class Schedule Data Visualisation
        </h2>
        <Toggle lookerstudio="https://lookerstudio.google.com/embed/reporting/a04d2cc9-c00f-47f0-b79d-fc11bbfa2f73/page/tEnnC" />
      </div>
    );
  }
}

export default Chat;

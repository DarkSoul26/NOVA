/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import ParticlesBackground from "./ParticlesBackground";

export class Chat extends Component {
  componentDidMount() {
    (function (d, m) {
      var kommunicateSettings = {
        appId: "36d4f23f4b42c8b8a1c5561b950a7ac1a",
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
        <ParticlesBackground />
        <h1 style={{ color: "white", fontSize: "40px" }}>NOVA</h1>
        <div style={{marginTop: "7%"}}>
          <img src="nova.gif"></img>
        </div>
      </div>
    );
  }
}

export default Chat;

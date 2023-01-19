import React, { Component } from "react";

export let longdo;
export let map;

export class LongdoMap extends Component {
  constructor(props) {
    super(props);
    this.mapCallback = this.mapCallback.bind(this);
  }

  mapCallback() {
    longdo = window.longdo;
    map = new window.longdo.Map({
      placeholder: document.getElementById(this.props.id),
      language: "en",
    });
  }

  componentDidMount() {
    const existingScript = document.getElementById("longdoMapScript");
    const callback = this.props.callback;

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://api.longdo.com/map/?key=${this.props.mapKey}`;
      script.id = "longdoMapScript";
      document.body.appendChild(script);

      script.onload = () => {
        this.mapCallback();
        if (callback) callback();
      };
    }

    if (existingScript) this.mapCallback();
    if (existingScript && callback) callback();
  }

  render() {
    return <div id={this.props.id} style={{ width: "100%", height: "100%" }}></div>;
  }
}

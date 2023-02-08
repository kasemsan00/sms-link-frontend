import convert from "xml-js";

export const ConvertToRTTEvent = async (xml) => {
  let xmldata = await convert.xml2json(xml, { compact: true, spaces: 4 });
  const rttEvent = await convertXMLtoJSONRTT(JSON.parse(xmldata).rtt);
  return rttEvent;
};

const convertXMLtoJSONRTT = (data) => {
  let rttEvent = {};
  let event;
  if (data._attributes.event === undefined) {
    event = "reset";
  } else {
    event = data._attributes.event;
  }
  rttEvent.event = event;

  if (event === "new") {
    rttEvent.actions = [
      {
        type: "insert",
        text: data.t._text,
      },
    ];
  }
  if (event === "edit") {
    const { p, n } = data.e._attributes;
    rttEvent.actions = [
      {
        pos: p,
        num: n,
      },
    ];
  }
  if (event === "reset") {
    let arrayActions = [];
    if (data.t !== undefined && data.t.length !== undefined) {
      Object.keys(data).forEach((key) => {
        if (key === "t") {
          // console.log("data.t", data.t, data.t.length);
          for (let index = 0; index < data.t.length; index++) {
            const keyName = Object.keys(data.t[index]).toString();
            const item = data.t[index];
            if (keyName === "_text") {
              let pos = 0;
              if (data.t[index + 1] !== undefined) {
                pos = data.t[index + 1]._attributes.p;
              } else {
                pos = undefined;
              }

              arrayActions.push({
                type: "insert",
                text: item._text,
                pos: pos,
              });
            }
            if (keyName === "_attributes") {
              // console.log('empty')
            }
            if (keyName === "_attributes,_text") {
              arrayActions.push({
                type: "insert",
                text: item._text,
                pos: item._attributes.p,
              });
            }
          }
        }
        if (key === "e") {
          arrayActions.push({
            type: "erase",
            pos: data.e._attributes.p,
            num: data.e._attributes.n,
          });
        }
      });
      rttEvent.actions = arrayActions;
    } else {
      rttEvent.event = "insert";
      if (data.t !== undefined && data.t._text !== undefined) {
        rttEvent.actions = [
          {
            type: "insert",
            text: data.t._text,
          },
        ];
      }
    }
  }
  return rttEvent;
};

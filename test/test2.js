const convert = require("xml-js");
const readline = require("readline");
const fs = require("fs");
const fileStream = fs.createReadStream("example-data.txt");
const rtt = require("realtime-text");

const processLineByLine = async () => {
    const data = [];
    const fileStream = fs.createReadStream("example-data.txt");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    for await (const line of rl) {
        data.push(line + "");
    }
    return data;
};
var display = new rtt.DisplayBuffer((resp) => {
    console.log(resp);
});

const main = async () => {
    const rtt_data = await processLineByLine();
    rtt_data.forEach((item) => {
        let rs = convert.xml2json(item, { compact: true, spaces: 4 });
        const rttEvent = convertXMLtoJSONRTT(JSON.parse(rs).rtt);
        display.process(rttEvent);
    });
};
main();

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
            rttEvent.actions = [
                {
                    type: "insert",
                    text: data.t._text,
                },
            ];
        }
        console.log(arrayActions);
    }
    return rttEvent;
};

// Update the display state based on an RTT event
// var rttEvent = {
//     event: "edit",
//     actions: [
//         { type: "insert", text: "Tea" },
//         { type: "wait", num: 32 },
//         { type: "erase", num: 1 },
//         { type: "wait", num: 28 },
//         { type: "insert", text: "st" },
//     ],
// };

// Once the message is "done"
// display.commit();

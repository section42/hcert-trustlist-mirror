let cbor = require("cbor")
let fs = require("fs")

function buildCertificatesFromTrustlist(data) {
    let d = cbor.decode(data);
    let certs = []
    console.log("got " + d.c.length + " certs")
    for (let i of d.c) {
        console.log(i.i.toString("hex"))
        certs.push( {
            kid: i.i.toString("base64"),
            rawData: i.c.toString('base64')
        })
    }

    //console.log(certs)
    fs.writeFileSync("../../trustlist_at.min.json", JSON.stringify({
        certificates: certs
    }))
    fs.writeFileSync("../../trustlist_at.json", JSON.stringify({
        certificates: certs
    },null, 2))
}

function downloadBinary(callback) {
    const http = require("https");

    const options = {
        "method": "GET",
        "hostname": "dgc-trust.qr.gv.at",
        "port": 443,
        "path": "/trustlist",
        "headers": {
            "x-app-version": "1.2",
            "x-app-type": "browser"
        }
    };

    const req = http.request(options, function (res) {
        let chunks = [];
        let str = "";
        //res.setEncoding('utf-8');

        res.on("data", function (chunk) {
            chunks.push(chunk);
            str+=chunk;
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            callback(body, str)
        });
        res.on('error', (err) => {
            // This prints the error message and stack trace to `stderr`.
            console.error(err.stack);
        });
    });

    /*
    var data="";
    var request = http.get(urlToPrint, function(response) {
    response.on("data",append=>data+=append).on("finish",()=>console.log(data));;
    });
    */

    req.end();
}

downloadBinary(function (resultContent, strRes) {
    buildCertificatesFromTrustlist(resultContent)
});

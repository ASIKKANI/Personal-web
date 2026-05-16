import fs from 'fs';

function getNestedNodes(json) {
    console.log("Checking all node scales:");
    json.nodes.forEach((node, i) => {
        if (node.scale) {
             console.log(`Node ${i} scale:`, node.scale);
        }
    });
}

const buffer = fs.readFileSync('./public/models/vinyls_1.glb');
const chunkLength = buffer.readUInt32LE(12);
const jsonStr = buffer.toString('utf-8', 20, 20 + chunkLength);
const json = JSON.parse(jsonStr);
getNestedNodes(json);

import fs from 'fs';

function getGLBDetails(filePath) {
    const buffer = fs.readFileSync(filePath);
    const magic = buffer.readUInt32LE(0);
    if (magic !== 0x46546C67) {
        throw new Error('Not a valid GLB file');
    }
    const chunkLength = buffer.readUInt32LE(12);
    const chunkType = buffer.readUInt32LE(16);
    if (chunkType !== 0x4E4F534A) {
        throw new Error('First chunk is not JSON');
    }
    
    const jsonStr = buffer.toString('utf-8', 20, 20 + chunkLength);
    const json = JSON.parse(jsonStr);

    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];

    json.accessors?.forEach(acc => {
        if (acc.type === 'VEC3' && acc.min && acc.max) {
            min[0] = Math.min(min[0], acc.min[0]);
            min[1] = Math.min(min[1], acc.min[1]);
            min[2] = Math.min(min[2], acc.min[2]);
            
            max[0] = Math.max(max[0], acc.max[0]);
            max[1] = Math.max(max[1], acc.max[1]);
            max[2] = Math.max(max[2], acc.max[2]);
        }
    });

    const size = [
        max[0] - min[0],
        max[1] - min[1],
        max[2] - min[2]
    ];

    console.log(`\n--- ${filePath} ---`);
    console.log(`Global Accessor Bounding Box (Raw Geometry, un-transformed):`);
    console.log(`Min: [${min.map(n => n.toFixed(3)).join(', ')}]`);
    console.log(`Max: [${max.map(n => n.toFixed(3)).join(', ')}]`);
    console.log(`Size: [${size.map(n => n.toFixed(3)).join(', ')}]`);
    
    // Check root nodes for scale
    if (json.nodes) {
        console.log(`\nNode transforms:`);
        json.scenes?.[json.scene || 0]?.nodes?.forEach(nodeIdx => {
            const node = json.nodes[nodeIdx];
            if (node.scale) console.log(`Root Node ${nodeIdx} Scale:`, node.scale);
            if (node.translation) console.log(`Root Node ${nodeIdx} Translation:`, node.translation);
        });
    }
}

getGLBDetails('./public/models/vinyl_record_player.glb');
getGLBDetails('./public/models/vinyls_1.glb');

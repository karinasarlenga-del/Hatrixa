const https = require('https');
const fs = require('fs');

const arch_ids = ['1486406146926-c627a92ad1ab', '1479839672679-a46483c0e7c8', '1511818966892-d7d671e67287', '1600585154340-be6161a56a0c', '1513694203232-719a280e022f', '1481018670221-fec84e314db0', '1523633589114-88e2259fbe3e', '1503694978374-8a2fa8305c48', '1506146332822-b5e0ab5b497c', '1518005020951-eccb12dc6040', '1493612216891-65cbf18dce85', '1461884488737-14e30ee1d62c', '1472396961693-142e6e269027', '1512917774080-9991f1c4c750', '1513364776144-60967f0fecfa', '1516089354086-538dce7bcff7', '1521035417937-2fb0c3d9a0cd', '1541019623-bc3f78db421d', '1497366216548-37526070297c', '1556761175-4b46a572b786', '1497215728101-856f4ea42174', '1581091226825-a6a2a5aee158', '1504328345606-18bbc8c9d7d1', '1486406146926-c627a92ad1ab'];
const corp_ids = ['1497366216548-37526070297c', '1556761175-4b46a572b786', '1497215728101-856f4ea42174', '1581091226825-a6a2a5aee158', '1504328345606-18bbc8c9d7d1', '1522071820081-009f0129c71c', '1454165804606-c3d57bc86b40', '1486312338219-ce68d2c6f44d', '1507679622140-6290aa38ec2a', '1517048676732-dce54cb9911e', '1522202176988-66273c2fd55f', '1556761175-5973e65eb396', '1556761175-10eb0607ce67', '1573164713619-24c711fe7878', '1542744173-8e7e53415bb0', '1520607162513-aa25e947ee4e', '1517245386807-bb43f82c33c4', '1511818966892-d7d671e67287', '1479839672679-a46483c0e7c8'];
const gast_ids = ['1414235077428-338989a2e8c0', '1555396273-367ea4eb4db5', '1504674900247-0877df9cc836', '1482049016688-2d3e1b311543', '1544025162-d76694265947', '1466637574686-9dc0c342f534', '1473093295043-cdd812d0e601', '1493770348161-369560ae357d', '1504754524776-8f4f37790ca0', '1512621776951-a57141f2eefd', '1513104890138-7c749659a591', '1476224203421-9ce8e0b52a42', '1555939594-58d7cb561ad1', '1478144596228-3e204c3298bd', '1481070555726-a28a1dae17c0', '1484723091592-0b81ea1994e0', '1490818387583-1baba5e638ce', '1495162048225-6b3b37b8a69e', '1414235077428-338989a2e8c0'];

function testId(id) {
    return new Promise((resolve) => {
        const req = https.request(`https://images.unsplash.com/photo-${id}?q=80&w=100&h=100`, {method: 'HEAD'}, (res) => {
            if (res.statusCode === 200 || res.statusCode === 302) {
                resolve(id);
            } else {
                resolve(null);
            }
        });
        req.on('error', () => resolve(null));
        req.end();
    });
}

async function get18(ids) {
    let valid = [];
    for (let id of ids) {
        let res = await testId(id);
        if (res) valid.push(res);
    }
    // if not enough, loop over the valid ones and add them again to reach 18
    while(valid.length < 18 && valid.length > 0) {
        valid.push(valid[valid.length % valid.length]); 
    }
    return valid.slice(0, 18);
}

async function main() {
    let a = await get18(arch_ids);
    let c = await get18(corp_ids);
    let g = await get18(gast_ids);
    fs.writeFileSync('valid_ids.json', JSON.stringify({arch: a, corp: c, gast: g}));
    console.log('Done validating. Arch:', a.length, 'Corp:', c.length, 'Gast:', g.length);
}
main();

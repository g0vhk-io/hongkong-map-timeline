#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const parse = require('csv-parse');
const path = require('path');
const async = require('async');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));

// default logger
const { log } = console;

/**
 * Termination process
 */
function end() {
  process.exit(1);
}


async function startSendDataToAPI(host, data) {
  let successCount = 0;

  async function createPlace(record) {
    // "link_id","district","estate","name","year_built","basements","storyes","units","lat","lng","address_1","address_2","address_3","address_4","address_5","address_6","address_7","address_8","address_9","address_10","address_11","address_12","address_13","address_14","org_name_1","org_name_2","org_name_3","org_name_4","org_name_5","org_name_6","org_name_7","org_name_8","org_name_9","org_name_10","org_type_1","org_type_2","org_type_3","org_type_4","org_type_5","org_type_6","org_type_7","org_type_8","org_type_9","org_type_10"
    const [providerId, district, estate, name, year_built, basements,
      storyes, units, lat, lng, address1, address2, address3, address4, address5, address6, address7, address8, address9, address10] = record;

    let buildingName = `${estate}${name}`;
    if (buildingName === '') {
      buildingName = address1;
    }

    if (!year_built) {
    }

    const res = await request.postAsync({
      url: `http://${path.join(host, '/place/')}`,
      json: {
        location: {
          lat,
          lng
        },
        name: {
          zh_hk: buildingName,
        },
        address: {
          zh_hk: `${address1}`
        },
        year_from: parseInt(year_built),
        provider: 'had',
        provider_id: providerId,
      }
    });
    console.log(res.body)
    if (res.body.success) {
      successCount += 1;
    }
    console.log(`${successCount}/${data.length}`);
  }

  async.eachOfLimit(data, 20, createPlace, (err) => {
    if (err) {
      log(err);
    }
    log(`Api finished. Success count: ${successCount}/${data.length}`);
    end();
  });
}

function importData(filePath, host, options) {
  log(`Start to import ${filePath} to ${host}`);
  const parser = parse({ delimiter: ',' }, async (err, data) => {
    await startSendDataToAPI(host, data);
  });

  fs.createReadStream(path.join(__dirname, filePath)).pipe(parser);
}


program
  .version('0.1.0');

/**
 * Simple mathematic calcuation
 */
program
  .command('import <csv_file_path> <host>')
  .description('import the data inside the csv file to api')
  .action(importData);

program.parse(process.argv);

// If no arguments we should output the help
if (!program.args.length) program.help();


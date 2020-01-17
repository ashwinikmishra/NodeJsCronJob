const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
const axios = require('axios');
const qs = require('querystring')
const fsExtra = require('fs-extra')
const winston = require('winston');


//const config = require('./config/api_config.json');

app = express();

// Logger configuration
const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: 'C:\\RMSDOC\\NodejsWinston\\winston.log'
        })
    ]
    // 'transports': [
    //     new winston.transports.Console()
    // ]
};
const logger = winston.createLogger(logConfiguration);


// schedule tasks to be run on the server   
cron.schedule('*/5 * * * * *', function() {    
    console.log("running a task "+ new Date());
    let configdata = fs.readFileSync('./config/api_config.json');
    let apiconfig = JSON.parse(configdata);
    //console.log(apiconfig)
    const apiPath = apiconfig.api.url+apiconfig.api.token;
    console.log(apiPath);
    const requestBody = {
        grant_type: 'password',
        username: 'integration_user',
        password: 'integration_user'
      }
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      
    axios.post(apiPath, qs.stringify(requestBody), config)
      .then(function (response) {
       // console.log(response.data.access_token);
        ///
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+response.data.access_token
            }
          }
        const requestAsset = {'Name':'TEST-ASSET-JAN2020','Type':{'SourceID':'Program'},'SubType':{'SourceID':'Episode'},'ShortName':'TEST-ASSET-JAN2020','SourceBusinessUnit':'PROSIEBEN','Duration':'33000','Studio':null,'Status':{'SourceID':''},'SourceSystem':'RL','SourceID':'123284626','SourceParentID':'123284627','SourceSeasonId':'123284628','SeasonName':'Season 1','EpisodeNumber':'2','Year1':'1995','Year2':'2010','Country':{'SourceID':'4'},'AssetGroup':{'SourceID':'5'},'AssetFormat':{'SourceID':''},'TBA':false,'MPAARating':{'SourceID':'291'},'TVRatingWarning':{'SourceID':'29'},'Vendor':[]}
        axios.get(apiconfig.api.url+apiconfig.api.asset+"/Name/test", config)
        .then(function (response) {
          console.log(response.data.length);
          ///
              fs.writeFileSync('C:\\RMSDOC\\NodeJsLog\\cronjob.output.'+generateGuid()+'.txt',JSON.stringify(response.data))              
              logger.log({
                message: 'called api '+apiconfig.api.url+apiconfig.api.asset+'Name/test'+ ' got '+response.data.length+'row(s)',
                level: 'info'
            });
          ///
        })
        .catch(function (error) {
          console.log(error);
        });

        ///
      })
      .catch(function (error) {
        console.log(error);
      });
  });

cron.schedule("* * * * *", function() {
    fsExtra.emptyDirSync('C:\\RMSDOC\\NodeJsLog\\')
  });

  function generateGuid() {
    var result, i, j;
    result = '';
    for(j=0; j<32; j++) {
      if( j == 8 || j == 12|| j == 16|| j == 20) 
        result = result + '-';
      i = Math.floor(Math.random()*16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
  }
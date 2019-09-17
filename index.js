console.log('Loading function');
const AWS = require('aws-sdk');
//const util = require('util');

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    //event = JSON.stringify(event,null,2));
    
//    console.log("event:" , util.inspect(event, { showHidden: false, depth: null }));

  AWS.config.update({region: 'us-east-1'});
    
  // Create CloudWatch service object
  var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});
  
    if (event.body) {
    event = JSON.parse(event.body);
    }

// Create parameters JSON for putMetricData
var params = {
  MetricData: [
    {
      MetricName: event.Dimensions.MetricName,
      Dimensions: [
        {
          Name: 'KEYWORD',
          Value: event.Dimensions.KEYWORD
        },
        {
          Name: 'TRIGGERID',
          Value: event.Dimensions.TRIGGERID
        }
      ],
      Unit: 'Count',
      Value: parseFloat(event.Dimensions.Count)
    },
  ],
  Namespace: event.Namespace
};

cw.putMetricData(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", JSON.stringify(data));
  }
});
  
        var responseBody = {
        "Namespace": event.Namespace,
        "MetricName": event.Dimensions.MetricName,
        "Keyword": event.Dimensions.KEYWORD,
        "TRIGGERID": event.Dimensions.TRIGGERID,
        "Count": event.Dimensions.Count,
        "MDN": event.Dimensions.MDN,
        "ReturnCode": event.APIReturn.ReturnCode,
        "ReturnDescription": event.APIReturn.ReturnDescription
    }; 

    var response = {
        "statusCode": 200,
        "headers": {
            "my_header": "OK"
        },
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
    
    return response;  // Echo back the first key value
    // throw new Error('Something went wrong');
};

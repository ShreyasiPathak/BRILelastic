var elasticsearch = require('es');
var mapping_func=require('../utils/mapping_function');
var config = {
     server : {
      host : 'brilelastic1.cern.ch',
      port : 9200
    }
};
var option = {
    _index : 'twitter1',
    _type : 'tweet1'
};
es = elasticsearch.createClient(config);
var file_name='mapping_twitter1';
mapping_func.mapping(option,file_name,es);

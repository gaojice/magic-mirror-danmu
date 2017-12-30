var Client = require('mariasql');
exports.query=function(callback){
    var c = new Client({
        host: '139.224.58.66',
        user: 'homekit',
        password: 'Ifh765Kjs',
        db: 'homekit'
      });
    c.query('SELECT indoor_value FROM `temperature` order by id DESC limit 1', function(err, rows) {
      if (err)
        throw err;
      //console.dir(rows);
      console.log('当前温度为: ', rows[0].indoor_value);
      callback(rows[0].indoor_value)
    });

    c.end();

}

module.exports = function(app, server) {

    var nodemailer     = require('nodemailer');
    var fs             = require('fs');
    var smtpTransport  = require('nodemailer-smtp-transport');
    var wellknown      = require('nodemailer-wellknown');
    var bodyParser     = require('body-parser');
    var fse            = require('fs-extra');
    var path           = require('path');
    var io             = require('socket.io')(server);
    var formidable     = require('formidable');
    var bwipjs         = require('bwip-js');

    const uuidV1 = require('uuid/v1');

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.post('/generatebarcodes', function(req, res) {
      var codes  = req.body.codes.split(",");
      var format = req.body.format;
      var size   = req.body.size;
      var validcodes = [];
      var count = 0;
      console.log('codes ',codes);
      codes.forEach(function(text){
        count++;
        console.log(rootDir);
        var outfile = path.join(rootDir,"barcodes", text + ".png");
        var buffer;

        bwipjs.toBuffer({
                bcid:        format,          // Barcode type
                text:        text,            // Text to encode
                scale:       1,               // 3x scaling factor
                height:      size.h,          // Bar height, in
                width:       size.w,          // Bar width, in millimeters
                includetext: true,            // Show human-readable text
                textxalign:  'center',        // Always good to set this
                textsize:    11               // Font size, in points
            }, function (err, png) {
                if (err) {
                    // Decide how to handle the error
                    // `err` may be a string or Error object
                    console.log(err);
                } else {
                    // `png` is a Buffer
                    // png.length           : PNG file length
                    // png.readUInt32BE(16) : PNG image width
                    // png.readUInt32BE(20) : PNG image height
                    buffer = png;
                    validcodes.push(text);
                    fs.writeFile(outfile, buffer ,"binary" ,function(){
                      if(count == codes.length){
                        console.log("Barcodes Created");
                        res.send({message:"Barcodes Created", codes: validcodes});
                      }
                    });
                }
            });

        });
    });

    // =============================================================================
    // IO                         ==================================================
    // =============================================================================

    var sockets = [];

    io.on('connection', function (socket) {

        socket.on('user', function (email) {

            socket.user = email;

            sockets.push(socket);

            console.log('users connected: '+socket.user);

            io.sockets.emit('user', 'people conected: '+ socket.user);
        });

        io.sockets.emit('connected', 'people conected');

        socket.on('error', function(err) {
            //here i change options
            console.log("error "+err);
        });

        socket.on('disconnect', function() {
            var position = sockets.indexOf(socket);
            sockets.splice(position,1);
        });
    });

    app.get('/', (req, res) => res.sendFile(path.resolve(rootDir,'index.html')));

};

import Rune from "rune.js"
import JPG from "jpeg-js"

class Pixels {

  constructor(url) {
    this.url = url;
  }

  // Load functions
  // -----------------------------------------------------

  load(callback) {
    var that = this;
    var isNode = typeof window === 'undefined';
    var loadFn = isNode ? this.loadFromFile : this.loadFromUrl;
    loadFn(this.url, function(err, arrayBuffer) {
      if(err) {
        return callback(err);
      }
      var jpg = JPG.decode(arrayBuffer);
      that.pixels = jpg.data;
      that.width = jpg.width;
      that.height = jpg.height;
      return callback(null);
    });
  }

  loadFromFile(path, callback) {
    var fs = require('fs');
    fs.readFile(path, function(err, buffer) {
      if (err) {
        return callback(err.message);
      }
      callback(null, this.toArrayBuffer(buffer));
    });
  }

  loadFromUrl(url, callback) {
    var request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      if (request.status !== 200) {
        return callback('Image could not be loaded: ' + request.statusText);
      }
      return callback(null, request.response);
    };
    request.send();
  }

  toArrayBuffer(buffer) {
    var arrayBuffer = new ArrayBuffer(buffer.length);
    var data = new Uint8Array(arrayBuffer);
    for (var i = 0; i < buffer.length; i += 1) {
      data[i] = buffer[i];
    }
    return arrayBuffer;
  }

  // Get
  // -----------------------------------------------------

  get(x, y) {
    if(!this.pixels) throw Error("You must load image before accessing pixel data");
    var index = (y * this.width + x) * 4;
    return new Rune.Color(this.pixels[index], this.pixels[index+1], this.pixels[index+2]);
  }

}

export default Pixels;

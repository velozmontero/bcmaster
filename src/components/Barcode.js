import React, { Component } from 'react';
import bwipjs from 'bwip-js';

class Barcode extends Component {
  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
  }

  remove(){
    this.props.remove(this.props.id);
  }

  componentDidMount() {
    console.log(this.props);

    let code = this.props.barcode.replace(/\D/g,'');
    console.log('code ', code);
    bwipjs(this.canvas, {
            bcid:        this.props.format,     // Barcode type
            text:        code,    // Text to encode
            scale:       1,                     // 3x scaling factor
            height:      this.props.size.h,     // Bar height, in
            width:       this.props.size.w,     // Bar width, in millimeters
            includetext: false,                  // Show human-readable text
            textxalign:  'center',              // Always good to set this
            textsize:    11                     // Font size, in points
        }, function (err, cvs) {
            if (err) {
                // Decide how to handle the error
                // `err` may be a string or Error object
                console.log(err);
            } else {
                // Nothing else to do in this example...
            }
        });
  }

  render() {
      return (
        <div className="barcode-block" onClick={()=>this.remove()}>
          <div className="block">
            <div className="info-wrapper">
              {
                 this.props.info.length > 0 && (
                   this.props.info.map((str, i) => (
                     <div key={i} className="info">
                      {
                        !isNaN(str) ? '$' + str :
                        str.split('-').map((s,e) => <span key={e}>{s}<br/></span>)
                      }
                     </div>
                   ))
                 )
              }
            </div>
            <div className="barcode-wrapper">
                <canvas ref={canvas => this.canvas = canvas}></canvas>
                <div style={{fontSize: '11px', textAlign: 'center'}}>{this.props.barcode}</div>
            </div>

          </div>
        </div>
    )
  }
}

export default Barcode;

import React, { Component } from 'react';
import BarcodeImage from './BarcodeImage';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './App.css';

const uuidV1  = require('uuid/v1');

class DisplayBarcodes extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 100 };
  }
  render() {
    console.log(this.props.barcodes);
    var that = this;
    var component = (this.props.barcodes.length > 0) ? this.props.barcodes.map(function(barcode){return <BarcodeImage key={uuidV1()} barcode={barcode} server={that.props.server}/>})
    : null;
    var width = this.state.value;
    return (
      <div className="App">
        <div className="range no-print">
          <InputRange
            maxValue={100}
            minValue={10}
            value={this.state.value}
            onChange={value => this.setState({ value })}
          />
        </div>

        <div className="barcode-container" style={{width:width+'%'}}>
          {component}
        </div>

      </div>
    );
  }
}

export default DisplayBarcodes;

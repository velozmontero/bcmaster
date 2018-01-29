import React, { Component } from 'react';
import Barcode from './Barcode';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

class DisplayBarcodes extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 100 };
  }
  render() {
    console.log(this.props.barcodes);
    var that = this;

    var barcode = (this.props.barcodes.length > 0) ? this.props.barcodes.map((barcode,i) => {
      console.log('barcode ',barcode);
      return (
        <Barcode 
          id={barcode.id} 
          key={barcode.id} 
          barcode={barcode.code} 
          info={barcode.info} 
          server={that.props.server} 
          remove={that.props.remove} 
          size={this.props.size}
          format={this.props.format}
        />
      )})
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
          {barcode}
        </div>

      </div>
    );
  }
}

export default DisplayBarcodes;

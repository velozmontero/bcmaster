import React, { Component } from 'react';
import './App.css';

class BarcodeImage extends Component {
  render() {
    return (
      <img
      className="barcode-img"   src={this.props.server+'/barcodes/'+this.props.barcode+'.png'}  alt="Barcode"
      />
    );
  }
}

export default BarcodeImage;

import React, { Component } from 'react';
import './App.css';

class BarcodeImage extends Component {
  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
  }
  remove(){
    this.props.remove(this.props.id);
  }
  render() {
    return (
      <div className="barcode-block" onClick={()=>{this.remove()}}>
        <div className="block">
          <div className="info-wrapper">
            <div className="info">{this.props.info.size}</div>
            <div className="info">{this.props.info.style}</div>
            <div className="info">{this.props.info.color}</div>
            <div className="info">{this.props.info.price}</div>
          </div>
          <div className="barcode-wrapper">
            <img
            className="barcode-img"   src={this.props.server+'/barcodes/'+this.props.barcode+'.png'}  alt="Barcode"
            />
          </div>
        </div>
      </div>

    );
  }
}

export default BarcodeImage;

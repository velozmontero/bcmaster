import React, { Component } from 'react';
import logo from './logo.svg';
import DisplayBarcodes from './DisplayBarcodes';
import './App.css';

const uuidV1  = require('uuid/v1');
const server = 'http://localhost:5000';

class App extends Component {
  constructor() {
    super();
    this.state = {
      codes: '',
      format: 'upca',
      size:{h:15, w:65},
      info:{size:'',style:'',color:'',price:'$ .'},
      barcodes:[]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.onSizeChange = this.onSizeChange.bind(this);
  }

  handleChange(event) {
    this.setState({codes: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    var that   = this;
    var codes  = this.state.codes.replace(/,$/,'');
    var format = this.state.format;
    var size   = this.state.size;
    var info   = this.state.info;

    if(!info.size || !info.style || !info.color || !(/\d/g).test(info.price)){
      return alert('Complete Style Inormation should be provided');
    }
    //console.log(codes, format);

    fetch(server+'/generatebarcodes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codes:codes,
        format:format,
        size: size
      })
    }).then((response) => response.json())
      .then((response) => {
        console.log(response);
        location.href = "#submit";

        var verifiedcodes = response.codes.map(code=>{return {id:uuidV1(),info:JSON.parse(JSON.stringify(info)),code:code}});

        var barcodes = that.state.barcodes.concat(verifiedcodes);
        that.setState({
          barcodes: barcodes
        });
      })
      .catch((error) => console.error(error))
  }

  handleSelect(event) {
    this.setState({format: event.target.value});
  }

  onSizeChange(h,w) {

    console.log(h,w);

    h = (h > 100)? 50 : (h < 1) ? 1 : h;
    w = (w > 100)? 50 : (w < 1) ? 1 : w;

    h.toString().replace(/\D/g,'')
    w.toString().replace(/\D/g,'')

    var size = {h:h,w:w}
    this.setState({size: size});
  }

  handlePrint(){
    window.print();
  }

  onInfoChange(size,style,color,price){
    price = price.replace(/\D/g,'');
    var priceFixed = [price.slice(0, price.length - 2), '.', price.slice(price.length - 2)].join('');

    console.log(price);
    var info = Object.assign(this.state.info, {
      size: size,
      style: style.toUpperCase(),
      color: color.toUpperCase(),
      price: '$'+priceFixed
    });
    this.setState({
      info: info
    })
  }

  handleRemove(id){
    var barcodes = this.state.barcodes.filter(item => item.id !== id);

    this.setState({barcodes: barcodes});
  }

  render() {
    return (
      <div className="App">
        <div className="no-print">
          <div className="App-header">

            <div className="block-left">
              <h2 className="vertical-center">Barcode Master</h2>
            </div>

            <div className="block-center"></div>

            <div className="block-right">
              <img src={logo} className="App-logo" alt="logo" />
            </div>

          </div>

          <p className="App-intro">
            Please write or paste the codes separated by commas.
          </p>
          <form onSubmit={this.handleSubmit}>
            <div className="container">
              <select onChange={(event)=>this.handleSelect(event)} name="format" value={this.state.format}>
                <option value="upca">UPC-A</option>
                <option value="upcacomposite">UPC-A Composite</option>
                <option value="upce">UPC-E</option>
                <option value="upcecomposite">UPC-E Composite</option>
              </select>
              <span>H</span>
              <input value={this.state.size.h} onChange={(e)=>this.onSizeChange(e.target.value,this.state.size.w)} min={1} max={100} type="number" />
              <span>W</span>
              <input value={this.state.size.w} onChange={(e)=>this.onSizeChange(this.state.size.h,e.target.value)} min={1} max={100} type="number" />
            </div>

            <div className="container">
              <select
                onChange={(e)=>this.onInfoChange(e.target.value,this.state.info.style,this.state.info.color,this.state.info.price)}
                name="format"
                value={this.state.info.size}>
                <option value="">-</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="1X">1X</option>
                <option value="2X">2X</option>
                <option value="3X">3X</option>
              </select>

              <input value={this.state.info.style}  onChange={(e)=>this.onInfoChange(this.state.info.size,e.target.value,this.state.info.color,this.state.info.price)}
              type="text" placeholder="Style"/>

              <input value={this.state.info.color}
              onChange={(e)=>this.onInfoChange(this.state.info.size,this.state.info.style,e.target.value,this.state.info.price)}
              type="text" placeholder="Color"/>

              <input value={this.state.info.price}
              onChange={(e)=>this.onInfoChange(this.state.info.size,this.state.info.style,this.state.info.color,e.target.value)}
              type="text" placeholder="Price"/>
            </div>

            <textarea onChange={codes=>this.handleChange(codes)} name="text" value={this.state.codes} placeholder="Enter Codes Here">
            </textarea>
            <br/>
            <button id="submit" onClick={event=>this.handleSubmit(event)} type="submit" name="submit">Generate</button>

            <button onClick={(e)=>this.handlePrint()} name="submit">Print</button>
          </form>
        </div>

        <DisplayBarcodes info={this.state.info} barcodes={this.state.barcodes} server={server} remove={this.handleRemove}/>

      </div>
    );
  }
}

export default App;

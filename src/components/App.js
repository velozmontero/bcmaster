import React, { Component } from 'react';
import logo from '../logo.svg';
import DisplayBarcodes from './DisplayBarcodes';
import '../css/bootstrap/css/bootstrap.css';
import '../css/App.css';

const uuidV1  = require('uuid/v1');
//const server = 'http://localhost:5055';
const server = 'http://10.1.10.68:5055';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isOneCode: true,
      codes: [],
      text: '',
      format: 'upca',
      size:{h:15, w:65},
      info:{size:'MD',style:'DR760',color:'111',price:'$ 45.50'},
      barcodes:[]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.onSizeChange = this.onSizeChange.bind(this);
  }

  handleChange(e) {

    var codes = e.target.value.split(/(?:\r\n|\r|\n)/).reduce((a,s)=>{
      var c = '';
      var q = '';
      var info = s.replace(/\$/g,'').replace(/\s+/g,' ').replace(/\s*\d-\d{5}-\d{5}-\d\d{0,1}\s*/, m=>{
        c = m.trim();
        return ' ';
      }).replace(/\s\d+\s|\s\d+$/, m=>{
        q = m.trim();
        return ' ';
      }).trim().split(/\s+|,/g).reduce((a,b)=>{return b ? a.concat([b]) : a},[]);

      console.log(c);
      console.log(q);
      console.log(info);

      return s ? a.concat([[c,q,info]]) : a;

    },[]);

    this.setState({
      isOneCode: (e.target.value.trim()).length <= 16,
      codes: codes,
      text: e.target.value.replace(/\$/g,'')
    })
  }

  handleSubmit(event) {
    event.preventDefault();

    var that      = this;
    var codes     = this.state.codes;

    var format    = this.state.format;
    var info      = this.state.info;
    var isOneCode = this.state.isOneCode;

    if(isOneCode && (!info.size || !info.style || !info.color || !(/\d/g).test(info.price))){
      return alert('Complete Style Inormation should be provided');
    }
    console.log(codes, format);

    location.href = "#submit";

    var verifiedcodes = codes.reduce((a,code)=>{
      var arr = [];
      var qty = code[1] ? Number(code[1]) : 1;

      for(var i = qty; i--;){
        arr.push(
          {
            id:uuidV1(),
            code: code[0],
            info: (isOneCode) ? [that.state.info.size,that.state.info.color,that.state.info.style,that.state.info.price.replace(/\$ /g,'')] : code[2]
          }
        )
      }

      return a.concat(arr);
    },[]);

    console.log(verifiedcodes);

    var barcodes = that.state.barcodes.concat(verifiedcodes);
    that.setState({
      barcodes: barcodes.sort((a,b) =>
        Number(a.code.replace(/\D/g, '')) < Number(b.code.replace(/\D/g, '')) ? -1 : 
        Number(a.code.replace(/\D/g, '')) > Number(b.code.replace(/\D/g, '')) ? 1 : 0)
    });
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

  handleClear(){
    this.setState({
      barcodes: [],
      text: ''
    });
  }

  render() {
    return (
      <div className="App">
        <div className="no-print">
          <div className="App-header">
            <div className="block-left">
              <h2 className="vertical-center">Barcode Master</h2>
            </div>
            <div className="block-right">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
          </div>

          <div className="form">
            <form onSubmit={this.handleSubmit}>
              <div className="section">
                <div className="col">
                  <select onChange={(event)=>this.handleSelect(event)} name="format" value={this.state.format}>
                    <option value="upca">UPC-A</option>
                    <option value="upcacomposite">UPC-A Composite</option>
                    <option value="upce">UPC-E</option>
                    <option value="upcecomposite">UPC-E Composite</option>
                  </select>
                </div>
                <div  className="col">
                  <span>H</span>
                  <input value={this.state.size.h} onChange={(e)=>this.onSizeChange(e.target.value,this.state.size.w)} min={1} max={100} type="number" />
                </div>
                <div  className="col">
                  <span>W</span>
                  <input value={this.state.size.w} onChange={(e)=>this.onSizeChange(this.state.size.h,e.target.value)} min={1} max={100} type="number" />
                </div>
              </div>

              <div className="container">
                <p className="App-intro">
                  Please write or paste the codes separated by commas or press enter.<br/>
                  Follow the following format for best results.<br/>
                  EXAMPLE: "CODE QUANTITY STYLE COLOR SIZE PRICE,"
                </p>

                <textarea onChange={codes=>this.handleChange(codes)} name="text" value={this.state.text} placeholder="Enter Codes Here">
                </textarea>
              </div>
              {
                (this.state.isOneCode) ? (
                  <div className="section">
                    <div className="col">
                      <select
                        onChange={(e)=>this.onInfoChange(e.target.value,this.state.info.style,this.state.info.color,this.state.info.price)}
                        name="format"
                        value={this.state.info.size}>
                        <option value="">-</option>
                        <option value="XS">XS</option>
                        <option value="SM">S</option>
                        <option value="MD">M</option>
                        <option value="LG">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="1X">1X</option>
                        <option value="2X">2X</option>
                        <option value="3X">3X</option>
                      </select>
                    </div>
                    <div className="col">
                      <input value={this.state.info.style}  onChange={(e)=>this.onInfoChange(this.state.info.size,e.target.value,this.state.info.color,this.state.info.price)}
                      type="text" placeholder="Style"/>
                    </div>
                    <div className="col">
                      <input value={this.state.info.color}
                      onChange={(e)=>this.onInfoChange(this.state.info.size,this.state.info.style,e.target.value,this.state.info.price)}
                      type="text" placeholder="Color"/>
                    </div>
                    <div className="col">
                      <input value={this.state.info.price}
                      onChange={(e)=>this.onInfoChange(this.state.info.size,this.state.info.style,this.state.info.color,e.target.value)}
                      type="text" placeholder="Price"/>
                    </div>
                  </div>
                ):(null)
              }
                <br/>
                <button className="btn" id="submit" onClick={(e)=>this.handleSubmit(e)} type="submit" name="submit">Generate</button>

                <div className="btn" onClick={(e)=>this.handlePrint()} >Print</div>

                <div className="btn" onClick={(e)=>this.handleClear()} >Clear</div>
            </form>
          </div>
        </div>

        <DisplayBarcodes 
          info={this.state.info}
          barcodes={this.state.barcodes} 
          server={server} 
          remove={this.handleRemove} 
          format={this.state.format}
          size={this.state.size}
        />

      </div>
    );
  }
}

export default App;

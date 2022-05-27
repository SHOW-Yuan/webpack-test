// import React from 'react';
// import ReactDOM from 'react-dom';
// import './app.css';

const React = require('react')
const ReactDOM = require('react-dom')
require('./app.css');

class Rct extends React.Component {
    loadmore = ()=> {
        require('./hello.js').then((txt)=>{
            console.log(txt);
        })
    }

    render(){
        return (
            <div>
                <span onClick={this.loadmore.bind(this)}>这个是标题</span>
                <span>设置fixe布局</span>
            </div>
        )
    }
}

module.exports = <Rct />;
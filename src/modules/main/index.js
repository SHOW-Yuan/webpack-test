import React from 'react';
import ReactDOM from 'react-dom';

import './app.css';

class Rct extends React.Component {
    loadmore = ()=> {
        import('./hello.js').then((txt)=>{
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

ReactDOM.render(
    <Rct />,
    document.getElementById('root')
)
import React from 'react';
import ReactDOM from 'react-dom';

import { hello } from './hello';
import './app.css';

class Rct extends React.Component {
    render(){
        a = 1
        return (
            <div>
                { hello() }
                <span>这个是标题</span>
                <span>设置fixe布局</span>
            </div>
        )
    }
}

ReactDOM.render(
    <Rct />,
    document.getElementById('root')
)
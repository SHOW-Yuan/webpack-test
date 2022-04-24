import React from 'react';
import ReactDOM from 'react-dom';

import { hello } from './hello';
import './app.css';

class Rct extends React.Component {
    render(){
        return (
            <div>
                { hello() }
            </div>
        )
    }
}

ReactDOM.render(
    <Rct />,
    document.getElementById('root')
)
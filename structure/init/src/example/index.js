import React from 'react';
import ReactDom from 'react-dom';

class Example extends React.Component {
    constructor (props, context) {
        super(props, context);
    }
    render () {
        return (
            <div style={{
                'display': 'flex',
                'justifyContent': 'center',
                'alignItems': 'center',
                'fontSize': '40px',
                'color': '#666',
                'width': '100%',
                'height': '750px'
            }}>
                源——Hello World
            </div>
        );
    }
}

ReactDom.render(<Example></Example>, document.getElementById('example'));
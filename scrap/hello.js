import React from "react";

export class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name
        };
        // replace handleChange with a copy of handleChange, where this is always bind to this object
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    render() {
        return (
            <div>
                <h1>
                    Hello,{" "}
                    <AquaBox>
                        <Greetee greetee={this.state.name} />
                    </AquaBox>
                    !
                </h1>
                <input onChange={this.handleChange} />
            </div>
        );
    }
}

function Greetee(props) {
    return <span style={{ color: "tomato" }}>{props.greetee}</span>;
}

function AquaBox(props) {
    return <span style={{ backgroundColor: "aqua" }}>{props.children}</span>;
}
//
// function GreeteeChanger() {
//     return <input onChange={this.handleChange} />;
// }

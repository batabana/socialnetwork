import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Logo from "./logo";

let component;
if (location.pathname === "/welcome") {
    component = <Welcome />;
}
if (location.pathname === "/") {
    component = <Logo />;
}

ReactDOM.render(component, document.querySelector("main"));

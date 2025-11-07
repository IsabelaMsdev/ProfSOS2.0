import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./PageTransition.css";

export default function PageTransition({ children, location }) {
  return (
    <TransitionGroup>
      <CSSTransition key={location.pathname} classNames="page" timeout={300}>
        <div className="page">{children}</div>
      </CSSTransition>
    </TransitionGroup>
  );
}

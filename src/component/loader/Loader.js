import styles from "./Loader.module.scss";
import loaderImg from "../../assets/loader.gif";
import ReactDOM from "react-dom";



const Loader = ({ children }) => {
  const portal = document.createElement('div');
  document.body.appendChild(portal);

  return ReactDOM.createPortal(children, portal);
};

export default Loader;
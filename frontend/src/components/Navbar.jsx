import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/Matthew">Matthew</Link>
      <Link to="/John">John</Link>
      <Link to="/Peter">Peter</Link>
      <Link to="/Paul">Paul</Link>
      <Link to="/Games">Games</Link>
    </nav>
  );
}

export default Navbar;
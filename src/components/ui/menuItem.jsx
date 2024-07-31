import React from "react";
import { useNavigate } from "react-router-dom";
import { Colors } from "./colors";
import { Link } from "react-router-dom";
const MenuItem = ({ name, path }) => {
  const handleClick = () => {};

  return (
    <li
      style={{
        cursor: "pointer",
        transition: "transform 0.3s, color 0.2s",
        color: "#f3f3f3",
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.color = Colors.orange;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.color = Colors.white;
      }}
    >
      <Link to={path}> {name} </Link>
    </li>
  );
};

export default MenuItem;

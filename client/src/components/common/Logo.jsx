import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Logo({
  size = "large",        // "small" | "medium" | "large" | "xl"
  className = "",
  showText = false       // set false to hide typography
}) {
  const primary = "/common/logo.png";
  const secondary = "/common/logo.svg";
  const [src, setSrc] = useState(primary);
  const [triedSecondary, setTriedSecondary] = useState(false);

  const handleError = () => {
    if (!triedSecondary && src !== secondary) {
      setSrc(secondary);
      setTriedSecondary(true);
      return;
    }
    setSrc(null);
  };

  const sizePx = {
    small: 32,
    medium: 48,
    large: 64,
    xl: 120
  }[size] || 64;

  // inline styles to absolutely enforce dimensions (override parent CSS)
  const forcedStyle = {
    width: `${sizePx}px`,
    height: `${sizePx}px`,
    minWidth: `${sizePx}px`,
    minHeight: `${sizePx}px`,
    maxWidth: `${sizePx}px`,
    maxHeight: `${sizePx}px`,
    display: "block",
    objectFit: "contain",
    flexShrink: 0
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      {src ? (
        <img
          src={src}
          alt="AgileAtlas"
          onError={handleError}
          style={forcedStyle}
        />
      ) : (
        <svg
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="AgileAtlas"
          style={forcedStyle}
        >
          <rect width="64" height="64" rx="12" fill="#0f172a" />
          <text x="50%" y="55%" fill="#10b981" fontSize="20" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">AA</text>
        </svg>
      )}
      {showText && <span className="ml-3 font-bold text-white">AgileAtlas</span>}
    </Link>
  );
}
import React from "react";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/system";

const bgMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function Background() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background: "linear-gradient(-45deg, #10141c, #141a26, #1b2230, #11151f)",
        backgroundSize: "300% 300%",
        animation: `${bgMove} 20s ease infinite`,

        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(255,255,255,0.06), transparent 40%)," +
            "radial-gradient(40% 40% at 80% 80%, rgba(255,255,255,0.04), transparent 40%)",
          mixBlendMode: "overlay",
        },
      }}
    />
  );
}

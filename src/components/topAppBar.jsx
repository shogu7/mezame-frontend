import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

export default function TopAppBar() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            Mezame
          </Typography>
        </Box>

        <Button
          color="inherit"
          variant="outlined"
          onClick={() => navigate("/login")}
          sx={{
            borderColor: "rgba(255,255,255,0.35)",
            color: "rgba(255,255,255,0.95)",
            "&:hover": {
              borderColor: "rgba(0, 0, 0, 0.7)",
              backgroundColor: "rgba(0, 0, 0, 0.06)",
            },
          }}
        >
          Connexion
        </Button>
      </Toolbar>
    </AppBar>
  );
}

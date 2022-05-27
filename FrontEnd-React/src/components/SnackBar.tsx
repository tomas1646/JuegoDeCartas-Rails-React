import React, { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

interface SnackBarProps {
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

export function showErrorMessage(message: string) {
  const customEvent = new CustomEvent("showSnackbar", {
    detail: { severity: "error", message },
  });
  document.dispatchEvent(customEvent);
}

export function showSuccessMessage(message: string) {
  const customEvent = new CustomEvent("showSnackbar", {
    detail: { severity: "success", message },
  });
  document.dispatchEvent(customEvent);
}

export default function SnackbarComponent() {
  const [snackbarProps, setSnackbarProps] = useState<SnackBarProps | null>(
    null
  );

  useEffect(() => {
    document.addEventListener("showSnackbar", updateSnackbar);

    //Component unmount
    return () => {
      document.removeEventListener("showSnackbar", updateSnackbar);
    };
  }, []);

  const updateSnackbar = (e: any) => {
    setSnackbarProps(e.detail);
  };

  return (
    snackbarProps && (
      <Snackbar
        open={!!snackbarProps}
        autoHideDuration={5000}
        onClose={() => setSnackbarProps(null)}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <Alert
          elevation={10}
          variant="filled"
          severity={snackbarProps.severity}
        >
          {snackbarProps.message}
        </Alert>
      </Snackbar>
    )
  );
}

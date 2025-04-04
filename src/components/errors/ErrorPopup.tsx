// src/components/ErrorPopup.tsx
import type React from "react";
import { Snackbar, Alert } from "@mui/material";

interface ErrorPopupProps {
	open: boolean;
	message: string;
	onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ open, message, onClose }) => {
	return (
		<Snackbar
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			autoHideDuration={6000}
			open={open}
			onClose={onClose}
		>
			<Alert severity="error" sx={{ width: "100%" }} onClose={onClose}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default ErrorPopup;

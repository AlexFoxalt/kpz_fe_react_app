// src/pages/LoginPage.tsx
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Alert } from "@mui/material";
import { fetchData } from "../services/api";
import styled from "styled-components";
import ErrorPopup from "../components/errors/ErrorPopup";

const LoginContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background-color: #f0f4f8;
`;

const FormBox = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem;
	background-color: #ffffff;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
`;

const StyledButton = styled(Button)`
	margin-top: 1rem;
`;

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [popupOpen, setPopupOpen] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetchData("/v1/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			localStorage.setItem("token", response.data);
			navigate("/users");
		} catch (error) {
			setError("Error logging in.");
			setPopupOpen(true);
			console.error("Error logging in:", error);
		}
	};

	return (
		<LoginContainer>
			<FormBox onSubmit={handleSubmit}>
				<TextField
					fullWidth
					required
					label="Email"
					margin="normal"
					type="email"
					value={email}
					onChange={(e) => { setEmail(e.target.value); }}
				/>
				<TextField
					fullWidth
					required
					label="Password"
					margin="normal"
					type="password"
					value={password}
					onChange={(e) => { setPassword(e.target.value); }}
				/>
				{error && <Alert severity="error">{error}</Alert>}
				<StyledButton
					fullWidth
					color="primary"
					type="submit"
					variant="contained"
				>
					Login
				</StyledButton>
			</FormBox>
			<ErrorPopup
				message={error || ""}
				open={popupOpen}
				onClose={() => { setPopupOpen(false); }}
			/>
		</LoginContainer>
	);
};

export default LoginPage;

import type React from "react";
import { useState } from "react";
import type { ModalProps } from "@mui/material/Modal";
import {
	Modal,
	Box,
	Typography,
	IconButton,
	Grid,
	Paper,
	TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import styled from "styled-components";
import { format } from "date-fns";
import { fetchData } from "../../services/api";
import { useNavigate } from "react-router-dom";

const ModalBox = styled(Box)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 80%;
	max-width: 1000px;
	background-color: #fff;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	padding: 2rem;
	border-radius: 8px;
`;

const PurchaseItem = styled(Paper)`
	padding: 1rem;
	margin-bottom: 1rem;
	background-color: #f0f4f8;
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: background-color 0.3s;

	&:hover {
		background-color: #e0e7ef;
	}
`;

const FormBox = styled(Box)`
	display: flex;
	align-items: center;
	margin-bottom: 1rem;
	margin-right: 2rem;
`;

const StyledTextField = styled(TextField)`
	margin-right: 1rem;
`;

const StyledIconButton = styled(IconButton)`
	&:hover {
		background-color: rgba(0, 0, 0, 0.04);
	}
`;

interface PurchasesModalProps extends ModalProps {
	purchases: Array<{
		id: number;
		name: string;
		price: number;
		date_created: string;
	}>;
	onDelete: (id: number) => void;
	onCreate: (
		purchases: Array<{
			id: number;
			name: string;
			price: number;
			date_created: string;
		}>
	) => void;
	userId: number;
}

const PurchasesModal: React.FC<PurchasesModalProps> = ({
	open,
	onClose,
	purchases,
	onDelete,
	onCreate,
	userId,
}) => {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [editId, setEditId] = useState<number | null>(null);
	const [editName, setEditName] = useState("");
	const [editPrice, setEditPrice] = useState("");
	const navigate = useNavigate();

	const handleCreate = async () => {
		try {
			await fetchData("/v1/purchases", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					price: parseFloat(price),
					user_id: userId,
				}),
			});
			const response = await fetchData(`/v1/users/${userId}`);
			onCreate(response.data.purchases);
			setName("");
			setPrice("");
		} catch (error) {
			navigate("/login");
			console.error("Error creating purchase:", error);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await fetchData(`/v1/purchases/${id}`, {
				method: "DELETE",
			});
			onDelete(id);
		} catch (error) {
			navigate("/login");
			console.error("Error deleting purchase:", error);
		}
	};

	const handleEdit = (purchase: {
		id: number;
		name: string;
		price: number;
	}) => {
		setEditId(purchase.id);
		setEditName(purchase.name);
		setEditPrice(purchase.price.toString());
	};

	const handleConfirmEdit = async (id: number) => {
		try {
			await fetchData(`/v1/purchases/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: editName,
					price: parseFloat(editPrice),
					user_id: userId,
				}),
			});
			const response = await fetchData(`/v1/users/${userId}`);
			onCreate(response.data.purchases);
			setEditId(null);
			setEditName("");
			setEditPrice("");
		} catch (error) {
			navigate("/login");
			console.error("Error updating purchase:", error);
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<ModalBox>
				<Typography gutterBottom component="h2" variant="h6">
					Purchases
				</Typography>
				<FormBox>
					<StyledTextField
						required
						label="Name"
						margin="normal"
						value={name}
						onChange={(e) => { setName(e.target.value); }}
					/>
					<StyledTextField
						required
						label="Price"
						margin="normal"
						type="number"
						value={price}
						onChange={(e) => { setPrice(e.target.value); }}
					/>
					<StyledIconButton color="primary" onClick={handleCreate}>
						<AddIcon />
					</StyledIconButton>
				</FormBox>
				<Grid container spacing={2}>
					{purchases.map((purchase, index) => (
						<Grid key={index} item xs={12}>
							<PurchaseItem>
								<div>
									{editId === purchase.id ? (
										<>
											<StyledTextField
												required
												label="Name"
												margin="normal"
												value={editName}
												onChange={(e) => { setEditName(e.target.value); }}
											/>
											<StyledTextField
												required
												label="Price"
												margin="normal"
												type="number"
												value={editPrice}
												onChange={(e) => { setEditPrice(e.target.value); }}
											/>
										</>
									) : (
										<>
											<Typography variant="subtitle1">
												<strong>Name:</strong> {purchase.name}
											</Typography>
											<Typography variant="subtitle1">
												<strong>Price:</strong> ${purchase.price}
											</Typography>
											<Typography variant="subtitle1">
												<strong>Date:</strong>{" "}
												{format(
													new Date(purchase.created_at),
													"dd MMMM hh:mm:ss"
												)}
											</Typography>
										</>
									)}
								</div>
								<div>
									{editId === purchase.id ? (
										<StyledIconButton
											color="primary"
											size="small"
											onClick={() => handleConfirmEdit(purchase.id)}
										>
											<CheckIcon />
										</StyledIconButton>
									) : (
										<StyledIconButton
											color="primary"
											size="small"
											onClick={() => { handleEdit(purchase); }}
										>
											<EditIcon />
										</StyledIconButton>
									)}
									<StyledIconButton
										color="secondary"
										size="small"
										onClick={() => handleDelete(purchase.id)}
									>
										<DeleteIcon />
									</StyledIconButton>
								</div>
							</PurchaseItem>
						</Grid>
					))}
				</Grid>
			</ModalBox>
		</Modal>
	);
};

export default PurchasesModal;

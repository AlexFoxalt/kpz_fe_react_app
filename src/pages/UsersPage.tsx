import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../services/api";
import {
	Container,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Grid,
	Box,
	Divider,
} from "@mui/material";
import styled from "styled-components";
import ErrorPopup from "../components/errors/ErrorPopup";
import PurchasesModal from "../components/modals/PurchasesModal";
import { format } from "date-fns";

const UsersContainer = styled(Container)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background-color: #f0f4f8;
`;

const StyledTableContainer = styled(TableContainer)`
	margin-top: 2rem;
	background-color: #ffffff;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
`;

const StyledTableRow = styled(TableRow)`
	&:hover {
		background-color: #e0e7ef;
	}
	cursor: pointer;
`;

const PurchaseHistoryBox = styled(Box)`
	position: fixed;
	top: 2rem;
	right: 2rem;
	width: 300px;
	padding: 1rem;
	background-color: #ffffff;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
`;

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [purchases, setPurchases] = useState([]);
	const [error, setError] = useState<string | null>(null);
	const [popupOpen, setPopupOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedUserPurchases, setSelectedUserPurchases] = useState<Array<any>>([]);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const getUsers = async () => {
			try {
				const response = await fetchData("/v1/users");
				setUsers(response.data);
			} catch (error) {
				navigate("/login");
				setError("Error fetching users.");
				setPopupOpen(true);
				console.error("Error fetching users:", error);
			}
		};

		const getPurchases = async () => {
			try {
				const response = await fetchData("/v1/purchases");
				const sortedPurchases = response.data.sort((a, b) => b.id - a.id);
				setPurchases(sortedPurchases.slice(0, 5));
			} catch (error) {
				navigate("/login");
				setError("Error fetching purchases.");
				setPopupOpen(true);
				console.error("Error fetching purchases:", error);
			}
		};

		getUsers();
		getPurchases();
	}, [navigate]);

	const handleUserClick = (userId: number, purchases: Array<any>) => {
		setSelectedUserId(userId);
		setSelectedUserPurchases(purchases);
		setModalOpen(true);
	};

	const handleDeletePurchase = (purchaseId: number) => {
		setSelectedUserPurchases((previousPurchases) =>
			previousPurchases.filter((purchase) => purchase.id !== purchaseId)
		);
		setUsers((previousUsers) =>
			previousUsers.map((user) =>
				user.id === selectedUserId
					? {
							...user,
							purchases: user.purchases.filter(
								(purchase) => purchase.id !== purchaseId
							),
						}
					: user
			)
		);
		updatePurchaseHistory();
	};

	const handleCreatePurchase = (
		updatedPurchases: Array<{
			id: number;
			name: string;
			price: number;
			date_created: string;
		}>
	) => {
		setSelectedUserPurchases(updatedPurchases);
		setUsers((previousUsers) =>
			previousUsers.map((user) =>
				user.id === selectedUserId
					? { ...user, purchases: updatedPurchases }
					: user
			)
		);
		updatePurchaseHistory();
	};

	const updatePurchaseHistory = async () => {
		try {
			const response = await fetchData("/v1/purchases");
			const sortedPurchases = response.data.sort((a, b) => b.id - a.id);
			setPurchases(sortedPurchases.slice(0, 5));
		} catch (error) {
			navigate("/login");
			setError("Error updating purchase history.");
			setPopupOpen(true);
			console.error("Error updating purchase history:", error);
		}
	};

	return (
		<>
			<UsersContainer maxWidth="md">
				<Typography gutterBottom component="h1" variant="h4">
					Users
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<StyledTableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>ID</TableCell>
										<TableCell>Name</TableCell>
										<TableCell>Email</TableCell>
										<TableCell>Purchases</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users.map((user) => (
										<StyledTableRow
											key={user.id}
											onClick={() => { handleUserClick(user.id, user.purchases); }}
										>
											<TableCell>{user.id}</TableCell>
											<TableCell>{user.name}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>{user.purchases.length}</TableCell>
										</StyledTableRow>
									))}
								</TableBody>
							</Table>
						</StyledTableContainer>
					</Grid>
				</Grid>
				<ErrorPopup
					message={error || ""}
					open={popupOpen}
					onClose={() => { setPopupOpen(false); }}
				/>
				<PurchasesModal
					open={modalOpen}
					purchases={selectedUserPurchases}
					userId={selectedUserId!}
					onClose={() => { setModalOpen(false); }}
					onCreate={handleCreatePurchase}
					onDelete={handleDeletePurchase}
				/>
			</UsersContainer>
			<PurchaseHistoryBox>
				<Typography gutterBottom component="h2" variant="h6">
					Purchase History
				</Typography>
				{purchases.map((purchase, index) => (
					<React.Fragment key={purchase.id}>
						<Box mb={2}>
							<Typography variant="subtitle1">
								<strong>Name:</strong> {purchase.name}
							</Typography>
							<Typography variant="subtitle1">
								<strong>Price:</strong> ${purchase.price}
							</Typography>
							<Typography variant="subtitle1">
								<strong>User:</strong> {purchase.user.name}
							</Typography>
							<Typography variant="subtitle1">
								<strong>Date:</strong>{" "}
								{format(new Date(purchase.created_at), "dd MMMM hh:mm:ss")}
							</Typography>
						</Box>
						{index < purchases.length - 1 && <Divider />}
					</React.Fragment>
				))}
			</PurchaseHistoryBox>
		</>
	);
};

export default UsersPage;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
// ... other imports

const App = (): JSX.Element => {
	return (
		<BrowserRouter>
			{/* Your routes and other components */}
			<Routes>
				<Route element={<UsersPage />} path="/users" />
				<Route element={<LoginPage />} path="/login" />
				{/* ... other routes */}
			</Routes>
		</BrowserRouter>
	);
};

export default App;

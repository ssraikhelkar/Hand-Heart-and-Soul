import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import CreateUsers from "./pages/CreateUsers";
import Events from "./pages/Events";
import Users from "./pages/Users";
import UsersTable from "./pages/UsersTable";
import Login from "./pages/Login";
import "./styles/App.scss";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route path="/" element={<Login />} />
				<Route path="events" element={<Events />} />
				<Route path="users" element={<Users />} />
				<Route path="create-users" element={<CreateUsers />} />
				<Route path="users-table" element={<UsersTable />} />
			</>
		),
		{ basename: "/Hand-Heart-and-Soul/" }
	);

	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;

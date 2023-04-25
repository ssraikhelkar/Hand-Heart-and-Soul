import { useEffect, useState } from "react";

import CustomSnackbar, { snackbarType } from "../components/CustomSnackbar";
import { supabase } from "../supabaseClient";
import { dataField, dataTable, dataTableLink } from "../types/dataTableTypes";
import DataTableRow from "./DataTableRow";
import { Link } from "react-router-dom";
import ExportCSVButton from "./ExportCSVButton";

function DataTable({
	fields,
	table,
	tableSelection = "*",
	dataName,
	deleteConfirmMessageField,
	title,
	links = [],
	showExport = false
}: {
	fields: dataField<any>[];
	/**
	 * Name of the database table to fetch data from.
	 */
	table: dataTable;
	/**
	 * What to select from the table (what goes in the .select() function). Defaults to *
	 */
	tableSelection?: string;
	/**
	 * This should be the singular, lowercase form of the type of data being displayed. (e.g. "event", "event type", "user", etc.)
	 */
	dataName: string;
	/**
	 * The name of the field to display in the confirmation message when deleting a data point. (e.g. "name", "id", "email", etc.)
	 */
	deleteConfirmMessageField: string;
	/**
	 * Title to display at the top of the page
	 */
	title: string;
	/**
	 * Links to display at the top of the page
	 */
	links?: dataTableLink[];
	/**
	 * Whether or not to display the export button
	 */
	showExport?: boolean;
}) {
	const [data, setData] = useState<any>();

	useEffect(() => {
		async function fetchEvents() {
			const { data, error } = await supabase.from(table).select(tableSelection);

			if (error) {
				console.error(error);
				setSnackBar({ toggle: true, severity: "error", message: `Failed to fetch ${dataName}s` });
			} else setData(data);
		}

		fetchEvents();
	}, []);

	const [snackbar, setSnackBar] = useState<snackbarType>({
		toggle: false,
		severity: "error",
		message: ""
	});

	return (
		<div className="table-layout">
			<div className={showExport || links.length ? "title" : ""}>
				<h1>{title}</h1>

				<div className="right">
					{links.map(link => (
						<Link key={link.text} to={link.to}>
							<button>{link.text}</button>
						</Link>
					))}
					{showExport && <ExportCSVButton data={data} />}
				</div>
			</div>

			<table>
				<thead>
					<tr>
						{fields.map(field => (
							<th key={field.header}>{field.header}</th>
						))}
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{data ? (
						data
							// TODO: Add dynamic sorting
							// .sort((eventA, eventB) => eventB.date.localeCompare(eventA.date))
							.map(dataPoint => (
								// <CommunityEventRow
								// 	key={dataPoint.id}
								// 	event={dataPoint}
								// 	removeEvent={() => setData(data?.filter(dp => dp.id != dataPoint.id))}
								// 	updateEvent={updatedDataPoint => {
								// 		setData(data?.map(dp => (dp.id == dataPoint.id ? updatedDataPoint : dp)));
								// 	}}
								// 	setSnackBar={setSnackBar}
								// />
								<DataTableRow
									key={dataPoint.id}
									dataPoint={dataPoint}
									fields={fields}
									table={table}
									tableSelection={tableSelection}
									dataName={dataName}
									deleteConfirmMessageField={deleteConfirmMessageField}
									removeDataPoint={() => setData(data?.filter(dp => dp.id != dataPoint.id))}
									updateDataPoint={updatedDataPoint => {
										setData(data?.map(dp => (dp.id == dataPoint.id ? updatedDataPoint : dp)));
									}}
									setSnackBar={setSnackBar}
								/>
							))
					) : (
						<tr>
							<td colSpan={999} className="loading">
								Loading...
							</td>
						</tr>
					)}
				</tbody>
			</table>

			<CustomSnackbar snackbar={snackbar} setSnackbar={setSnackBar} />
		</div>
	);
}

export default DataTable;
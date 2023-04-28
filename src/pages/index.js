import Head from "next/head";
import recordList from "../../data/records.json";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";
import { format } from "date-fns";
import $ from "jquery";
import ReactPaginate from "react-paginate";

export default function Home() {
	// format string to date
	recordList.forEach((item) => {
		item.launch_date_local = new Date(Date.parse(item.launch_date_local));
	});
	const [records, setRecords] = useState(recordList);
	// item sort state
	const [sortDirect, setSortDirect] = useState([0, 0, 0, 0]);
	const [nowPage, setNowPage] = useState(0);
	const [pageTotal, setPageTotal] = useState(1);
	const [nowSet, setNowSet] = useState([]);
	// pagination
	const pagination = () => {
		const dataTotal = records.length;
		const perpage = 20;
		const pt = Math.ceil(dataTotal / perpage);
		setPageTotal(pt);
		setNowSet(records.slice(nowPage, perpage));
	};
	const rotateArrow = (sort) => {
		sort
			? $(".bi.show").removeClass("rotate")
			: $(".bi.show").addClass("rotate");
	};
	useEffect(() => {
		pagination();
	}, [records]);
	// sort
	useEffect(() => {
		$("#title td")
			.off()
			.on("click", function () {
				let sd = sortDirect;
				sd[$(this)[0].cellIndex] = sortDirect[$(this)[0].cellIndex] ? 0 : 1;
				setSortDirect(sd);
				$(".bi").removeClass(" show");
				$(".bi")[$(this)[0].cellIndex].classList += " show";
				switch ($(this)[0].cellIndex) {
					case 0:
						let mn = nowSet.sort(function (a, b) {
							rotateArrow(sortDirect[0]);
							if (sortDirect[0]) {
								return a.mission_name.localeCompare(b.mission_name);
							} else {
								return b.mission_name.localeCompare(a.mission_name);
							}
						});
						setNowSet([...mn]);
						break;
					case 1:
						let rn = nowSet.sort(function (a, b) {
							rotateArrow(sortDirect[1]);
							if (sortDirect[1]) {
								return a["rocket.rocket_name"].localeCompare(
									b["rocket.rocket_name"]
								);
							} else {
								return b["rocket.rocket_name"].localeCompare(
									a["rocket.rocket_name"]
								);
							}
						});
						setNowSet([...rn]);
						break;
					case 2:
						let rt = nowSet.sort(function (a, b) {
							rotateArrow(sortDirect[2]);
							if (sortDirect[2]) {
								return a["rocket.rocket_type"].localeCompare(
									b["rocket.rocket_type"]
								);
							} else {
								return b["rocket.rocket_type"].localeCompare(
									a["rocket.rocket_type"]
								);
							}
						});
						setNowSet([...rt]);
						break;
					case 3:
						let ld = nowSet.sort(function (a, b) {
							rotateArrow(sortDirect[3]);
							if (sortDirect[3]) {
								return a["launch_date_local"] - b["launch_date_local"];
							} else {
								return b["launch_date_local"] - a["launch_date_local"];
							}
						});
						setNowSet([...ld]);
						break;
				}
			});
	}, [...sortDirect, nowSet]);
	useEffect(() => {
		$("li.selected").addClass(styles["page-active"]);
	}, [nowPage]);
	return (
		<>
			<Head>
				<title>launch records</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main>
				<div className={styles.search}>
					<input
						type="text"
						onChange={(e) => {
							let keyword = e.target.value.toLowerCase();
							if (keyword == "") {
								setRecords(recordList);
								return;
							}
							let result = recordList.filter(function (el) {
								return (
									el.mission_name.toLowerCase().indexOf(keyword) > -1 ||
									el["rocket.rocket_name"].toLowerCase().indexOf(keyword) >
										-1 ||
									el["rocket.rocket_type"].toLowerCase().indexOf(keyword) >
										-1 ||
									format(el["launch_date_local"], "yyyy/MM/dd").indexOf(
										keyword
									) > -1
								);
							});
							setRecords(result);
						}}
						placeholder="Search..."
					/>
				</div>
				<table className={styles.record}>
					<thead className="">
						<tr id="title">
							<td>
								Mission Name <i className="bi bi-chevron-up"></i>
							</td>
							<td>
								Rocket Name<i className="bi bi-chevron-up"></i>
							</td>
							<td>
								Rocket Type<i className="bi bi-chevron-up"></i>
							</td>
							<td>
								Launch Date<i className="bi bi-chevron-up"></i>
							</td>
						</tr>
					</thead>
					<tbody>
						{nowSet.map((record, i) => {
							return (
								<tr key={i}>
									<td>{record.mission_name}</td>
									<td>{record["rocket.rocket_name"]}</td>
									<td>{record["rocket.rocket_type"]}</td>
									<td>{format(record.launch_date_local, "yyyy/MM/dd")}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<ReactPaginate
					className={styles.pagination}
					pageCount={pageTotal}
					previousLabel={false}
					nextLabel={false}
					onPageChange={(e) => {
						// change now record set with page
						let start = e.selected * 20;
						setNowSet(records.slice(start, start + 20));
						setNowPage(e.selected);
					}}
					onClick={(e) => {
						console.log(e);
					}}
				/>
			</main>
		</>
	);
}

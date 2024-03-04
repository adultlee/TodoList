import { title } from "@/components/primitives";
import TodosTable from "@/components/TodosTable";

async function fetchTodosApiCall() {
	const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/`, {
		cache: "no-store",
	});
	const contentTypeHeaderValue = data.headers.get("Content-Type");

	if (contentTypeHeaderValue?.includes("text/html")) {
		return null;
	}
	return data.json();
}

export default async function Home() {
	const { data } = await fetchTodosApiCall();

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center ">
				<h1 className={title()}>Adultlee Todo</h1>
				{data ? <TodosTable todos={data} /> : "데이터가 연결되지 않았습니다."}
			</div>
		</section>
	);
}

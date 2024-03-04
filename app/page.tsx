import { title } from "@/components/primitives";
import TodosTable from "@/components/TodosTable";

async function fetchTodosApiCall() {
	const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/`, {
		cache: "no-store",
	});

	return data.json();
}

export default async function Home() {
	const { data } = await fetchTodosApiCall();

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center ">
				<h1 className={title()}>Adultlee Todo</h1>
				<TodosTable todos={data} />
			</div>
		</section>
	);
}

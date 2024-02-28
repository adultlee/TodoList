import { NextRequest, NextResponse } from "next/server";
import { fetchTodos, addTodo } from "@/data/filestore";

export async function GET(request: NextRequest) {
	const data = await fetchTodos();
	const response = {
		message: "데이터를 모두 받습니다",
		data: data,
	};
	return NextResponse.json(response, { status: 200 });
}

export async function POST(request: NextRequest) {
	const { title } = await request.json();

	const addedTodo = await addTodo({ title });

	const response = {
		message: "todo를 성공적으로 추가했습니다.",
		data: addedTodo,
	};

	return NextResponse.json(response, { status: 200 });
}

import { fetchTodo, deleteTodo, postTodo } from "@/data/filestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const fetchedData = await fetchTodo(params.slug);

	if (fetchedData === null) {
		return new Response(null, { status: 204 });
	}

	const response = {
		message: "단일 할일 가져오기 성공",
		data: fetchedData,
	};

	return NextResponse.json(response, { status: 201 });
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const deletedTodo = await deleteTodo(params.slug);
	if (deletedTodo === null) {
		return new Response(null, { status: 204 });
	}

	const response = {
		message: "단일 삭제 성공",
		data: deletedTodo,
	};

	return NextResponse.json(response, { status: 201 });
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const { title, is_done } = await request.json();

	const postedTodo = await postTodo({ id: params.slug, title, is_done });
	if (postedTodo === null) {
		return new Response(null, { status: 204 });
	}
	const response = {
		message: "todo를 성공적으로 수정했습니다.",
		data: postedTodo,
	};

	return NextResponse.json(response, { status: 201 });
}

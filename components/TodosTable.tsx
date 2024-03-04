"use client";

import React, { useState } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Input,
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Spinner,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@nextui-org/react";

import { useDisclosure } from "@nextui-org/react";

import { Todo } from "@/types";
import { useRouter } from "next/navigation";
import CustomModal from "./Modal";

interface VerticalDotsIconProps {
	size?: number;
	width?: number;
	height?: number;
	[key: string]: any; // 나머지 props에 대한 타입을 정의, 필요한 경우 더 구체적인 타입으로 변경
}

const VerticalDotsIcon = ({
	size = 24,
	width,
	height,
	...props
}: VerticalDotsIconProps) => (
	<svg
		aria-hidden="true"
		fill="none"
		focusable="false"
		height={size || height}
		role="presentation"
		viewBox="0 0 24 24"
		width={size || width}
		{...props}
	>
		<path
			d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
			fill="currentColor"
		/>
	</svg>
);

export default function TodosTable({ todos }: { todos: Todo[] }) {
	const [todoAddEnable, setTodoAddEnable] = useState(false);
	const [newTodoInput, setNewTodoInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState<"detail" | "edit" | "delete">("detail");
	const [curTodo, setCurTodo] = useState<Todo>(todos[0]);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const router = useRouter();

	const PASSWORD = window?.localStorage.getItem("pass");

	const addTodoHandler = async () => {
		if (newTodoInput.length === 0) {
			return;
		}
		setIsLoading(true);
		// 브라우저에서 사용하기 위해서는 env에 Next가 붙어야 하는 특별한 규칙이 있음
		await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/`, {
			method: "post",
			body: JSON.stringify({
				title: newTodoInput,
			}),
			cache: "no-store",
		});
		setIsLoading(false);
		setNewTodoInput("");
		router.refresh(); // 서버사이드에서 fetch 해오던 데이터가 초기화됨
	};

	return (
		<>
			<div className="flex flex-col flex-wrap md:flex-nowrap gap-8 mt-10">
				{PASSWORD === process.env.NEXT_PUBLIC_PASS && (
					<div className="flex w-full flex-wrap md:flex-nowrap gap-4">
						<Input
							type="text"
							label="새로운 할일"
							value={newTodoInput}
							onValueChange={(changeInput) => {
								setNewTodoInput(changeInput);
								setTodoAddEnable(changeInput.length > 0);
							}}
						/>
						<Popover placement="top">
							<PopoverTrigger>
								<Button
									color={todoAddEnable ? "warning" : "default"}
									className="h-14"
									onClick={async () => {
										await addTodoHandler();
									}}
								>
									추가
								</Button>
							</PopoverTrigger>
							{!todoAddEnable && (
								<PopoverContent>
									<div className="px-1 py-2">
										<div className="text-small font-bold">
											입력된 값이 없습니다
										</div>
										<div className="text-tiny">할일에 대해서 작성해주세요</div>
									</div>
								</PopoverContent>
							)}
						</Popover>
					</div>
				)}

				{isLoading && <Spinner color="warning" />}
				<Table aria-label="Example static collection table">
					<TableHeader>
						<TableColumn>아이디</TableColumn>
						<TableColumn>할일 내용</TableColumn>
						<TableColumn>완료 여부</TableColumn>
						<TableColumn>생성일</TableColumn>
						<TableColumn>액션</TableColumn>
					</TableHeader>
					<TableBody emptyContent={"보여줄 데이터가 없습니다."}>
						{todos &&
							todos.map((todo: Todo) => {
								return (
									<TableRow key={todo.id}>
										<TableCell
											className={`${
												todo.is_done && "line-through text-gray-400/50"
											}`}
										>
											{todo.id.slice(0, 2)}
										</TableCell>
										<TableCell
											className={`${
												todo.is_done && "line-through text-gray-400/50"
											}`}
										>
											{todo.title}
										</TableCell>
										<TableCell
											className={`${
												todo.is_done && "line-through text-gray-400/50"
											}`}
										>
											{todo.is_done ? "완료" : "미완료"}
										</TableCell>
										<TableCell
											className={`${
												todo.is_done && "line-through text-gray-400/50"
											}`}
										>
											{`${todo.created_at}`}
										</TableCell>
										<TableCell>
											<div className="relative flex justify-end items-center gap-2">
												<Dropdown>
													<DropdownTrigger>
														<Button isIconOnly size="sm" variant="light">
															<VerticalDotsIcon
																className="text-default-300"
																width={24}
																height={24}
															/>
														</Button>
													</DropdownTrigger>
													{PASSWORD === process.env.NEXT_PUBLIC_PASS ? (
														<DropdownMenu>
															<DropdownItem
																key="detail"
																onPress={() => {
																	onOpen();
																	setCurTodo(todo);
																	setStatus("detail");
																}}
															>
																View
															</DropdownItem>
															<DropdownItem
																key="edit"
																onPress={() => {
																	onOpen();
																	setCurTodo(todo);
																	setStatus("edit");
																}}
															>
																Edit
															</DropdownItem>
															<DropdownItem
																key="delete"
																onPress={() => {
																	onOpen();
																	setCurTodo(todo);
																	setStatus("delete");
																}}
															>
																Delete
															</DropdownItem>
														</DropdownMenu>
													) : (
														<DropdownMenu>
															<DropdownItem
																key="detail"
																onPress={() => {
																	onOpen();
																	setCurTodo(todo);
																	setStatus("detail");
																}}
															>
																View
															</DropdownItem>
														</DropdownMenu>
													)}
												</Dropdown>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</div>
			<CustomModal
				todo={curTodo}
				status={status}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			/>
		</>
	);
}

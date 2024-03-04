"use client";

import React, { useState } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Switch,
	Input,
} from "@nextui-org/react";

import { Todo } from "@/types";
import { useRouter } from "next/navigation";

export default function CustomModal({
	todo,
	status,
	isOpen,
	onOpenChange,
}: {
	todo: Todo;
	isOpen: boolean;
	onOpenChange: () => void;
	status: "detail" | "edit" | "delete";
}) {
	const [isSelected, setIsSelected] = React.useState(todo.is_done);
	const [newTodoInput, setNewTodoInput] = useState(todo.title);

	const router = useRouter();

	const editTodoHandler = async () => {
		if (newTodoInput.length === 0) {
			return;
		}

		// 브라우저에서 사용하기 위해서는 env에 Next가 붙어야 하는 특별한 규칙이 있음
		await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${todo.id}`, {
			method: "post",
			body: JSON.stringify({
				title: newTodoInput,
				is_done: isSelected,
			}),
			cache: "no-store",
		});

		setNewTodoInput("");
		router.refresh(); // 서버사이드에서 fetch 해오던 데이터가 초기화됨
	};

	const deleteTodoHandler = async () => {
		// 브라우저에서 사용하기 위해서는 env에 Next가 붙어야 하는 특별한 규칙이 있음
		await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${todo.id}`, {
			method: "delete",
			cache: "no-store",
		});

		setNewTodoInput("");
		router.refresh(); // 서버사이드에서 fetch 해오던 데이터가 초기화됨
	};

	return (
		<Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						{status === "detail" && (
							<>
								<ModalHeader className="flex flex-col gap-1">
									상세 화면입니다.
								</ModalHeader>
								<ModalBody>
									<p>
										<span className="font-bold">id : </span>
										{todo.id}
									</p>
									<p>
										<span className="font-bold">할일 내용 : </span>
										{todo.title}
									</p>
									<p>
										<span className="font-bold">완료여부 : </span>
										{todo.is_done ? "완료" : "미 완료"}
									</p>
									<p>
										<span className="font-bold">생성일 : </span>
										{String(todo.created_at)}
									</p>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
										Close
									</Button>
								</ModalFooter>
							</>
						)}
						{status === "edit" && (
							<>
								<ModalHeader className="flex flex-col gap-1">
									수정하기
								</ModalHeader>
								<ModalBody>
									<p>해당 테스크를 수정합니다.</p>
									<Input
										type="text"
										label="할일을 입력해주세요"
										value={newTodoInput}
										onValueChange={(changeInput) => {
											setNewTodoInput(changeInput);
										}}
									/>
									<div className="flex flex-col gap-2">
										<Switch
											isSelected={isSelected}
											onValueChange={setIsSelected}
										>
											해당 테스크 완료 여부 설정
										</Switch>
										<p className="text-small text-default-500">
											완료여부: {isSelected ? "완료" : "미 완료"}
										</p>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
										Close
									</Button>
									<Button
										color="primary"
										onPress={async () => {
											await editTodoHandler();
											onClose();
										}}
									>
										Action
									</Button>
								</ModalFooter>
							</>
						)}
						{status === "delete" && (
							<>
								<ModalHeader className="flex flex-col gap-1">
									삭제하기
								</ModalHeader>
								<ModalBody>해당 테스크를 제거하시겠습니까?</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
										Close
									</Button>
									<Button
										color="primary"
										onPress={async () => {
											await deleteTodoHandler();
											onClose();
										}}
									>
										삭제
									</Button>
								</ModalFooter>
							</>
						)}
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

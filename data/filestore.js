import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
	collection,
	getDocs,
	doc,
	getDoc,
	setDoc,
	Timestamp,
	deleteDoc,
	updateDoc,
	query,
	orderBy,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 모든 할일 가져오기
export async function fetchTodos() {
	const todosRef = collection(db, "todos");
	const q = query(todosRef, orderBy("created_at", "desc"));
	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		return [];
	}

	const todos = [];

	querySnapshot.forEach((doc) => {
		todos.push({
			id: doc.id,
			title: doc.data()["title"],
			is_done: doc.data()["is_done"],
			created_at: doc.data()["created_at"].toDate().toLocaleTimeString("ko"),
		});
	});

	return todos;
}

// todo 추가
export async function addTodo({ title }) {
	// Add a new document with a generated id
	const newTodoRef = doc(collection(db, "todos"));

	const createdAtTimeStamp = Timestamp.fromDate(new Date());

	const data = {
		id: newTodoRef.id,
		title: title,
		is_done: false,
		created_at: createdAtTimeStamp,
	};

	await setDoc(newTodoRef, data);

	return {
		id: newTodoRef.id,
		title: title,
		is_done: false,
		created_at: createdAtTimeStamp.toDate(),
	};
}

// todo 단일 조회
export async function fetchTodo(id) {
	// Add a new document with a generated id

	if (id === null) {
		return null;
	}
	const todoDocRef = doc(db, "todos", id);

	const todoDocSnapShot = await getDoc(todoDocRef);

	if (todoDocSnapShot.exists()) {
		const fetchedTodo = {
			id: todoDocSnapShot.id,
			title: todoDocSnapShot.data()["title"],
			is_done: todoDocSnapShot.data()["is_done"],
			created_at: todoDocSnapShot.data()["created_at"].toDate(),
		};
		return fetchedTodo;
	} else {
		return null;
	}
}

// todo 단일 삭제
export async function deleteTodo(id) {
	if (id === null) {
		return null;
	}

	const fetchedTodo = await fetchTodo(id);

	if (fetchedTodo) {
		console.log("있음");
		await deleteDoc(doc(db, "todos", id));

		return fetchedTodo;
	} else {
		return null;
	}
}

// todo 단일 수정
export async function postTodo({ id, title, is_done }) {
	if (id === null) {
		return null;
	}

	const fetchedTodo = await fetchTodo(id);

	if (fetchedTodo) {
		const editTodoRef = doc(db, "todos", id);

		await updateDoc(editTodoRef, {
			title: title,
			is_done: is_done,
		});

		return fetchedTodo;
	} else {
		return null;
	}
}

module.exports = { fetchTodos, addTodo, fetchTodo, deleteTodo, postTodo };

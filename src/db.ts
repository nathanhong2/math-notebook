import { openDB, type IDBPDatabase } from 'idb';
import type { Question } from './types';

const DB_NAME = 'math-notebook';
const STORE = 'questions';

let _db: IDBPDatabase | null = null;

async function getDB() {
  if (!_db) {
    _db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      },
    });
  }
  return _db;
}

export async function getAllQuestions(): Promise<Question[]> {
  const db = await getDB();
  const all = await db.getAll(STORE);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getQuestion(id: string): Promise<Question | undefined> {
  const db = await getDB();
  return db.get(STORE, id);
}

export async function saveQuestion(q: Question): Promise<void> {
  const db = await getDB();
  await db.put(STORE, q);
}

export async function deleteQuestion(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, id);
}

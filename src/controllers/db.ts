import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import { PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT, DATABASEURL } from '../constants/constants';
import { executeQuery } from './queryExecutor';
import { queryStringOptimizer } from '../utils/queryStringOptimizer';
import { exec } from 'child_process';
interface ChapterConversation{
  chapterId: number,
  content: {
    gpt: string,
    user?: string //user is optional
  }[]
}

// insert book title in table name BOOKS
async function bookInsertion(bookTitle: string, bookLanguage: string, userId: string){
  let query = `INSERT INTO BOOKS (title,booklanguage, user_id) VALUES ('${queryStringOptimizer(bookTitle)}','${bookLanguage}', '${userId}') RETURNING book_id , title, user_id;`;
  let result = await executeQuery(query);
  return result[0]
}

async function chapterInsertion(bookId: number, chapters: string[]) {
  let query = "INSERT INTO CHAPTERS (book_id, chapter_title) VALUES ";
  for (let i = 0; i < chapters.length; i++) {
    if(i===chapters.length-1){
      query += `(${bookId}, '${queryStringOptimizer(chapters[i])}') RETURNING chapter_id as chapterId, chapter_title as chapterTitle;`;
      continue
    }
    query += `(${bookId}, '${queryStringOptimizer(chapters[i])}'),`;
  }

  let result = await executeQuery(query)
  return result
  
}

async function chapterContentInsertion(chapterDetails: ChapterConversation){
  let query = `INSERT INTO CONTENT (chapter_id, content_text) VALUES (${chapterDetails.chapterId},'${queryStringOptimizer(JSON.stringify(chapterDetails.content))}') RETURNING content_id, content_text ;`

  let result = await executeQuery(query)
  return result
}
async function chapterContentUpdate(chapterDetails: ChapterConversation){
  let query = `UPDATE CONTENT
                SET content_text = '${queryStringOptimizer(JSON.stringify(chapterDetails.content))}'
                WHERE chapter_id = ${chapterDetails.chapterId}
                RETURNING content_id, content_text;
              `
  console.log(query);
  let result = await executeQuery(query)
  return result
}
async function getAllBooksOfUser(userId: string){
  let query = `SELECT * FROM BOOKS WHERE user_id = '${userId}';`
  let result = await executeQuery(query)
  return result
}

async function getBookChaptersByBookId(query: string){
  let result = await executeQuery(query)
  return result
};

async function getChapterDataByChapterId(chapterId: number){
  let query = `SELECT * FROM CONTENT WHERE chapter_id = ${chapterId};`
  let result = await executeQuery(query)
  return result
};

async function getChapterConversationByChapterId(chapterId: number){
  let query = `SELECT * FROM CONTENT WHERE chapter_id = ${chapterId};`
  let result = await executeQuery(query)
  return result;
}

async function getBookByBookIdAndUserId(bookId: number, userId: string){
  let query = `SELECT
                  B.book_id AS bookId,
                  B.title AS bookTitle,
                  B.booklanguage AS bookLanguage,
                  B.user_id AS userId,
                  C.chapter_id AS chapterId,
                  C.chapter_title AS chapterTitle,
                  Co.content_id AS contentId,
                  Co.content_text AS contentText
                 FROM Books B
                  INNER JOIN Chapters C
                  ON B.book_id = C.book_id
                  LEFT JOIN Content Co
                  ON C.chapter_id = Co.chapter_id
                  WHERE B.user_id = '${userId}'
                    AND B.book_id = ${bookId};`
  let result = await executeQuery(query);
  return result;
}


export {getChapterConversationByChapterId,getBookByBookIdAndUserId, bookInsertion, chapterInsertion, ChapterConversation,chapterContentInsertion, getAllBooksOfUser,getBookChaptersByBookId, getChapterDataByChapterId,chapterContentUpdate};

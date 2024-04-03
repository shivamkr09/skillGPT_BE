import { Router, Request, Response } from "express";
import {
  syllabusGenerator,
  SyllabusConfig,
  ChapterConfig,
  chapterGenerator,
} from "../controllers/gptController";
// import { getPgVersion  } from "../controllers/db";

const router: Router = Router();

router.post("/syllabus", async (req: Request, res: Response) => {
  let syllabus: SyllabusConfig = req.body;
  let syllabusTopics = await syllabusGenerator(syllabus);
  res.json({ chapters: syllabusTopics, topic: syllabus.bookTopic });


  // res.json({
  //   chapters: [
  //     "Exploración espacial",
  //     "Los planetas del sistema solar",
  //     "Agujeros negros y agujeros de gusano",
  //     "Historia de la astronomía",
  //     "Vida en el espacio",
  //     "Tecnología espacial",
  //     "El origen del universo",
  //     "Viajes interestelares",
  //     "Misterios del cosmos.",
  //   ],
  //   topic: "Space",
  // });
});

router.post("/chapter", async (req: Request, res: Response) => {
  let chapter: ChapterConfig = req.body;
  let chapterContent = await chapterGenerator(chapter);
  // res.setHeader("Content-Type", "text/html");
  res.json({msg: chapterContent})
  // res.send(chapterContent);
  // const content=`# Exploración espacial\n' +
  // '\n' +
  // 'La exploración espacial es la actividad que involucra la investigación, observación y viajes más allá de la Tierra, hacia el espacio exterior. Esta fascinante empresa ha impulsado el desarrollo de tecnologías avanzadas y ha permitido expandir nuestro conocimiento sobre el universo.\n' +
  // '\n' +
  // 'La exploración espacial se ha llevado a cabo a través de misiones tripuladas y no tripuladas. Las misiones tripuladas, como el programa Apolo de la NASA, han permitido a los astronautas caminar en la Luna y vivir a bordo de estaciones espaciales como la Estación Espacial Internacional (EEI). Por otro lado, las misiones no tripuladas, como las sondas espaciales Voyager, han explorado planetas distantes y transmitido información valiosa sobre nuestro sistema solar.\n' +
  // '\n' +
  // 'Un hito significativo en la exploración espacial fue la llegada de la sonda espacial Perseverance a Marte en febrero de 2021. Esta misión tenía como objetivo buscar signos de vida pasada en el planeta rojo y preparar el terreno para futuras misiones tripuladas.\n' +
  // '\n' +
  // 'Además de la exploración de planetas y cuerpos celestes, la exploración espacial también incluye la observación de la Tierra desde el espacio. Satélites como el Landsat de la NASA han proporcionado datos cruciales sobre el clima, la vegetación y los recursos naturales de nuestro planeta, contribuyendo significativamente a la investigación científica.\n' +
  // '\n' +
  // 'En resumen, la exploración espacial ha sido fundamental para expandir nuestro entendimiento del universo y ha inspirado a generaciones a seguir explorando los límites del espacio.`
  // res.json({msg:content});
});

export default router;

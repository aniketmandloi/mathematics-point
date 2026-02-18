import { protectedProcedure, publicProcedure, router } from "../index";
import { chapterRouter } from "./chapter";
import { contentRouter } from "./content";
import { courseRouter } from "./course";
import { paymentRouter } from "./payment";
import { studentRouter } from "./student";
import { userRouter } from "./user";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  user: userRouter,
  course: courseRouter,
  chapter: chapterRouter,
  content: contentRouter,
  student: studentRouter,
  payment: paymentRouter,
});
export type AppRouter = typeof appRouter;

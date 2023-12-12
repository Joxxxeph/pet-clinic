import cors from 'cors';

export const enableCors = (app, accepteOrigins) => {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (accepteOrigins.includes(origin)) {
          return callback(null, true);
        }
        if (!origin) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
    })
  );
};

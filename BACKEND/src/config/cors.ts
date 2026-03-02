import cors from "cors";

export const corsConfig = {
    origin: (origin, callback) => {
        const whiteList = [process.env.FRONTEND_URL]
        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}
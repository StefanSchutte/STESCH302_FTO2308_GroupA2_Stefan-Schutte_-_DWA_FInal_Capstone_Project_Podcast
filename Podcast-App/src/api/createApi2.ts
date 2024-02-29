import z from "zod";

export type Api = {
    getMoviesList: () => Promise<
        | Error
        | {
        id: number;
        title: string;
        actors: number;
        release: Date;
        image: string;
    }[]
    >;
};

const schema = z.array(
    z.object({
        id: z.number(),
        title: z.string().nonempty(),
        actors: z.number(),
        release: z.string(),
        image: z.string(),
    })
);

const URL = "https://podcast-api.netlify.app/shows";

const getMoviesList: Api["getMoviesList"] = () => {
    const result = fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Something went wrong. Try again later.");
            }
            return response;
        })
        .then((response) => response.json())
        .then((data) => schema.parse(data))
        .then((data) => {
            const result = data.map((item) => ({
                ...item,
                release: new Date(item.release),
            }));

            return result;
        })
        .catch((err) => {
            console.error(err);
            return err;
        });

    return result;

};

export const createApi = (): Api => {
    return {
        getMoviesList,
    };
};

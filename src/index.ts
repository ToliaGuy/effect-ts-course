import { Effect, Console } from "effect";


const fetchRequest = (url: string) => Effect.promise(() => fetch(url));
const jsonResponse = (response: Response) => Effect.promise(() => response.json());





const main = Effect.flatMap(
    Effect.flatMap(
        fetchRequest("https://pokeapi.co/api/v2/pokemon/garchomp/"),
        jsonResponse
    ),
    (json) => Console.log(json)
)


Effect.runPromise(main)
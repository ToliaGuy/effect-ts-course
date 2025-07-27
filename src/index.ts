import { Effect, Console } from "effect";


const fetchRequest = (url: string) => Effect.tryPromise(() => fetch(url));
const jsonResponse = (response: Response) => Effect.tryPromise(() => response.json());





const main = Effect.flatMap(
    Effect.flatMap(
        fetchRequest("https://pokeapi.co/api/v2/pokemon/garchomp/"),
        jsonResponse
    ),
    (json) => Console.log(json)
)


Effect.runPromise(main)
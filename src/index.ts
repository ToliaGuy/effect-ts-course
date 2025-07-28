import { Effect, Console, Data  } from "effect";



class FetchError extends Data.TaggedError("FetchError"){}

class JsonError extends Data.TaggedError("JsonError") {}


const fetchRequest = (url: string) => Effect.tryPromise({
    try: () => fetch(url),
    catch: () => new FetchError()
});
const jsonResponse = (response: Response) => Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError()
});





const main = fetchRequest("https://pokeapi.co/api/v2/pokemon/garchomp/")
    .pipe(
        Effect.filterOrFail(
            (response) => response.ok,
            () => new FetchError()
        ),
        Effect.flatMap(jsonResponse),
        Effect.catchTags({
            FetchError: () => Effect.succeed("Fetch error"),
            JsonError: () => Effect.succeed("Json error")
        })
    )


Effect.runPromise(main).then(console.log)







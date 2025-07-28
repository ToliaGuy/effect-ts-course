import { Effect, Console, Data, gen  } from "effect";



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


const program = Effect.gen(function* () {
    const response = yield* fetchRequest("https://pokeapi.co/api/v2/pokemon/garchomp/")
    if (!response.ok) {
        return yield* new FetchError()
    }
    return yield* jsonResponse(response)
})


const main = program.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed("Fetch error"),
        JsonError: () => Effect.succeed("Json error")
    })
)

Effect.runPromise(main).then(console.log)







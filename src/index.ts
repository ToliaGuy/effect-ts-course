import { Effect, Console, Data, Schema  } from "effect";


class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
    id: Schema.Number,
    order: Schema.Number,
    name: Schema.String,
    height: Schema.Number,
    weight: Schema.Number,
}) {}


const decodePokemon = Schema.decodeUnknown(Pokemon);


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
    const json = yield* jsonResponse(response)
    return yield* decodePokemon(json)
})


const main = program.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed("Fetch error"),
        JsonError: () => Effect.succeed("Json error"),
        ParseError: () => Effect.succeed("Parse error")
    })
)

Effect.runPromise(main).then(console.log)







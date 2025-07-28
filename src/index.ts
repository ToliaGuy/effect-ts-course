import { Effect, Console, Data, Schema, Context, ParseResult  } from "effect";


class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
    id: Schema.Number,
    order: Schema.Number,
    name: Schema.String,
    height: Schema.Number,
    weight: Schema.Number,
}) {}


class FetchError extends Data.TaggedError("FetchError"){}

class JsonError extends Data.TaggedError("JsonError") {}


interface PokeApiImpl {
    readonly getPokemon: Effect.Effect<
      Pokemon,
      FetchError | JsonError | ParseResult.ParseError
    >;
  }
  
export class PokeApi extends Context.Tag("PokeApi")<PokeApi, PokeApiImpl>() {
    static readonly Live = PokeApi.of({
        getPokemon: Effect.gen(function* () {
        const response = yield* Effect.tryPromise({
            try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
            catch: () => new FetchError()
        });

        if (!response.ok) {
            return yield* new FetchError();
        }

        const json = yield* Effect.tryPromise({
            try: () => response.json(),
            catch: () => new JsonError(),
        });

        return yield* Schema.decodeUnknown(Pokemon)(json);
        }),
    });
  }



const program = Effect.gen(function* () {
    const pokeApi = yield* PokeApi;
    return yield* pokeApi.getPokemon;
  });

const runnable = program.pipe(Effect.provideService(PokeApi, PokeApi.Live));





const main = runnable.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed("Fetch error"),
        JsonError: () => Effect.succeed("Json error"),
        ParseError: () => Effect.succeed("Parse error")
    })
)

Effect.runPromise(main).then(console.log)







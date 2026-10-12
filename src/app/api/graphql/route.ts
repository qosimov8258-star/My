import { createSchema, createYoga, type YogaInitialContext } from "graphql-yoga";
import { prisma } from "@/lib/prisma";

type GraphQLContext = YogaInitialContext & { prisma: typeof prisma };

const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type Query {
      health: String!
    }
  `,
  resolvers: {
    Query: {
      health: () => "ok",
    },
  },
});

const { handleRequest } = createYoga({
  schema,
  context: (initialContext): GraphQLContext => ({ ...initialContext, prisma }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

function handler(request: Request) {
  return handleRequest(request, {});
}

export { handler as GET, handler as POST, handler as OPTIONS };

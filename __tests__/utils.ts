import { GraphQLClient } from "graphql-request"

// const client = new GraphQLClient((process.env.GRAPHQL_URL as string), {
//   headers: {
//     authorization: `Bearer ${process.env.AccessToken}`,
//   },
// })

const client = new GraphQLClient(process.env.GRAPHQL_URL as string)

export const makeGraphQLRequest = async (
    query: string,
    variables: {},
    accessToken: string
) => {
    client.setHeader("authorization", `Bearer ${accessToken}`)
    try {
        return await client.request(query, variables)
    } catch (error) {
        console.log(error)
        throw error;
    }
}
import * as given from "../../steps/given"
import * as when from "../../steps/when"
import * as then from "../../steps/then"

import Chance from 'chance'
const chance = new Chance() 

describe("Graphql/Appsync Todo operation", () => {
    let user: any = null;
    beforeAll(async () => {
        user = await given.an_authenticated_user()
    })
    it("UserId and title should be saved in TodosTable", async() => {
        const title = chance.sentence({ words: 5 })
        const todoData = {
            UserID: user.username,
            title: title
        }
        const createTodoResponse = await when.we_invoke_create_todo(user, todoData)
        // const todoId = createTodoResponse.data.createTodo.id
        const todoId = createTodoResponse.TodoID
        const ddbUser = await then.todo_exists_in_TodoTable(user.username, todoId)
        expect(ddbUser.UserID).toMatch(todoData.UserID)
        expect(ddbUser.title).toMatch(todoData.title)
    })
})
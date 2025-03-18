import * as given from "../../steps/given"
import * as when from "../../steps/when"
import * as then from "../../steps/then"

describe("User Authentication flow test", () => {
    it("When a User SignUp, his/her detail should be saved into dynamodb Users table", async() => {
        const { name, email, password } = given.a_random_user();
        const userSub = await when.a_user_signs_up(email, password, name);
        const ddbUser = await then.user_exists_in_UsersTable(userSub);
        expect(ddbUser.UserID).toMatch(userSub);
    })
});

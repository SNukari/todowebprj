import { expect } from "chai"

describe("Testuing database functionality", () => {
    it("should pass", async () => {
        const response = await fetch("http://localhost:3001/")
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an("array").that.is.not.empty
        expect(data[0]).to.include.keys("id", "description")
    })
    it("should create a new task", async () => {
        const newTask = { description: "test task"}
        const response = await fetch("http://localhost:3001/create", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: newTask })
    })
    const data = await response.json()
    expect(response.status).to.equal(201)
    expect(data).to.include.all.keys(["id", "description"])
    expect(data.descrtiption).to.equal(newTask.description)
})
    it("should delete a task", async () => {
        const response = await fetch("http://localhost:3001/delete/1", {
            method: "delete"
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.include.keys("id")
    })
    it("should not create a new task without description", async () => {
        const response = await fetch("http://localhost:3001/create", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: null})
    })
    const data = await response.json()
    expect(response.status).to.equal(400)
    expect(data).to.include.keys("error")
})
})
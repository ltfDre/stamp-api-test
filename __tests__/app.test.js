const fetch = require("node-fetch");
const API_ROOT = "http://localhost:3000/api";

// Endpoint: GET /
describe("GET /", () => {
  let app;
  beforeEach(() => {
    app = require("../app")();
  });

  afterEach(() => {
    app.close();
  });

  it("should return data", async () => {
    const response = await fetch("http://localhost:3000");
    const data = await response.text();

    expect(data).toEqual("Hello Testing API");
  });

  it("should return 200", async () => {
    const response = await fetch("http://localhost:3000");
    expect(response.status).toEqual(200);
  });
});

// Endpoint: GET /api/stamps
describe("GET /api/stamps", () => {
  let app;
  beforeEach(() => {
    app = require("../app")();
  });

  afterEach(() => {
    app.close();
  });

  it("Verify that the API starts with an empty store.", async () => {
    const response = await fetch(`${API_ROOT}/stamps`);
    const data = await response.json();

    expect(data).toEqual([]);
  });
});

// Endpoint: PUT /api/stamps
describe("PUT /api/stamps", () => {
  let app;
  beforeEach(() => {
    app = require("../app")();
  });

  afterEach(() => {
    app.close();
  });

  it("Verify title is required field", async () => {
    const response = await fetch(`${API_ROOT}/stamps`, {
      method: "PUT",
      body: JSON.stringify({
        author: "LtfDre"
      }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

    expect(response.status).toEqual(400);
    expect(data.error).toEqual("Field 'title' is required");
  });

  it("Verify author is required field", async () => {
    const response = await fetch(`${API_ROOT}/stamps`, {
      method: "PUT",
      body: JSON.stringify({
        title: "LtfDre"
      }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

    expect(response.status).toEqual(400);
    expect(data.error).toEqual("Field 'author' is required");
  });

  it("Verify title cannot be empty.", async () => {
    const response = await fetch(`${API_ROOT}/stamps`, {
      method: "PUT",
      body: JSON.stringify({
        author: "LtfDre",
        title: ""
      }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

    expect(response.status).toEqual(400);
    expect(data.error).toEqual("Field 'title' cannot be empty");
  });

  it("Verify author cannot be empty.", async () => {
    const response = await fetch(`${API_ROOT}/stamps`, {
      method: "PUT",
      body: JSON.stringify({
        title: "LtfDre",
        author: ""
      }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

    expect(response.status).toEqual(400);
    expect(data.error).toEqual("Field 'author' cannot be empty");
  });

  it("Verify that the id field is read−only.", async () => {
    const response = await fetch(`${API_ROOT}/stamps`, {
      method: "PUT",
      body: JSON.stringify({
        id: 1,
        title: "LtfDre",
        author: "LtfDre"
      }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

    expect(response.status).toEqual(400);
    expect(data.error).toEqual("Field 'id' is read-only");
  });

  it("Verify that you can create a new stamp via PUT.", async () => {
    let response = await fetch(`${API_ROOT}/stamps`, {
      method: "PUT",
      body: JSON.stringify({
        title: "Title",
        author: "Author"
      }),
      headers: { "Content-Type": "application/json" }
    });
    let data = await response.json();

    expect(response.status).toEqual(201);
    expect(data.error).toBeUndefined();
    expect(data.title).toEqual("Title");
    expect(data.author).toEqual("Author");

    response = await fetch(`${API_ROOT}/stamps/${data.id}`);
    data = await response.json();

    expect(response.status).toEqual(200);
    expect(data.title).toEqual("Title");
    expect(data.author).toEqual("Author");
  });

  it("Verify that you cannot create a duplicate stamp.", async () => {
    await fetch(`${API_ROOT}/stamps`, {
      method: "PUT",
      body: JSON.stringify({
        title: "Title",
        author: "Author"
      }),
      headers: { "Content-Type": "application/json" }
    });

    const response = await fetch(`${API_ROOT}/stamps`, {
      method: "PUT",
      body: JSON.stringify({
        title: "Title",
        author: "Author"
      }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

    expect(response.status).toEqual(400);
    expect(data.error).toBe(
      "Another stamp with similar title and author already exists"
    );
  });
});

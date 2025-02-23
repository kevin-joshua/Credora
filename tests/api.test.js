import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1"; // Base URL without "users"
let token = "";
let userId = "";
let expenseId ="67ba324c52cefe81fdd55d4d";
let companyId = "67b9fa4b6264c6d899659d96"; 
let categoryId;
let budgetId;
const random = Math.floor(Math.random()*10000);

// User API Test Suite
describe("User API Endpoints", () => {
  // Signup Test
  test("Should sign up a new user", async () => {
    
    const response = await axios.post(`${BASE_URL}/users/signup`, {
      
      name: "Test User",
      email: `testuser${random}ran@example.com`,
      password: "password123",
      role: "Admin"
    });

    expect(response.status).toBe(201);
   

   
  });

  // Login Test
  test("Should log in an existing user", async () => {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email: "testuser@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("token");

    token = response.data.token;
    userId = response.data.user._id;
  });

  // Get User Profile Test
  test("Should fetch the logged-in user's profile", async () => {
    const response = await axios.get(`${BASE_URL}/users/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    
  });

  // Update User Test
  test("Should update user profile", async () => {
    const response = await axios.put(
      `${BASE_URL}/users/update/${userId}`,
      { name: "Updated User" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(200);
   
  });

  // Unauthorized Profile Access Test
  test("Should fail to fetch profile without token", async () => {
    try {
      await axios.get(`${BASE_URL}/users/profile/${userId}`);
    } catch (error) {
      expect(error.response.status).toBe(401); // Unauthorized
    }
  });

  // Unauthorized Update Test
  test("Should fail to update user without token", async () => {
    try {
      await axios.put(`${BASE_URL}/users/update/${userId}`, { name: "Hacked Name" });
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });
});


// describe("Budget API Endpoints", () => {
//   beforeAll(async () => {
//     // Log in and get a token
//     const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
//       email: "testuser@example.com",
//       password: "password123",
//     });

//     token = loginResponse.data.token;
//   });

//   test("Should create a new budget", async () => {
//     const response = await axios.post(
//       `${BASE_URL}/budget/create`,
//       { companyId: '67b9fa4b6264c6d899659d96', amount: 50000, },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     expect(response.status).toBe(201);
//     expect(response.data).toHaveProperty("_id");
//     budgetId = response.data._id;
//   });

//   test("Should fetch all budgets for a company", async () => {
//     const response = await axios.get(`${BASE_URL}/budget/company/${companyId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.data)).toBe(true);
//   });

//   test("Should update a budget", async () => {
//     const response = await axios.put(
//       `${BASE_URL}/budget/update/${budgetId}`,
//       { budget: 60000 },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     expect(response.status).toBe(200);
//     expect(response.data.budget).toBe(60000);
//   });

//   test("Should delete a budget", async () => {
//     const response = await axios.delete(
//       `${BASE_URL}/budget/delete/${budgetId}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
  
//     expect(response.status).toBe(200);
//     expect(response.data.message).toBe("Budget deleted successfully");
//   });
  

//   test("Should fail to create a budget without a token", async () => {
//     try {
//       await axios.post(`${BASE_URL}/budget/create`, { company: companyId, budget: 50000 });
//     } catch (error) {
//       expect(error.response.status).toBe(401);
//     }
//   });

//   afterAll(async () => {
//     // If using Mongoose
//     await mongoose.connection.close();
  
//     // If using another DB connection, close it
//     // db.end();  // For SQL-based databases
//   });
// });


describe("Company API Endpoints", () => {
  beforeAll(async () => {
    // Log in and get a token
    const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
      email: "testuser@example.com",
      password: "password123",
    });

    token = loginResponse.data.token;
  });

  test("Should create a new company", async () => {
    const response = await axios.post(
      `${BASE_URL}/company/create`,
      { name: `Test Company${random}` },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("companyId");
    companyId = response.data.companyId;
  });

  test("Should fetch a company by ID", async () => {
    const response = await axios.get(`${BASE_URL}/company/profile/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data._id).toBe(companyId);
  });

  test("Should update a company", async () => {
    const response = await axios.put(
      `${BASE_URL}/company/update/${companyId}`,
      { name: "Updated Company Name" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(200);
    expect(response.data.name).toBe("Updated Company Name");
  });

  test("Should delete a company", async () => {
    const response = await axios.delete(`${BASE_URL}/company/delete/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Company deleted successfully");
  });

  test("Should fail to create a company without a token", async () => {
    try {
      await axios.post(`${BASE_URL}/company/create`, { name: "Unauthorized Company" });
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });

  test("Should fail to fetch a company with an invalid ID", async () => {
    try {
      await axios.get(`${BASE_URL}/company/profile/invalidcompanyid`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      expect(error.response.status).toBe(400); // Assuming 400 for invalid ID
    }
  });
});

describe("Category API Endpoints", () => {
  beforeAll(async () => {
    // Log in and get a token
    const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
      email: "testuser@example.com",
      password: "password123",
    });

    token = loginResponse.data.token;
  });

  test("Should create a new category", async () => {
    const response = await axios.post(
      `${BASE_URL}/category/create`,
      { name: `Test Category${random}` },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("_id");
    categoryId = response.data._id;
  });

  test("Should fetch all categories", async () => {
    const response = await axios.get(`${BASE_URL}/category/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test("Should fail to create a category without a token", async () => {
    try {
      await axios.post(`${BASE_URL}/category/create`, { name: "Unauthorized Category" });
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });

  test("Should fetch all categories without a token (assuming it's public)", async () => {
    const response = await axios.get(`${BASE_URL}/category/all`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test("Should fail to create a category with an empty name", async () => {
    try {
      await axios.post(
        `${BASE_URL}/category/create`,
        { name: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      expect(error.response.status).toBe(400); // Assuming 400 for invalid data
    }
  });
});

describe("Expense API Endpoints", () => {
  beforeAll(async () => {
    // Log in and get a token
    const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
      email: "testuser@example.com",
      password: "password123",
    });
  
      const response = await axios.post(
        `${BASE_URL}/category/create`,
        { name: `Test Category${random}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      categoryId = response.data._id;

  });

  test("Should create a new expense", async () => {
    const response = await axios.post(
      `${BASE_URL}/expense/create`,
      {
        companyId: companyId,
        category: categoryId,
        amount: 500,
        description: `Test expense${random}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("_id");
    expenseId = response.data._id;
  });

  test("Should fetch all expenses for a company", async () => {
    const response = await axios.get(`${BASE_URL}/expense/company/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test("Should update an expense", async () => {
    const response = await axios.put(
      `${BASE_URL}/expense/update/${expenseId}`,
      { amount: 700 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(200);
    // expect(response.data.amount).toBe(700);
  });

  test("Should delete an expense", async () => {
    const response = await axios.delete(`${BASE_URL}/expense/delete/${expenseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Expense deleted successfully");
  });

  test("Should fail to create an expense without a token", async () => {
    try {
      await axios.post(`${BASE_URL}/expense/create`, {
        company: companyId,
        amount: 500,
        description: "Unauthorized Expense",
      });
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });

  test("Should fail to fetch expenses with an invalid company ID", async () => {
    try {
      await axios.get(`${BASE_URL}/expense/company/invalidcompanyid`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      expect(error.response.status).toBe(400); // Assuming 400 for invalid ID
    }
  });
});



const express = require("express");
const cors = require("cors");
const sdk = require("node-appwrite");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// New route for the main page
app.get("/", (req, res) => {
  res.send("Hello, World!"); // Sending "Hello, World!" message
});

app.get("/api/home", async (req, res) => {
  try {
    const {
      databaseId,
      collectionId,
      appwriteEndpoint,
      appwriteProjectId,
    } = req.query;

    if (
      !databaseId ||
      !collectionId ||
      !appwriteEndpoint ||
      !appwriteProjectId
    ) {
      return res.status(400).json({ error: "All parameters are required." });
    }

    const appwriteClient = new sdk.Client()
      .setEndpoint(appwriteEndpoint)
      .setProject(appwriteProjectId);

    const databases = new sdk.Databases(appwriteClient);
    const documents = [];
    let page = 1;
    let totalDocuments = 0;

    // Fetch all documents using pagination
    do {
      const response = await databases.listDocuments(
        databaseId,
        collectionId,
        null,
        null,
        null,
        page,
        100 // You can adjust the limit based on your needs
      );

      documents.push(...response.documents);
      totalDocuments = response.sum;

      page++;
    } while (documents.length < totalDocuments);

    const formattedData = documents.map((document) => {
      return Object.fromEntries(
        Object.entries(document).map(([key, value]) => [key, [value]])
      );
    });

    res.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: error.message }); // Sending error message in response
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;

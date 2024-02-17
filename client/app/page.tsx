"use client";
import React, { ReactNode, useState } from "react";
import ReactMarkdown from "react-markdown";

const Home = () => {
  // State declarations
  const [databaseId, setDatabaseId] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [appwriteEndpoint, setAppwriteEndpoint] = useState("");
  const [appwriteProjectId, setAppwriteProjectId] = useState("");
  const [appwriteProjectKey, setAppwriteProjectKey] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/home?databaseId=${databaseId}&collectionId=${collectionId}&appwriteEndpoint=${appwriteEndpoint}&appwriteProjectId=${appwriteProjectId}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch data");
      } 

      setData(result.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);

      // Log the error and display an error message to the user
      alert("Error fetching data:" + (error as Error).message);

      setLoading(false);
    }
  };
  

  // Download data as CSV
  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      `${Object.keys(data[0]).join(",")}\n` +
      data
        .map((item) =>
          Object.values(item)
            .map(
              (value) => `"${(value as string).toString().replace(/"/g, '""')}"`
            )
            .join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exported_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Render Markdown for a table cell
  const renderMarkdownCell = (value: any): ReactNode => {
    const stringValue = String(value);
    return <ReactMarkdown>{stringValue}</ReactMarkdown>;
  };

  return (
    <main className="flex min-h-screen flex-col items-center pt-24 space-y-8">
      <div className="flex flex-col items-center font-mono font-bold bg-white shadow-lg p-12 rounded-md">
        {/* Appwrite Endpoint Input */}
        <div className="mb-4">
          <label
            htmlFor="appwriteEndpoint"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Appwrite Endpoint:
          </label>
          <input
            type="text"
            id="appwriteEndpoint"
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-500"
            value={appwriteEndpoint}
            onChange={(e) => setAppwriteEndpoint(e.target.value)}
          />
        </div>

        {/* Appwrite Project ID Input */}
        <div className="mb-4">
          <label
            htmlFor="appwriteProjectId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Appwrite Project ID:
          </label>
          <input
            type="text"
            id="appwriteProjectId"
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-500"
            value={appwriteProjectId}
            onChange={(e) => setAppwriteProjectId(e.target.value)}
          />
        </div>
        {/* Database ID Input */}
        <div className="mb-4 mt-4">
          <label
            htmlFor="databaseId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Database ID:
          </label>
          <input
            type="text"
            id="databaseId"
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-500"
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
          />
        </div>

        {/* Collection ID Input */}
        <div className="mb-4 mt-4">
          <label
            htmlFor="collectionId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Collection ID:
          </label>
          <input
            type="text"
            id="collectionId"
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-blue-500"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
          />
        </div>
      </div>

      {/* Fetch Data and Download CSV buttons */}
      <div className="flex flex-col justify-center items-center">
        <button
          className="bg-blue-500 text-white py-2 px-8 rounded hover:bg-blue-700 focus:outline-none my-6"
          onClick={fetchData}
        >
          Fetch Data
        </button>
        <button
          className={`bg-[#DA1A5B] text-white py-2 px-8 rounded hover:bg-[#DA1A5B] focus:outline-none ${
            data.length === 0 ? "opacity-60 cursor-not-allowed" : ""
          }`}
          onClick={downloadCSV}
          disabled={data.length === 0}
        >
          Download CSV
        </button>
      </div>

      {/* Display Data Table or Message */}
      <div className="w-[90%] h-[600px] shadow-xl p-12 border-x-black">
        <div className="w-full h-full overflow-auto">
          {loading ? (
            <p>Loading...</p>
          ) : data.length > 0 ? (
            // Data Table with Markdown values
            <table className="min-w-full border border-gray-300">
              {/* Table Header */}
              <thead className="bg-gray-200">
                <tr>
                  {Object.keys(data[0]).map((key, index) => (
                    <th key={index} className="border p-2">
                      {renderMarkdownCell(key)}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {data.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(item).map((value, colIndex) => (
                      <td key={colIndex} className="border p-2">
                        {renderMarkdownCell(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Message when no data
            <p className="bg-white shadow-none p-8 rounded-md w-full">
              Please enter your database and collection ID to retrieve or
              extract your data :)
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;

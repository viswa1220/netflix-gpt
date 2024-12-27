import React, { useState } from "react";

const CSVUpload = () => {
  const [csvFile, setCsvFile] = useState(null);

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = () => {
    if (csvFile) {
      console.log("Uploading CSV:", csvFile.name);
      // Add logic to process the CSV file, e.g., upload to backend or parse data
    } else {
      console.error("No CSV file selected");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 shadow-md rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Upload Products via CSV</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvChange}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <button
          onClick={handleCsvUpload}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Upload CSV
        </button>
      </div>
      {csvFile && (
        <p className="text-gray-600 mt-2 break-words text-sm sm:text-base">
          Selected File: {csvFile.name}
        </p>
      )}
    </div>
  );
};

export default CSVUpload;

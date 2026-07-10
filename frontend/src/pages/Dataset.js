import React, { useState } from "react";
import axios from "axios";
import "../styles/style.css";
import { Navigate } from "react-router-dom";

const Dataset = () => {
  const [preview, setPreview] = useState([]);
  const [columns, setColumns] = useState([]);
  const [uploadedName, setUploadedName] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("Select CSV");
      return;
    }

    const formData = new FormData();

    formData.append("dataset_name", file.name);

    formData.append("dataset_file", file);

    try {
      const upload = await axios.post(
        "http://127.0.0.1:8000/api/energy/datasets/",
        formData,
      );

      const id = upload.data.id;
      localStorage.setItem("datasetId", id);

      const previewData = await axios.get(
        `http://127.0.0.1:8000/api/energy/datasets/${id}/preview/`,
      );

      setColumns(previewData.data.columns);

      setPreview(previewData.data.preview);
      const datasetArray = [
        previewData.data.columns,
        ...previewData.data.full_dataset.map((row) =>
          previewData.data.columns.map((col) => row[col]),
        ),
      ];

      localStorage.setItem("dataset", JSON.stringify(datasetArray));

      alert("Dataset Uploaded Successfully");
      setUploadedName(file.name);
    } catch (err) {
  

      alert("Upload Failed");
    }
  };
  if (!localStorage.getItem("access")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="content">
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,.08)",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h2>📂 Upload Energy Dataset</h2>

        <p>
          Upload your CSV dataset to perform energy analysis, forecasting and
          recommendations.
        </p>

        <input type="file" accept=".csv" onChange={handleUpload} />
      </div>

      <br />
      <br />
      {uploadedName && (
        <div className="upload-success">
          ✅ Dataset Uploaded Successfully
          <br />
          <span>{uploadedName}</span>
        </div>
      )}
      <h3 style={{ marginBottom: "15px" }}>
        Showing first 10 rows of uploaded dataset
      </h3>
      {preview.length > 0 && (
        <table className="preview-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {preview.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  <footer className="footer">Smart Energy Analytics System © 2026</footer>;
};

export default Dataset;

import React from "react";
import { Link } from "react-router-dom";    

import { useEffect, useState } from "react";

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/dashboard", {
        credentials: "include",
        headers :{
          Accept: "application/json",
        },
      });
      if(res.status === 401) {
        console.warn("Not logged in, redirecting...");
        window.location.href = "/login";
        return;
      }
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched dashboard data:", data);
        setFolders(data.folders || []);
        setFiles(data.files || []);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      const res = await fetch("http://localhost:3000/delete-file", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ fileId }),
      });
  
      if (res.ok) {
        setFiles(prev => prev.filter(file => file.id !== fileId));
      } else {
        console.error("Failed to delete file");
      }
    } catch (err) {
      console.error("Error deleting file:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📂 Your Dashboard</h1>

        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Folders</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {folders?.length === 0 ? (
              <p className="text-gray-600">No folders found.</p>
            ) : (
              folders?.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                >
                  <Link to={`/folder/${folder.id}`} className="text-blue-600 hover:underline">
                    📁 {folder.name}
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        
        <section>
          <h2 className="text-xl font-semibold mb-2">Files</h2>
          <div className="space-y-4">
            {files.length === 0 ? (
              <p className="text-gray-600">No files uploaded.</p>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                >
                  <span className="text-gray-800">{file.filename}</span>
                  <div className="space-x-2">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                    <a
                      href={file.fileUrl}
                      download
                      className="text-green-500 hover:underline"
                    >
                      Download
                    </a>
                    
                      <input type="hidden" name="fileId" value={file.id} />
                      <button
                        type="submit"
                        className="text-red-500 hover:underline"
                        onClick={()=>handleDelete(file.id)}
                      >
                        Delete
                      </button>
                    
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <br /><br />
        <div className="flex justify-center">
          <Link
            to="/Upload"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Add New File
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

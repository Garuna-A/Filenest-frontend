import { useState, useEffect } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  
  useEffect(() => {
    const fetchFolders = async () => {
      const res = await fetch("http://localhost:3000/folder-list", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders);
      }
    };
    fetchFolders();
  }, []);


  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName) return;

    const res = await fetch("http://localhost:3000/folder", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ folderName: newFolderName }),
    });

    if (res.ok) {
      const data = await res.json();
      setFolders((prev) => [...prev, data.folder]);
      setSelectedFolderId(data.folder.id); 
      setNewFolderName("");
    } else {
      console.error("Failed to create folder");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("myFile", file);
    if (selectedFolderId) {
      formData.append("folderId", selectedFolderId);
    }

    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      console.log("Upload success");
      setFile(null);
    } else {
      console.log("Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md mb-8"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Upload a File</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="cursor-pointer border border-black-300 rounded w-full mb-4"
          required
        />

        <label className="block mb-2">Choose Folder (Optional):</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={selectedFolderId}
          onChange={(e) => setSelectedFolderId(e.target.value)}
        >
          <option value="">No Folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
        >
          Upload
        </button>
      </form>

      <form
        onSubmit={handleCreateFolder}
        className="bg-white shadow rounded px-8 pt-4 pb-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-2 text-center">Create New Folder</h3>
        <input
          type="text"
          placeholder="Folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Create Folder
        </button>
      </form>
    </div>
  );
}

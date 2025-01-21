import { useState, useEffect } from "react";
import axios from "axios";
import WordCard from "../components/WordCard";

export default function Home() {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  // Persist token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch words when token changes
  useEffect(() => {
    const fetchWords = async () => {
      if (!token) return;
      try {
        const res = await axios.get("/api/words/getWords", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWords(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchWords();
  }, [token]);

  const handleRegister = async () => {
    try {
      const res = await axios.post("/api/auth/register", { email, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setWords([]);
    alert("Logged out successfully");
  };
  const handleAddWord = async () => {
    if (!token) {
      alert("You must be logged in to add words");
      return;
    }
    try {
      const synonymList = synonyms
        ? synonyms.split(",").map((syn) => syn.trim())
        : [];
      const res = await axios.post(
        "/api/words/addWord",
        { word: newWord, definition, synonyms: synonymList },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addedWord = {
        word: newWord, // Ensure we are passing the right word
        definition: definition || "No definition provided",
        synonyms: synonymList,
        dateAdded: res.data.dateAdded
          ? new Date(res.data.dateAdded).toLocaleDateString()
          : "Unknown Date",
      };

      // Immediately update the words state to include the new word
      setWords((prevWords) => [...prevWords, addedWord]);

      // Clear input fields after adding the word
      setNewWord("");
      setDefinition("");
      setSynonyms("");
    } catch (err) {
      console.error(err);
      alert("Failed to add word");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Dictionary</h1>
      {!token ? (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Login or Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRegister}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Register
            </button>
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div className="mb-4">
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <input
                type="text"
                placeholder="New Word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="border p-2 flex-1"
              />
              <input
                type="text"
                placeholder="Definition"
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                className="border p-2 flex-1"
              />
              <input
                type="text"
                placeholder="Synonyms (comma-separated)"
                value={synonyms}
                onChange={(e) => setSynonyms(e.target.value)}
                className="border p-2 flex-1"
              />
            </div>
            <button
              onClick={handleAddWord}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Word
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {words.map((word, index) => (
              <WordCard
                key={index}
                word={word.word || "Unknown"}
                definition={word.definition || "No definition provided"}
                synonyms={Array.isArray(word.synonyms) ? word.synonyms : []}
                dateAdded={word.dateAdded || "Unknown Date"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

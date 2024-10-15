import React, { useState, useEffect } from "react";
import { Bell, Users, Upload, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherHome: React.FC = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [studentScores, setStudentScores] = useState<
    { name: string; subject: string; score: number }[]
  >([]);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    media: { type: "", url: "" },
  });
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch announcements and student scores from the backend
    setAnnouncements([
      "Grading deadline approaching",
      "Faculty meeting next Monday",
    ]);
    setStudentScores([
      { name: "Alice", subject: "Math", score: 85 },
      { name: "Bob", subject: "Science", score: 92 },
      { name: "Charlie", subject: "History", score: 78 },
    ]);
  }, []);

  const handleQuestionUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/questions", newQuestion);
      console.log("Question uploaded:", response.data);
      // Reset form after successful upload
      setNewQuestion({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        media: { type: "", url: "" },
      });
    } catch (error) {
      console.error("Error uploading question:", error);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith("image/") ? "image" : "video";
      const url = URL.createObjectURL(file);
      setNewQuestion({ ...newQuestion, media: { type, url } });
    }
  };
  const handleLogout = () => {
    // TODO: Implement logout functionality
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <LogOut className="mr-2" size={18} />
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bell className="mr-2" /> Announcements
          </h2>
          <ul className="space-y-2">
            {announcements.map((announcement, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded">
                {announcement}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2" /> Student Scores
          </h2>
          <ul className="space-y-2">
            {studentScores.map((score, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded"
              >
                <span>
                  {score.name} - {score.subject}
                </span>
                <span className="font-bold">{score.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Upload className="mr-2" /> Upload Question
        </h2>
        <form onSubmit={handleQuestionUpload}>
          <textarea
            className="w-full p-2 border rounded-md mb-4"
            rows={4}
            value={newQuestion.text}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, text: e.target.value })
            }
            placeholder="Enter your question here..."
          ></textarea>
          {newQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="flex-grow p-2 border rounded-md mr-2"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <input
                type="radio"
                name="correctAnswer"
                checked={newQuestion.correctAnswer === index}
                onChange={() =>
                  setNewQuestion({ ...newQuestion, correctAnswer: index })
                }
              />
            </div>
          ))}
          <div className="mb-4">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="mb-2"
            />
            {newQuestion.media.url && (
              <div className="mt-2">
                {newQuestion.media.type === "image" ? (
                  <img
                    src={newQuestion.media.url}
                    alt="Question media"
                    className="max-w-full h-auto"
                  />
                ) : (
                  <video
                    src={newQuestion.media.url}
                    controls
                    className="max-w-full h-auto"
                  />
                )}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Upload Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherHome;

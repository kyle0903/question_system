import React, { useState, useEffect } from "react";
import { Book, Award, Bell } from "lucide-react";
import axios from "axios";

interface Question {
  id: string;
  text: string;
  options: string[];
  media: { type: string; url: string };
}

const StudentHome: React.FC = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [scores, setScores] = useState<{ subject: string; score: number }[]>(
    []
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const announcementsRes = await axios.get(
          "http://localhost:8081/api/announcements"
        );
        const scoresRes = await axios.get("http://localhost:8081/api/scores");
        const questionsRes = await axios.get(
          "http://localhost:8081/api/questions"
        );
        setAnnouncements(announcementsRes.data);
        setScores(scoresRes.data);
        setQuestions(questionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
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
            <Award className="mr-2" /> Score Records
          </h2>
          <ul className="space-y-2">
            {scores.map((score, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded"
              >
                <span>{score.subject}</span>
                <span className="font-bold">{score.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Book className="mr-2" /> Examination Area
        </h2>
        {currentQuestion ? (
          <div>
            <p className="mb-4">{currentQuestion.text}</p>
            {currentQuestion.media.url && (
              <div className="mb-4">
                {currentQuestion.media.type === "image" ? (
                  <img
                    src={currentQuestion.media.url}
                    alt="Question media"
                    className="max-w-full h-auto"
                  />
                ) : (
                  <video
                    src={currentQuestion.media.url}
                    controls
                    className="max-w-full h-auto"
                  />
                )}
              </div>
            )}
            <ul className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-left p-2 rounded ${
                      selectedAnswer === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
            >
              Next Question
            </button>
          </div>
        ) : (
          <p>
            No active exams at the moment. Check back later for upcoming tests.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentHome;

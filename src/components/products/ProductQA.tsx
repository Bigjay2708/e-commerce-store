import Image from "next/image";
"use client";
import { useState } from "react";
import { FaQuestionCircle, FaThumbsUp, FaUser, FaCheckCircle, FaUserShield } from "react-icons/fa";
import Link from "next/link";
import UserAvatar from "@/components/user/UserAvatar";
import { useSocialStore } from "@/store/social";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";

interface ProductQAProps {
  productId: number;
}

export default function ProductQA({ productId }: ProductQAProps) {
  const { data: session } = useSession();
  const {
    getProductQuestions,
    addQuestion,
    addAnswer,
    likeQuestion,
    likeAnswer
  } = useSocialStore();

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [answerForms, setAnswerForms] = useState<{ [key: string]: string }>({});

  const questions = getProductQuestions(productId);
  const userId = session?.user?.email ?? 'anonymous';

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error('Please enter a question');
      return;
    }

    addQuestion({
      productId,
      userId: userId ?? 'anonymous',
      userName: session?.user?.name || 'Anonymous User',
      userAvatar: session?.user?.image ?? undefined,
      question: questionText
    });

    setQuestionText('');
    setShowQuestionForm(false);
    toast.success('Question submitted successfully!');
  };

  const handleSubmitAnswer = (questionId: string) => {
    const answerText = answerForms[questionId];
    if (!answerText?.trim()) return;

    addAnswer(questionId, {
      questionId,
      userId: userId ?? 'anonymous',
      userName: session?.user?.name || 'Anonymous User',
      userAvatar: session?.user?.image ?? undefined,
      answer: answerText,
      isExpert: Math.random() > 0.7, // Simulate expert answers
      isSeller: Math.random() > 0.8   // Simulate seller answers
    });

    setAnswerForms({ ...answerForms, [questionId]: '' });
    toast.success('Answer submitted!');
  };

  const handleLikeQuestion = (questionId: string) => {
    likeQuestion(questionId, userId);
  };

  const handleLikeAnswer = (questionId: string, answerId: string) => {
    likeAnswer(questionId, answerId, userId);
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Questions & Answers
        </h3>
        <Button
          variant="primary"
          onClick={() => setShowQuestionForm(!showQuestionForm)}
        >
          Ask a Question
        </Button>
      </div>

      {/* Question Form */}
      {showQuestionForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h4 className="text-lg font-semibold mb-4">Ask Your Question</h4>
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Question</label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                rows={3}
                placeholder="What would you like to know about this product?"
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" variant="primary">
                Submit Question
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuestionForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FaQuestionCircle className="mx-auto text-4xl text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No questions yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to ask a question about this product
            </p>
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              {/* Question */}
              <div className="mb-4">
                <div className="flex items-start space-x-3 mb-3">
                  <Link href={`/users/${question.userId || ''}`} className="flex items-center space-x-3 group">
                    <UserAvatar src={question.userAvatar} alt={question.userName} size={32} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white group-hover:underline">
                          {question.userName}
                        </span>
                        <span className="text-sm text-gray-500">
                          asked {new Date(question.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <FaQuestionCircle className="text-blue-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">
                          {question.question}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="flex items-center justify-between ml-11">
                  <button
                    onClick={() => handleLikeQuestion(question.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      question.likes.includes(userId)
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <FaThumbsUp />
                    <span>Helpful ({question.likes.length})</span>
                  </button>
                  <span className="text-sm text-gray-500">
                    {question.answers.length} answer{question.answers.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Answers */}
              {question.answers.length > 0 && (
                <div className="ml-11 space-y-4 mb-4">
                  {question.answers.map((answer) => (
                    <div
                      key={answer.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-green-500"
                    >
                      <div className="flex items-start space-x-3">
                        {answer.userAvatar ? (
                          <Image
                            src={answer.userAvatar}
                            alt={answer.userName}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <FaUser className="w-6 h-6 text-gray-400 p-1" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {answer.userName}
                            </span>
                            {answer.isSeller && (
                              <div className="flex items-center space-x-1 text-blue-600">
                                <FaUserShield className="text-xs" />
                                <span className="text-xs">Seller</span>
                              </div>
                            )}
                            {answer.isExpert && (
                              <div className="flex items-center space-x-1 text-purple-600">
                                <FaCheckCircle className="text-xs" />
                                <span className="text-xs">Expert</span>
                              </div>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(answer.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {answer.answer}
                          </p>
                          <button
                            onClick={() => handleLikeAnswer(question.id, answer.id)}
                            className={`flex items-center space-x-1 text-xs transition-colors ${
                              answer.likes.includes(userId)
                                ? 'text-blue-600'
                                : 'text-gray-500 hover:text-blue-600'
                            }`}
                          >
                            <FaThumbsUp />
                            <span>Helpful ({answer.likes.length})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Form */}
              <div className="ml-11">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={answerForms[question.id] || ''}
                    onChange={(e) => setAnswerForms({ ...answerForms, [question.id]: e.target.value })}
                    placeholder="Write an answer..."
                    className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSubmitAnswer(question.id)}
                    disabled={!answerForms[question.id]?.trim()}
                  >
                    Answer
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

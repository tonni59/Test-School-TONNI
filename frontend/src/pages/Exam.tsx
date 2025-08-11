import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetQuestionsQuery, useSubmitAnswersMutation } from "../store/rtkApi";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "./Exam.css";
import CertificatePage from "./CertificatePage";

type Q = { _id: string; text: string; options: string[] };

export default function Exam() {
  const { step } = useParams();
  const stepNum = Number(step || 1);
  const { data, error, isLoading } = useGetQuestionsQuery(stepNum);
  const [submit, { isLoading: submitting }] = useSubmitAnswersMutation();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState<number>(60 * 44);
  const [submitted, setSubmitted] = useState(false);
  const [showNextPrompt, setShowNextPrompt] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [examStarted, setExamStarted] = useState(false);

  const userId =
    useSelector((state: RootState) => state.auth?.user?.id) || "anonymous";
  const username =
    useSelector((state: RootState) => state.auth?.user?.name) || "Student";

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setShowNextPrompt(false);
    setExamStarted(false);
    setTimer(data?.questions?.length ? 60 * data.questions.length : 0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [step, data]);

  useEffect(() => {
    if (data?.questions?.length) {
      setTimer(60 * data.questions.length);
    }
  }, [data]);

  useEffect(() => {
    if (!examStarted || intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [examStarted]);

  useEffect(() => {
    if (timer === 0 && !submitted && examStarted) {
      handleSubmit(true);
    }
  }, [timer]);

  function pick(qid: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  }

  async function handleSubmit(isAuto = false) {
    if (submitted) return;
    setSubmitted(true);
    const body = {
      answers: Object.entries(answers).map(([questionId, chosenIndex]) => ({
        questionId,
        chosenIndex,
      })),
      step: stepNum,
      userId,
    };
    try {
      const res = await submit(body).unwrap();
      setResult(res);
      if (res.certificateLevel && /Proceed/i.test(res.certificateLevel)) {
        setShowNextPrompt(true);
      }
    } catch (err: any) {
      alert(
        err?.data?.message || (isAuto ? "Auto-submit failed" : "Submit failed")
      );
    }
  }

  function handleNextStep(agree: boolean) {
    if (agree) {
      const nextStep = Math.min(3, stepNum + 1);
      navigate(`/exam/${nextStep}`);
    } else {
      navigate("/thank-you");
    }
  }

  if (isLoading) return <div className="exam-status">Loading...</div>;
  if (error)
    return <div className="exam-status error">Error fetching questions</div>;

  return (
    <div className="exam-container">
      <h2 className="exam-title">Step {stepNum} - Exam</h2>

      {!examStarted && !submitted && (
        <div className="start-exam-container">
          <p className="start-exam-text">
            Click the button below to start your exam. The timer will begin as
            soon as you start.
          </p>
          <button
            className="start-exam-btn"
            onClick={() => setExamStarted(true)}
          >
            Start Exam
          </button>
        </div>
      )}

      {examStarted && !showNextPrompt && (
        <>
          <div className="exam-timer">
            Timer: {Math.floor(timer / 60)}:
            {(timer % 60).toString().padStart(2, "0")}
          </div>

          <div className="exam-questions">
            {data?.questions?.map((q: Q, i: number) => (
              <div key={q._id} className="exam-question">
                <div className="question-text">
                  {i + 1}. {q.text}
                </div>
                <div className="question-options">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`option ${
                        answers[q._id] === idx ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        disabled={submitted}
                        checked={answers[q._id] === idx}
                        onChange={() => pick(q._id, idx)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="exam-actions">
            <button
              onClick={() => handleSubmit(false)}
              className="exam-submit-btn"
              disabled={submitted || submitting}
            >
              {submitting
                ? "Submitting..."
                : submitted
                ? "Submitted"
                : "Submit"}
            </button>
          </div>
        </>
      )}

      {result && !showNextPrompt && (
        <div className="exam-result">
          <h3>Result</h3>
          <p>
            Total: {result.total}, Correct: {result.correct}, Percent:{" "}
            {Math.round(result.percent)}%
          </p>
          <p>Certificate: {result.certificateLevel}</p>

          {result.certUrl && (
            <button
              className="cert-link"
              onClick={() => navigate(`/certificate/${stepNum}`)}
            >
              View &amp; Download Certificate
            </button>
          )}

          {result.lifetimeCertUrl && (
            <a
              href={result.lifetimeCertUrl}
              target="_blank"
              rel="noreferrer"
              className="cert-link"
            >
              Download Lifetime Certificate (PDF)
            </a>
          )}

          {result.emailSent && (
            <div className="email-message">
              📩 Your certificate has been sent to your registered email
              address.
            </div>
          )}
        </div>
      )}

      {showNextPrompt && result && (
        <div className="exam-result">
          <h3>Congratulations!</h3>
          <p>
            You scored <strong>{result.correct}</strong> out of{" "}
            <strong>{result.total}</strong> ({Math.round(result.percent)}%).
          </p>
          <p>
            You are eligible to proceed to Step {stepNum + 1} for your final
            professional's valid lifetime certificate.
          </p>
          <p>Do you want to continue?</p>
          <div className="next-step-buttons">
            <button
              className="exam-submit-btn"
              onClick={() => handleNextStep(true)}
            >
              Yes
            </button>
            <button
              className="exam-submit-btn decline"
              onClick={() => handleNextStep(false)}
            >
              No
            </button>
          </div>

          {result.certUrl && (
            <div className="certificate-preview">
              <h4>Your Step {stepNum} Certificate</h4>
              <CertificatePage
                cert={{
                  step: stepNum,
                  username,
                  totalScore: result.total,
                  percent: Math.round(result.percent),
                  certificateLevel: result.certificateLevel,
                }}
                handleNextStep={() => handleNextStep(true)}
              />
            </div>
          )}

          {stepNum === 3 && result.lifetimeCertUrl && (
            <div className="certificate-preview lifetime">
              <h4>🏆 Your Lifetime Professional Certificate</h4>
              <iframe
                src={result.lifetimeCertUrl}
                title="Lifetime Certificate Preview"
                width="100%"
                height="500px"
                style={{
                  border: "4px solid gold",
                  marginTop: "20px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                }}
              />
              <a
                href={result.lifetimeCertUrl}
                target="_blank"
                rel="noreferrer"
                className="cert-link gold-link"
              >
                Download Lifetime Certificate (PDF)
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

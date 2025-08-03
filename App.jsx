import { useState, useEffect } from 'react';
import axios from 'axios';
import { Allotment } from "allotment";
import AceEditor from "react-ace";

import "allotment/dist/style.css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
import './App.css';

const problems = {
  "1": {
    title: "1. Add Two Numbers",
    description: "Given two integer inputs `a` and `b`, return their sum.",
    defaultCode: `function solve(a, b) {\n  // Your code here\n  return a + b;\n}`
  },
  "2": {
    title: "2. Multiply Two Numbers",
    description: "Given two integer inputs `a` and `b`, return their product.",
    defaultCode: `function solve(a, b) {\n  // Your code here\n  return a * b;\n}`
  },
};

function App() {
  const [selectedProblemId, setSelectedProblemId] = useState('1');
  const [code, setCode] = useState(problems['1'].defaultCode);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCode(problems[selectedProblemId].defaultCode);
    setSubmissionResult(null);
    setError('');
  }, [selectedProblemId]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setSubmissionResult(null);
    setError('');

    const userCode = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

    try {
      await new Promise(res => setTimeout(res, 500)); // Simulate delay
      const response = await axios.post('http://localhost:3001/submit', {
        pid: selectedProblemId,
        code: userCode,
      });
      setSubmissionResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultContent = () => {
    if (isLoading) {
      return <div className="status-message loading">Executing...</div>;
    }
    if (error) {
      return <div className="status-message error">Error: {error}</div>;
    }
    if (submissionResult) {
        const failedCase = submissionResult.results.find(r => !r.passed);
        const isRuntimeError = failedCase && failedCase.errorMessage;

        if (submissionResult.allPassed) {
            return <div className="status-message accepted">✅ Accepted: All test cases passed!</div>;
        } else if (isRuntimeError) {
            return <div className="status-message error">❌ Runtime Error: <pre>{failedCase.errorMessage}</pre></div>;
        } else {
            return <div className="status-message wrong-answer">❌ Wrong Answer on Test Case #{submissionResult.results.indexOf(failedCase) + 1}</div>;
        }
    }
    return <div className="status-message">Click "Run" to see the results.</div>
  };

  const selectedProblem = problems[selectedProblemId];

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo">CodeJudge</h1>
        <select
          className="problem-selector"
          value={selectedProblemId}
          onChange={(e) => setSelectedProblemId(e.target.value)}
        >
          {Object.entries(problems).map(([id, { title }]) => (
            <option key={id} value={id}>{title}</option>
          ))}
        </select>
      </header>

      <Allotment>
        <Allotment.Pane minSize={400}>
          <div className="panel problem-panel">
            <h2>{selectedProblem.title}</h2>
            <p>{selectedProblem.description}</p>
          </div>
        </Allotment.Pane>

        <Allotment.Pane>
          <Allotment vertical>
            <Allotment.Pane>
              <div className="panel editor-panel">
                <AceEditor
                  mode="javascript"
                  theme="tomorrow_night_eighties"
                  name="code-editor"
                  onChange={setCode}
                  value={code}
                  fontSize={14}
                  showPrintMargin={false}
                  width="100%"
                  height="100%"
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </div>
            </Allotment.Pane>
            <Allotment.Pane preferredSize={250} minSize={100} snap>
              <div className="panel results-panel">
                <div className="results-header">
                  <h3>Console</h3>
                  <button onClick={handleSubmit} disabled={isLoading} className="submit-btn">
                    {isLoading ? 'Running...' : 'Run'}
                  </button>
                </div>
                <div className="results-content">
                  {renderResultContent()}
                </div>
              </div>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default App;

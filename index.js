    const express = require('express');
    const cors=require('cors')
    const app = express();

    app.use(cors())
    app.use(express.json());

    const problems = {
    "1": {
        title: "Add Two Numbers",
        description: "Given two numbers, return their sum.",
        testCases: [
        { input: [1, 2], expectedOutput: 3 },
        { input: [10, 20], expectedOutput: 30 },
        { input: [0, 0], expectedOutput: 0 },
        { input: [-5, 5], expectedOutput: 0 },
        ],
    },
    "2": {
        title: "Multiply Two Numbers",
        description: "Given two numbers, return their product.",
        testCases: [
        { input: [2, 3], expectedOutput: 6 },
        { input: [10, 5], expectedOutput: 50 },
        { input: [0, 100], expectedOutput: 0 },
        { input: [-4, 5], expectedOutput: -20 },
        ],
    },
    };

    const executeCode = (userCode, input) => {
    const fn = new Function('a', 'b', userCode);
    return fn(...input);
    };

    const judge = (userCode, testCases) => {
    const results = [];
    let allPassed = true;

    for (const testCase of testCases) {
        let output = null;
        let passed = false;
        let errorMessage = null;

        try {
        output = executeCode(userCode, testCase.input);
        passed = output === testCase.expectedOutput;
        if (!passed) allPassed = false;
        } catch (error) {
        passed = false;
        allPassed = false;
        errorMessage = error.message;
        }

        results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        output: output,
        passed: passed,
        errorMessage: errorMessage,
        });
    }
    return { results, allPassed };
    };

    app.post('/submit', (req, res) => {
    const { code, pid } = req.body;

    if (!code || !pid) {
        return res.status(400).json({ error: 'Code and problem ID are required.' });
    }

    const problem = problems[pid];
    if (!problem) {
        return res.status(404).json({ error: 'Problem not found.' });
    }

    const { results, allPassed } = judge(code, problem.testCases);


        res.json({
            success: true,
            message: allPassed ? 'All test cases passed!' : 'Some test cases failed.',
            allPassed: allPassed,
            results: results,
        });
    });

    app.listen(3001, () => {
        console.log(`Server running at :- http://localhost:3001`);
    });
import { QuizQuestion } from '../types';

export const MOCK_ASSESSMENT_QUESTIONS: QuizQuestion[] = [
  // Question 1: HTML & Accessibility
  {
    id: 'mock-q1',
    pillarId: 'web-foundations',
    difficulty: 'Easy',
    question: 'A junior engineer replaces an accessible `<button>` with `<div class="btn" onclick="submitForm()">`. Why will this fail an automated accessibility & keyboard audit?',
    options: [
      'Div elements cannot receive CSS styling in mobile browsers.',
      'Div elements are not focusable via Tab and do not respond to Enter/Space keypresses without explicit tabindex and keydown listeners.',
      'The onclick attribute only executes inside form tags.',
      'Div elements trigger automatic page reload unless preventDefault is attached.',
    ],
    correctOptionIndex: 1,
    explanation: 'Native `<button>` elements have built-in accessibility roles, automatically receive Tab focus, and trigger click events on Enter and Space keys. Generic divs require manual `tabindex="0"`, `role="button"`, and keyboard handlers.',
    distractorNotes: 'Divs can be styled fine and onclick works, but native keyboard ergonomics and accessibility tree exposure are absent.',
    screeningContext: 'Standard screening question for Frontend & Web UI engineering internships.',
  },

  // Question 2: CSS Layout & Stacking
  {
    id: 'mock-q2',
    pillarId: 'web-foundations',
    difficulty: 'Medium',
    question: 'What is the computed width of an element with `width: 300px; padding: 20px; border: 5px solid black;` when `box-sizing: content-box` (the default) is active?',
    options: [
      '300px',
      '325px',
      '350px',
      '275px',
    ],
    correctOptionIndex: 2,
    explanation: 'Under `content-box`, total width = declared width (300px) + left/right padding (40px) + left/right border (10px) = 350px. Modern development uses `box-sizing: border-box` to prevent this inflation.',
    distractorNotes: 'Only with `border-box` does the total element width remain locked at 300px.',
    screeningContext: 'Classic box model CSS assessment trap.',
  },

  // Question 3: Event Loop Execution Order
  {
    id: 'mock-q3',
    pillarId: 'js-async',
    difficulty: 'Medium',
    question: 'What will be the console output order for this JavaScript snippet?',
    codeSnippet: `console.log('alpha');
setTimeout(() => console.log('beta'), 0);
Promise.resolve().then(() => console.log('gamma'));
console.log('delta');`,
    language: 'javascript',
    options: [
      'alpha -> beta -> gamma -> delta',
      'alpha -> delta -> gamma -> beta',
      'alpha -> delta -> beta -> gamma',
      'gamma -> alpha -> delta -> beta',
    ],
    correctOptionIndex: 1,
    explanation: '1. "alpha" (synchronous call stack) -> 2. "delta" (synchronous call stack) -> 3. "gamma" (microtask queue emptied immediately after stack clears) -> 4. "beta" (macrotask queue executed on next loop tick).',
    distractorNotes: 'setTimeout(0) does not run immediately; it must wait behind all pending microtasks in the queue.',
    screeningContext: 'Asked in over 70% of FAANG / Big Tech early career phone screens.',
  },

  // Question 4: JavaScript Closures & Scope
  {
    id: 'mock-q4',
    pillarId: 'js-async',
    difficulty: 'Medium',
    question: 'What gets logged to the console when running the following loop?',
    codeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 50);
}`,
    language: 'javascript',
    options: [
      '0, 1, 2',
      '3, 3, 3',
      'undefined, undefined, undefined',
      '0, 0, 0',
    ],
    correctOptionIndex: 1,
    explanation: 'Because `var` is function-scoped (not block-scoped), a single shared `i` variable is mutated. By the time the 50ms timer callbacks fire from the macrotask queue, `i` has incremented to 3, logging 3 three times. Replacing `var` with block-scoped `let` logs 0, 1, 2.',
    distractorNotes: 'Classic lexical scope problem solved by ES6 `let` or closure IIFEs.',
    screeningContext: 'Universal JavaScript technical screening question.',
  },

  // Question 5: Promise.all vs Rejection
  {
    id: 'mock-q5',
    pillarId: 'js-async',
    difficulty: 'Medium',
    question: 'You execute `Promise.all([p1, p2, p3])`. p1 succeeds in 100ms, p2 rejects with an Error in 50ms, and p3 succeeds in 200ms. What happens?',
    options: [
      'Promise.all waits 200ms for p3 to finish, then returns all successes ignoring p2.',
      'Promise.all rejects immediately at 50ms with the error from p2 (fail-fast behavior).',
      'Promise.all resolves with an array containing the Error object at index 1.',
      'Promise.all automatically retries p2 until it succeeds.',
    ],
    correctOptionIndex: 1,
    explanation: 'Promise.all is strictly fail-fast. As soon as any single promise rejects, the entire aggregate promise immediately rejects with that rejection reason.',
    distractorNotes: 'If you want all results regardless of failure, use `Promise.allSettled()`.',
    screeningContext: 'HackerRank & Triplebyte async concurrency test.',
  },

  // Question 6: Python Mutable Defaults
  {
    id: 'mock-q6',
    pillarId: 'python-backend',
    difficulty: 'Medium',
    question: 'What is the output of the following Python program?',
    codeSnippet: `def add_tag(tag, tags=[]):
    tags.append(tag)
    return tags

print(add_tag('dev'))
print(add_tag('ai'))`,
    language: 'python',
    options: [
      "['dev'] then ['ai']",
      "['dev'] then ['dev', 'ai']",
      "Raises SyntaxError",
      "['ai'] then ['dev']",
    ],
    correctOptionIndex: 1,
    explanation: 'In Python, default arguments are created once when the function definition is executed, NOT dynamically per call. The list `tags=[]` is shared state across calls.',
    distractorNotes: 'Idiomatic Python pattern: `def add_tag(tag, tags=None): if tags is None: tags = []`.',
    screeningContext: 'The canonical Python screening gotcha tested across fintech & startups.',
  },

  // Question 7: Python Time Complexity & Data Structures
  {
    id: 'mock-q7',
    pillarId: 'python-backend',
    difficulty: 'Easy',
    question: 'What is the average time complexity of checking membership (`if key in collection:`) in a Python `dict` vs a Python `list`?',
    options: [
      'dict is O(N); list is O(1)',
      'dict is O(1); list is O(N)',
      'Both are O(log N)',
      'Both are O(N)',
    ],
    correctOptionIndex: 1,
    explanation: 'Python dicts and sets use hash tables with O(1) average lookup. Lists require a linear scan O(N) to inspect elements.',
    distractorNotes: 'Using a set or dict is the primary optimization in Two Sum and frequency counter interview questions.',
    screeningContext: 'Core algorithmic complexity screening question.',
  },

  // Question 8: RESTful Architecture & Idempotence
  {
    id: 'mock-q8',
    pillarId: 'python-backend',
    difficulty: 'Medium',
    question: 'In HTTP REST API design, which of the following methods is NOT idempotent (i.e., making identical requests multiple times produces different state)?',
    options: [
      'GET',
      'PUT',
      'DELETE',
      'POST',
    ],
    correctOptionIndex: 3,
    explanation: 'POST is non-idempotent; sending multiple identical POST requests typically creates multiple distinct resource instances. GET, PUT, and DELETE are idempotent by specification.',
    distractorNotes: 'PUT replaces an entire resource (repeated calls result in the same state). DELETE on an already deleted resource still results in the resource remaining deleted.',
    screeningContext: 'Standard REST backend engineering interview assessment.',
  },

  // Question 9: NumPy Vectorization & Array Memory
  {
    id: 'mock-q9',
    pillarId: 'ml-ai',
    difficulty: 'Medium',
    question: 'Why are NumPy vectorized operations significantly faster than standard Python `for` loops over lists?',
    options: [
      'NumPy converts all numbers to string representations in memory.',
      'NumPy ndarrays store data in contiguous C-level memory buffers and execute operations via pre-compiled SIMD machine instructions without Python interpreter overhead.',
      'NumPy automatically uploads data to remote GPU cloud clusters.',
      'Python for-loops run in separate background browser threads.',
    ],
    correctOptionIndex: 1,
    explanation: 'NumPy avoids Python dynamic type checking, pointer dereferencing, and garbage collector overhead by storing homogeneous data contiguously and leveraging low-level vector processor instructions (SIMD/BLAS).',
    distractorNotes: 'NumPy executes locally on CPU (unless CuPy is used); the speedup comes from cache locality and C-level loops.',
    screeningContext: 'Essential Machine Learning & Data Engineering screening concept.',
  },

  // Question 10: Machine Learning Evaluation Metrics
  {
    id: 'mock-q10',
    pillarId: 'ml-ai',
    difficulty: 'Hard',
    question: 'A fraud detection model evaluates 10,000 transactions. Only 10 are actually fraudulent. The model flags 20 transactions as fraud, of which 8 are truly fraudulent. What is the model\'s Precision for fraud?',
    options: [
      '80% (8 / 10)',
      '40% (8 / 20)',
      '99.8% (9,980 / 10,000)',
      '50% (10 / 20)',
    ],
    correctOptionIndex: 1,
    explanation: 'Precision = True Positives / Total Predicted Positives = 8 / 20 = 0.40 (40%). (Note: The Recall is 8 / 10 = 80%).',
    distractorNotes: '80% is the Recall. 40% is the Precision. Raw accuracy would be misleadingly high (99.8%).',
    screeningContext: 'High-frequency quantitative screening question for AI & ML candidates.',
  },

  // Question 11: Machine Learning Data Splitting
  {
    id: 'mock-q11',
    pillarId: 'ml-ai',
    difficulty: 'Medium',
    question: 'What is the primary danger of applying Min-Max scaling or Z-score standardization to an entire dataset before splitting it into train and test sets?',
    options: [
      'The data will become complex numbers.',
      'Data leakage: Test set distribution parameters (mean/max) influence the training process, causing over-optimistic evaluation results that fail in production.',
      'Scikit-learn will throw a compile-time dimensional mismatch error.',
      'The model weights become strictly negative.',
    ],
    correctOptionIndex: 1,
    explanation: 'Fitting a scaler on the entire dataset incorporates test distribution information into training data. The scaler must always be fit ONLY on the training split, then applied via `.transform()` to the test split.',
    distractorNotes: 'Data leakage is a fatal flaw in machine learning pipelines.',
    screeningContext: 'Critical ML system design and screening test question.',
  },

  // Question 12: Modern Full-Stack API Integration
  {
    id: 'mock-q12',
    pillarId: 'js-async',
    difficulty: 'Medium',
    question: 'When submitting a JSON payload to a Python FastAPI backend using browser `fetch()`, which header MUST be included for the server to parse the body as JSON rather than raw text?',
    options: [
      "'Accept': 'text/html'",
      "'Content-Type': 'application/json'",
      "'Authorization': 'JSON'",
      "'Cache-Control': 'no-store'",
    ],
    correctOptionIndex: 1,
    explanation: 'The `Content-Type: application/json` header informs the backend server and its body parser (e.g., Pydantic or FastAPI request body handler) to deserialize the raw string as JSON.',
    distractorNotes: 'Without this header, backend frameworks may treat the body as form data or raw bytes.',
    screeningContext: 'Basic full-stack client-server integration screening check.',
  },
];

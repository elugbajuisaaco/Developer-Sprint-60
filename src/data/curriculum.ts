import { WeekCurriculum } from '../types';

export const CURRICULUM_DATA: WeekCurriculum[] = [
  // ==========================================
  // WEEK 1: Web Foundations - Semantic HTML5 & DOM
  // ==========================================
  {
    weekNumber: 1,
    pillarId: 'web-foundations',
    pillarTitle: 'Web Foundations',
    title: 'Semantic HTML5 & Document Tree Architecture',
    subtitle: 'Structuring production web apps with accessible semantic landmarks and DOM nodes.',
    estimatedHours: 6,
    xpReward: 250,
    topics: ['Semantic Tags (<header>, <nav>, <main>, <article>)', 'Form Elements & Validation', 'DOM Tree Traversal', 'Accessibility (ARIA roles)'],
    lessons: [
      {
        id: 'w1-l1',
        weekNumber: 1,
        title: 'Semantic HTML Architecture vs <div> Soup',
        summary: 'How screen readers, search engines, and browser accessibility trees interpret proper landmarks instead of nested generic div tags.',
        readTimeMinutes: 4,
        internshipTip: 'Internship screeners frequently penalize candidates who replace button elements with clickable divs without keyboard access or ARIA roles.',
        language: 'html',
        codeSnippet: `<!-- Accessible, Semantic Layout -->
<header class="site-header">
  <nav aria-label="Primary navigation">
    <a href="#dashboard">Dashboard</a>
    <a href="#curriculum">Syllabus</a>
  </nav>
</header>
<main id="main-content">
  <article>
    <h1>Modern Semantic Architecture</h1>
    <p>Semantic tags expose landmarks directly to the accessibility tree.</p>
  </article>
</main>
<footer>
  <small>&copy; 2026 DevSprint 60</small>
</footer>`,
        explanationPoints: [
          '<main> must only appear once per rendered document as the top-level unique content container.',
          '<article> represents self-contained syndicated content; <section> represents a thematic chapter.',
          'Always use native <button> instead of <div onclick> to automatically gain Tab focus and Space/Enter firing.',
        ],
        outputSimulation: 'Accessible landmarks registered: [header: banner], [nav: navigation], [main: main], [footer: contentinfo]',
        interactiveSandbox: {
          language: 'html',
          initialCode: `<header class="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-sm">
  <span class="font-bold text-cyan-400">InternPortal</span>
  <nav class="space-x-3 text-slate-400">
    <a href="#" class="hover:text-white">Home</a>
    <a href="#" class="hover:text-white">Roadmap</a>
  </nav>
</header>
<main class="p-4 space-y-2">
  <h1 class="text-lg font-bold text-white">Semantic Document Preview</h1>
  <p class="text-xs text-slate-300">Notice how native tags structure the accessibility hierarchy naturally.</p>
</main>`,
        },
      },
      {
        id: 'w1-l2',
        weekNumber: 1,
        title: 'DOM Event Propagation: Bubbling & Event Delegation',
        summary: 'Understanding how events bubble up through parents and why delegating listeners to a single ancestor improves performance and saves memory.',
        readTimeMinutes: 5,
        internshipTip: 'A classic LeetCode/Front-end question asks: "If you render 10,000 table rows with click handlers, how do you prevent browser memory exhaustion?" The answer is always Event Delegation on the parent container.',
        language: 'javascript',
        codeSnippet: `// Event Delegation Pattern
const list = document.querySelector('#action-list');

list.addEventListener('click', (event) => {
  // Capture clicks specifically on delete buttons
  const target = event.target.closest('button[data-action="delete"]');
  if (!target) return;

  const itemId = target.dataset.id;
  console.log(\`Deleted item ID: \${itemId}\`);
});`,
        explanationPoints: [
          'Events default to Phase 3: Bubbling (target -> ancestor -> body -> document).',
          'event.target is the innermost clicked node; event.currentTarget is the node listening.',
          'event.stopPropagation() halts bubbling upward; event.preventDefault() cancels browser defaults (e.g., form submit refresh).',
        ],
        outputSimulation: '[Click on button #item-42] -> Event bubbles to #action-list -> target captured -> "Deleted item ID: 42"',
      },
    ],
    challenges: [
      {
        id: 'w1-c1',
        weekNumber: 1,
        pillarId: 'web-foundations',
        title: 'Event Delegation Action Extractor',
        difficulty: 'Easy',
        instructions: 'Write a function `resolveAction(eventTarget)` that inspects a clicked DOM node object (represented as { tagName: string, dataset: { action?: string } }) and returns the action string if it is a button with an action dataset, or "NONE" otherwise.',
        starterCode: `function resolveAction(target) {
  // Write your logic here
  // Return target.dataset.action if tagName is 'BUTTON' and action exists
  return 'NONE';
}`,
        language: 'javascript',
        solutionHint: 'Check target.tagName === "BUTTON" and target.dataset && target.dataset.action.',
        testCases: [
          {
            inputDesc: '{ tagName: "BUTTON", dataset: { action: "submit" } }',
            expectedDesc: '"submit"',
            testFnString: `(fn) => fn({ tagName: 'BUTTON', dataset: { action: 'submit' } }) === 'submit'`,
          },
          {
            inputDesc: '{ tagName: "DIV", dataset: { action: "submit" } }',
            expectedDesc: '"NONE"',
            testFnString: `(fn) => fn({ tagName: 'DIV', dataset: { action: 'submit' } }) === 'NONE'`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w1-q1',
        weekNumber: 1,
        pillarId: 'web-foundations',
        difficulty: 'Easy',
        question: 'Which HTML5 element represents the primary, unique landmark content of a document and must NOT be repeated multiple times?',
        options: ['<section>', '<main>', '<article>', '<aside>'],
        correctOptionIndex: 1,
        explanation: 'According to HTML5 WCAG specifications, a document must only possess a single visible <main> element representing unique primary content.',
        screeningContext: 'Standard screening question on accessible semantic architecture.',
      },
      {
        id: 'w1-q2',
        weekNumber: 1,
        pillarId: 'web-foundations',
        difficulty: 'Medium',
        question: 'When clicking an inner child element, what is the default order of the DOM event flow phases?',
        options: [
          'Bubbling phase only',
          'Capturing phase -> Target phase -> Bubbling phase',
          'Target phase -> Bubbling phase -> Capturing phase',
          'Bubbling phase -> Target phase -> Capturing phase',
        ],
        correctOptionIndex: 1,
        explanation: 'The W3C DOM event flow executes in 3 sequential phases: Capturing (trickles down from window to target), Target, and Bubbling (floats up from target to window).',
        screeningContext: 'Frequent technical screening question tested in frontend interviews.',
      },
    ],
  },

  // ==========================================
  // WEEK 2: CSS Flexbox, Grid & Responsive Systems
  // ==========================================
  {
    weekNumber: 2,
    pillarId: 'web-foundations',
    pillarTitle: 'Web Foundations',
    title: 'CSS Flexbox, 2D Grid & Fluid Responsive Layouts',
    subtitle: 'Mastering 1D vs 2D layout paradigms, container queries, and responsive mathematical clamps.',
    estimatedHours: 6,
    xpReward: 250,
    topics: ['Flexbox Axes & Alignment', 'CSS Grid (minmax, auto-fit)', 'Fluid Typography clamp()', 'Box-Sizing & Stacking Contexts'],
    lessons: [
      {
        id: 'w2-l1',
        weekNumber: 2,
        title: 'Flexbox (1D) vs CSS Grid (2D) Mental Model',
        summary: 'When to choose Flexbox for linear row/column alignment vs CSS Grid for bidirectional 2-dimensional layouts.',
        readTimeMinutes: 5,
        internshipTip: 'Interviewers often ask: "Create a responsive photo grid that automatically wraps without media queries." The canonical answer is: grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)).',
        language: 'html',
        codeSnippet: `/* Responsive Bento Grid without media queries */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Linear Toolbar using Flexbox */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}`,
        explanationPoints: [
          'Flexbox calculates layout from content outwards (content-first); Grid enforces structured tracks from layout inwards.',
          'auto-fit expands existing tracks to fill available width; auto-fill creates empty tracks if space allows.',
          'Always use box-sizing: border-box globally to ensure padding does not inflate outer container dimensions.',
        ],
        outputSimulation: 'Container: 900px wide -> 2 columns of 438px each. Container: 1300px wide -> 3 columns of 413px each.',
        interactiveSandbox: {
          language: 'html',
          initialCode: `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-900 rounded-lg">
  <div class="p-3 bg-slate-800 rounded border border-cyan-500/20 text-xs">Card 01 (Auto-aligned)</div>
  <div class="p-3 bg-slate-800 rounded border border-cyan-500/20 text-xs">Card 02 (Auto-aligned)</div>
  <div class="p-3 bg-slate-800 rounded border border-cyan-500/20 text-xs">Card 03 (Auto-aligned)</div>
</div>`,
        },
      },
      {
        id: 'w2-l2',
        weekNumber: 2,
        title: 'Fluid Typography & Mathematical CSS clamp()',
        summary: 'Eliminating jarring media query jumps using clamp(min, preferred, max) for continuous fluid scaling across viewports.',
        readTimeMinutes: 4,
        internshipTip: 'Modern frontend assessments favor CSS clamp() because it demonstrates mathematical understanding of viewport units without writing 15 separate media queries.',
        language: 'javascript',
        codeSnippet: `/* Fluid Font Scale */
/* font-size: clamp(MINIMUM, VALOR_IDEAL_VW, MAXIMUM) */
.hero-heading {
  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);
  line-height: 1.2;
}

/* Container Width with Safe Bounds */
.container {
  width: clamp(320px, 90vw, 1280px);
  margin-inline: auto;
}`,
        explanationPoints: [
          'clamp(min, val, max) sets a lower limit, dynamic preference, and upper limit in one line.',
          'margin-inline: auto replaces margin: 0 auto for logical property internationalization.',
          'Combining rem with vw inside the middle argument protects accessibility zoom magnification.',
        ],
        outputSimulation: 'At 375px mobile -> 1.75rem (28px). At 1440px desktop -> 3.5rem (56px). Smooth interpolation in between.',
      },
    ],
    challenges: [
      {
        id: 'w2-c1',
        weekNumber: 2,
        pillarId: 'web-foundations',
        title: 'CSS Specificity Calculator',
        difficulty: 'Medium',
        instructions: 'Write a function `calculateSpecificity(selectorType)` that returns a numeric score: "inline" -> 1000, "id" -> 100, "class" -> 10, "element" -> 1. For any unknown input return 0.',
        starterCode: `function calculateSpecificity(selectorType) {
  // Return the specificity weight
  const weights = {
    inline: 1000,
    id: 100,
    class: 10,
    element: 1
  };
  return weights[selectorType] || 0;
}`,
        language: 'javascript',
        solutionHint: 'Map each selector kind to its standard CSS specificity decade order.',
        testCases: [
          {
            inputDesc: '"id"',
            expectedDesc: '100',
            testFnString: `(fn) => fn('id') === 100`,
          },
          {
            inputDesc: '"class"',
            expectedDesc: '10',
            testFnString: `(fn) => fn('class') === 10`,
          },
          {
            inputDesc: '"unknown"',
            expectedDesc: '0',
            testFnString: `(fn) => fn('unknown') === 0`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w2-q1',
        weekNumber: 2,
        pillarId: 'web-foundations',
        difficulty: 'Medium',
        question: 'What happens when you apply "grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))" to an 800px wide grid container with 2 child items?',
        options: [
          'It forces 4 equal 200px columns, leaving 2 blank slots.',
          'The 2 items stretch to occupy 400px each (1fr each across available width).',
          'It throws a CSS parse error because auto-fit requires at least 4 items.',
          'Each item stays strictly 200px and aligns to the left.',
        ],
        correctOptionIndex: 1,
        explanation: 'auto-fit collapses any empty tracks to 0px, allowing the existing 2 items to expand to 1fr each (400px width each) across the 800px track space.',
        screeningContext: 'Classic CSS Grid layout screening question.',
      },
    ],
  },

  // ==========================================
  // WEEK 3: JavaScript Mechanics & The Event Loop
  // ==========================================
  {
    weekNumber: 3,
    pillarId: 'js-async',
    pillarTitle: 'Core JS & Async',
    title: 'Modern ES6+, Closures & The Event Loop',
    subtitle: 'Microtasks vs Macrotasks, execution contexts, lexical scoping, and functional array paradigms.',
    estimatedHours: 8,
    xpReward: 300,
    topics: ['Call Stack, Microtask & Macrotask Queue', 'Closures & Lexical Scope', 'ES6+ Destructuring & Spread', 'Immutability & Pure Functions'],
    lessons: [
      {
        id: 'w3-l1',
        weekNumber: 3,
        title: 'The Event Loop: Microtasks vs Macrotasks',
        summary: 'How JavaScript executes synchronous code, processes Promises before setTimeout, and avoids blocking the single thread.',
        readTimeMinutes: 5,
        internshipTip: 'This exact output prediction question appears in over 70% of tech internship screenings. Memorize: Synchronous -> Microtasks (Promise, queueMicrotask) -> Macrotasks (setTimeout, setInterval).',
        language: 'javascript',
        codeSnippet: `console.log('1. Start');

setTimeout(() => {
  console.log('2. setTimeout (Macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise.then (Microtask)');
});

console.log('4. End');

// Expected Output:
// 1. Start
// 4. End
// 3. Promise.then (Microtask)
// 2. setTimeout (Macrotask)`,
        explanationPoints: [
          'Synchronous code executes immediately on the Call Stack.',
          'When the call stack empties, the engine exhausts ALL microtasks in the Microtask Queue before yielding.',
          'Only after microtasks are depleted does the Event Loop pick the oldest task from the Macrotask (Callback) Queue.',
        ],
        outputSimulation: `Order of execution:
[Stack] 1. Start
[Stack] 4. End
[Microtask Queue] 3. Promise.then (Microtask)
[Macrotask Queue] 2. setTimeout (Macrotask)`,
      },
      {
        id: 'w3-l2',
        weekNumber: 3,
        title: 'Closures & The Data Encapsulation Pattern',
        summary: 'How inner functions retain access to their outer enclosing lexical scope even after the outer function has returned.',
        readTimeMinutes: 4,
        internshipTip: 'Screeners love asking: "How do you create a private counter in JavaScript without ES2022 private class fields (#)?" The answer is a closure factory function.',
        language: 'javascript',
        codeSnippet: `function createRateLimiter(maxCalls) {
  let callCount = 0; // Enclosed private variable

  return function executeCall(operationName) {
    if (callCount >= maxCalls) {
      return { allowed: false, error: 'Rate limit exceeded' };
    }
    callCount += 1;
    return { allowed: true, callNumber: callCount, operation: operationName };
  };
}

const limiter = createRateLimiter(2);
console.log(limiter('GET /api/user')); // allowed: true, call: 1
console.log(limiter('GET /api/data')); // allowed: true, call: 2
console.log(limiter('GET /api/ping')); // allowed: false`,
        explanationPoints: [
          'The inner function forms a closure containing a reference to callCount.',
          'callCount cannot be modified directly from outside; it is fully encapsulated.',
          'Common pitfall: closures in loops before ES6 `let` captured shared mutable references.',
        ],
        outputSimulation: 'Call 1: {allowed: true, callNumber: 1} | Call 2: {allowed: true, callNumber: 2} | Call 3: {allowed: false}',
      },
    ],
    challenges: [
      {
        id: 'w3-c1',
        weekNumber: 3,
        pillarId: 'js-async',
        title: 'Custom Array Memoizer',
        difficulty: 'Medium',
        instructions: 'Implement `memoize(fn)` which returns a cached version of a single-argument function. If called with an argument already computed, return the cached result without executing `fn` again.',
        starterCode: `function memoize(fn) {
  const cache = new Map();
  return function(arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}`,
        language: 'javascript',
        solutionHint: 'Use a JavaScript Map or plain object closure to store computed key-value pairs.',
        testCases: [
          {
            inputDesc: 'memoized square function with 5 then 5',
            expectedDesc: '25',
            testFnString: `(fn) => {
              let calls = 0;
              const square = fn((x) => { calls++; return x * x; });
              const r1 = square(5);
              const r2 = square(5);
              return r1 === 25 && r2 === 25 && calls === 1;
            }`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w3-q1',
        weekNumber: 3,
        pillarId: 'js-async',
        difficulty: 'Medium',
        question: `What will be printed to the console?\n\nsetTimeout(() => console.log('A'), 0);\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');`,
        options: ['A, B, C', 'C, A, B', 'C, B, A', 'B, C, A'],
        correctOptionIndex: 2,
        explanation: 'Synchronous "C" logs first. Then the microtask "B" is flushed from the Promise queue. Finally the timer callback macrotask "A" runs.',
        screeningContext: 'Frequent HackerRank / Codility screening question.',
      },
    ],
  },

  // ==========================================
  // WEEK 4: Promises, Async/Await & REST APIs
  // ==========================================
  {
    weekNumber: 4,
    pillarId: 'js-async',
    pillarTitle: 'Core JS & Async',
    title: 'Promises, Async/Await & REST Architecture',
    subtitle: 'Promise concurrency (Promise.all vs allSettled), try/catch patterns, and robust HTTP fetch clients.',
    estimatedHours: 8,
    xpReward: 300,
    topics: ['Promise States & Chaining', 'Promise.all vs Promise.allSettled', 'Async/Await Exception Handling', 'AbortController & HTTP Statuses'],
    lessons: [
      {
        id: 'w4-l1',
        weekNumber: 4,
        title: 'Promise Concurrency: all() vs allSettled()',
        summary: 'Understanding fail-fast vs resilient multi-request fetching in production applications.',
        readTimeMinutes: 5,
        internshipTip: 'Many candidates use Promise.all blindly. If 1 of 5 API calls returns 404, Promise.all instantly rejects everything! Use Promise.allSettled when non-critical endpoints can safely fail.',
        language: 'javascript',
        codeSnippet: `// Promise.all: Fails Fast on first rejection
try {
  const [user, posts] = await Promise.all([
    fetchUser(id),
    fetchPosts(id)
  ]);
} catch (err) {
  console.error('If either fails, caught here:', err);
}

// Promise.allSettled: Never rejects; returns status for each
const results = await Promise.allSettled([
  fetchAnalytics(),
  fetchUserProfile(),
]);

results.forEach(res => {
  if (res.status === 'fulfilled') {
    console.log('Data:', res.value);
  } else {
    console.warn('Reason:', res.reason);
  }
});`,
        explanationPoints: [
          'Promise.all is best when all data points are required before proceeding.',
          'Promise.allSettled guarantees an array of { status, value | reason } objects regardless of rejections.',
          'Promise.race resolves or rejects as soon as the earliest promise finishes.',
        ],
        outputSimulation: 'Promise.allSettled -> [{ status: "fulfilled", value: UserData }, { status: "rejected", reason: "404 Not Found" }]',
      },
      {
        id: 'w4-l2',
        weekNumber: 4,
        title: 'Robust HTTP Client with Fetch & Error Handling',
        summary: 'Why fetch() does NOT reject on HTTP 404 or 500 and how to construct production-ready request wrappers.',
        readTimeMinutes: 5,
        internshipTip: 'Critical interview gotcha: "Does fetch() throw an error if the server returns 500 Internal Server Error?" No! It only rejects on network failures. You must manually check `response.ok`.',
        language: 'javascript',
        codeSnippet: `async function apiClient(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}`,
        explanationPoints: [
          'response.ok is true for status codes 200–299.',
          'Always use AbortController with a timeout to prevent hanging connections.',
          'Clean up timeouts in a finally block to avoid memory leaks.',
        ],
        outputSimulation: 'apiClient("/api/users") -> HTTP 200 OK -> JSON payload parsed successfully.',
      },
    ],
    challenges: [
      {
        id: 'w4-c1',
        weekNumber: 4,
        pillarId: 'js-async',
        title: 'Retry Async Function with Max Attempts',
        difficulty: 'Medium',
        instructions: 'Write `retryAsync(fn, maxRetries)` that calls async `fn()`. If it throws, retries up to `maxRetries` times. If it still fails, rethrows the final error.',
        starterCode: `async function retryAsync(fn, maxRetries) {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      return await fn();
    } catch (err) {
      attempts++;
      if (attempts >= maxRetries) throw err;
    }
  }
}`,
        language: 'javascript',
        solutionHint: 'Wrap the execution inside a while loop and increment attempt counter on catch.',
        testCases: [
          {
            inputDesc: 'fn fails 2 times then succeeds, maxRetries = 3',
            expectedDesc: '"success"',
            testFnString: `async (fn) => {
              let count = 0;
              const flaky = async () => {
                count++;
                if (count < 3) throw new Error('fail');
                return 'success';
              };
              const res = await fn(flaky, 3);
              return res === 'success';
            }`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w4-q1',
        weekNumber: 4,
        pillarId: 'js-async',
        difficulty: 'Easy',
        question: 'Does native window.fetch() automatically reject its returned Promise when the server responds with a 404 or 500 status?',
        options: [
          'Yes, any status >= 400 automatically triggers the catch block.',
          'No, it resolves normally; you must check response.ok or response.status.',
          'Only for 500 errors, but not 404.',
          'Only if the Content-Type is text/html.',
        ],
        correctOptionIndex: 1,
        explanation: 'fetch() only rejects on network failures (e.g., DNS lookup failure, offline). HTTP error status codes like 404 or 500 resolve with response.ok = false.',
        screeningContext: 'Essential frontend screening trap tested in technical interviews.',
      },
    ],
  },

  // ==========================================
  // WEEK 5: Python Fundamentals & OOP
  // ==========================================
  {
    weekNumber: 5,
    pillarId: 'python-backend',
    pillarTitle: 'Python Backend',
    title: 'Python Fundamentals, OOP & Data Structures',
    subtitle: 'Comprehensions, dunder methods, LeetCode patterns, and time complexity analysis.',
    estimatedHours: 8,
    xpReward: 350,
    topics: ['List/Dict Comprehensions', 'Dunder Methods (__init__, __repr__)', 'Hash Maps O(1) vs Lists O(N)', 'Two Pointer & Sliding Window'],
    lessons: [
      {
        id: 'w5-l1',
        weekNumber: 5,
        title: 'Pythonic Comprehensions & Generator Expressions',
        summary: 'Writing clean, idiomatic Python code for data transformation without verbose multi-line for-loops.',
        readTimeMinutes: 4,
        internshipTip: 'In Python technical rounds, writing verbose manual append loops when a comprehension is appropriate signals lack of Pythonic fluency. Master dictionary and list comprehensions.',
        language: 'python',
        codeSnippet: `# Standard List Comprehension
scores = [78, 92, 85, 64, 99, 45]
passing_scaled = [min(100, s + 5) for s in scores if s >= 60]
# -> [83, 97, 90, 69, 100]

# Dictionary Comprehension (Inverting key-value lookup)
user_roles = {"alice": "admin", "bob": "developer", "charlie": "designer"}
role_index = {role: user for user, role in user_roles.items()}
# -> {'admin': 'alice', 'developer': 'bob', 'designer': 'charlie'}`,
        explanationPoints: [
          'List comprehensions: [expr for item in iterable if condition].',
          'Use parentheses (expr for x in seq) to create memory-efficient lazy Generators for massive datasets.',
          'Dictionary comprehensions allow rapid O(1) reverse lookup indexing.',
        ],
        outputSimulation: 'passing_scaled: [83, 97, 90, 69, 100] | role_index: {"admin": "alice", "developer": "bob"}',
      },
      {
        id: 'w5-l2',
        weekNumber: 5,
        title: 'Object-Oriented Design & Dunder Methods',
        summary: 'Designing robust data models with classes, __repr__, __eq__, and encapsulation.',
        readTimeMinutes: 5,
        internshipTip: 'Internship interviewers love testing `__repr__` vs `__str__`. Rule of thumb: `__repr__` is unambiguous for developers and debugging; `__str__` is for end-user readability.',
        language: 'python',
        codeSnippet: `class InternCandidate:
    def __init__(self, name: str, xp: int = 0):
        self.name = name
        self.xp = xp
        self._skills: set[str] = set()

    def add_skill(self, skill: str) -> None:
        self._skills.add(skill.lower())

    def is_hireable(self) -> bool:
        return self.xp >= 1000 and len(self._skills) >= 3

    def __repr__(self) -> str:
        return f"InternCandidate(name={self.name!r}, xp={self.xp}, skills={len(self._skills)})"

dev = InternCandidate("Alex", xp=1200)
dev.add_skill("Python")
dev.add_skill("React")
dev.add_skill("FastAPI")
print(dev.is_hireable()) # True`,
        explanationPoints: [
          'Use type hints (str, int, set[str]) for modern production readability.',
          'Prefix internal attributes with a single underscore `_skills` to indicate private encapsulation by convention.',
          'Dunder methods like `__repr__` make logs and stack traces clean during production outages.',
        ],
        outputSimulation: 'is_hireable: True | repr: InternCandidate(name=\'Alex\', xp=1200, skills=3)',
      },
    ],
    challenges: [
      {
        id: 'w5-c1',
        weekNumber: 5,
        pillarId: 'python-backend',
        title: 'Two Sum O(N) Hash Map Lookup',
        difficulty: 'Easy',
        instructions: 'Implement `twoSum(nums, target)` using a hash map to achieve O(N) linear time complexity. Return the indices of the two numbers that add up to target.',
        starterCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        language: 'javascript',
        solutionHint: 'Store visited values in a hash map: key is number, value is its index. Check complement = target - curr.',
        testCases: [
          {
            inputDesc: 'nums = [2, 7, 11, 15], target = 9',
            expectedDesc: '[0, 1]',
            testFnString: `(fn) => {
              const res = fn([2, 7, 11, 15], 9);
              return JSON.stringify(res) === '[0,1]';
            }`,
          },
          {
            inputDesc: 'nums = [3, 2, 4], target = 6',
            expectedDesc: '[1, 2]',
            testFnString: `(fn) => {
              const res = fn([3, 2, 4], 6);
              return JSON.stringify(res) === '[1,2]';
            }`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w5-q1',
        weekNumber: 5,
        pillarId: 'python-backend',
        difficulty: 'Medium',
        question: `What will happen when calling append_item twice?\n\ndef append_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(append_item(1))\nprint(append_item(2))`,
        options: [
          '[1] then [2]',
          '[1] then [1, 2]',
          'Throws TypeError because default arguments cannot be mutable',
          '[1, 2] then [1, 2]',
        ],
        correctOptionIndex: 1,
        explanation: 'In Python, default arguments are evaluated ONCE when the function definition is executed, NOT each time the function is called. The list is shared across calls. Best practice is to use "items=None" and initialize "if items is None: items = []".',
        screeningContext: 'The #1 classic Python mutable default parameter trap in technical interviews.',
      },
    ],
  },

  // ==========================================
  // WEEK 6: REST API Architecture & Backend Routing
  // ==========================================
  {
    weekNumber: 6,
    pillarId: 'python-backend',
    pillarTitle: 'Python Backend',
    title: 'RESTful Backend Architecture with FastAPI/Flask',
    subtitle: 'Endpoint design, request schemas, status codes, and database interaction paradigms.',
    estimatedHours: 8,
    xpReward: 350,
    topics: ['HTTP Verbs (GET, POST, PUT, DELETE)', 'FastAPI & Pydantic Validation', 'Status Codes (201 Created vs 200 vs 422)', 'CORS & Middlewares'],
    lessons: [
      {
        id: 'w6-l1',
        weekNumber: 6,
        title: 'REST Principles & Idiomatic HTTP Status Codes',
        summary: 'How to structure clean REST endpoints adhering to resource naming conventions and unambiguous status responses.',
        readTimeMinutes: 5,
        internshipTip: 'A common backend interview question: "What is the difference between PUT and PATCH?" PUT replaces the entire resource entity; PATCH applies partial modifications to specific fields.',
        language: 'python',
        codeSnippet: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr

app = FastAPI()

class UserCreate(BaseModel):
    username: str
    email: EmailStr

# 201 Created for resource creation
@app.post("/api/v1/users", status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate):
    # Pydantic validates email format automatically
    user_id = db_insert(payload.dict())
    return {"id": user_id, "username": payload.username}

# 204 No Content for deletion
@app.delete("/api/v1/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int):
    if not db_exists(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    db_delete(user_id)
    return None`,
        explanationPoints: [
          'REST resources should use plural nouns (/api/v1/users, not /api/v1/createUser).',
          'FastAPI leverages Python type hints for automatic Swagger OpenAPI documentation.',
          'Pydantic models reject invalid inputs with HTTP 422 Unprocessable Entity automatically.',
        ],
        outputSimulation: 'POST /api/v1/users -> 201 Created -> { id: 104, username: "dev_sprint" }',
      },
      {
        id: 'w6-l2',
        weekNumber: 6,
        title: 'CORS, Pre-flight OPTIONS & Auth Headers',
        summary: 'Why Cross-Origin Resource Sharing blocks browser requests and how Bearer token headers travel across boundaries.',
        readTimeMinutes: 4,
        internshipTip: 'When integrating a React frontend on port 3000 with a Python backend on port 8000, browsers dispatch an OPTIONS preflight request. If your backend doesn\'t handle OPTIONS, CORS errors occur.',
        language: 'python',
        codeSnippet: `from fastapi.middleware.cors import CORSMiddleware

# Enable Cross-Origin requests from Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)`,
        explanationPoints: [
          'Same-Origin Policy is enforced by the client browser, not the server.',
          'Pre-flight requests verify Access-Control-Allow-Origin before sending destructive POST/PUT payloads.',
          'Always protect API keys on the server; client tokens should use expiring JWT Bearer authentication.',
        ],
        outputSimulation: 'Browser sends OPTIONS /api -> Server responds with Access-Control-Allow-Origin: * -> POST proceeds.',
      },
    ],
    challenges: [
      {
        id: 'w6-c1',
        weekNumber: 6,
        pillarId: 'python-backend',
        title: 'REST Endpoint Router Matcher',
        difficulty: 'Medium',
        instructions: 'Write `matchRoute(method, path)` that accepts an HTTP method and path string. Return "GET_USERS" for ("GET", "/users"), "CREATE_USER" for ("POST", "/users"), and "404_NOT_FOUND" otherwise.',
        starterCode: `function matchRoute(method, path) {
  if (method === 'GET' && path === '/users') return 'GET_USERS';
  if (method === 'POST' && path === '/users') return 'CREATE_USER';
  return '404_NOT_FOUND';
}`,
        language: 'javascript',
        solutionHint: 'Check matching method and clean path equality.',
        testCases: [
          {
            inputDesc: '"GET", "/users"',
            expectedDesc: '"GET_USERS"',
            testFnString: `(fn) => fn('GET', '/users') === 'GET_USERS'`,
          },
          {
            inputDesc: '"DELETE", "/users"',
            expectedDesc: '"404_NOT_FOUND"',
            testFnString: `(fn) => fn('DELETE', '/users') === '404_NOT_FOUND'`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w6-q1',
        weekNumber: 6,
        pillarId: 'python-backend',
        difficulty: 'Easy',
        question: 'What is the most semantically appropriate HTTP status code when a client successfully creates a new database resource?',
        options: ['200 OK', '201 Created', '204 No Content', '202 Accepted'],
        correctOptionIndex: 1,
        explanation: 'HTTP 201 Created signifies that the request succeeded and resulted in the creation of a new identifiable resource.',
        screeningContext: 'Fundamental backend REST assessment question.',
      },
    ],
  },

  // ==========================================
  // WEEK 7: NumPy, Vectorization & Pandas Data Pipelines
  // ==========================================
  {
    weekNumber: 7,
    pillarId: 'ml-ai',
    pillarTitle: 'Machine Learning & AI',
    title: 'NumPy Vectorization & Pandas Pipelines',
    subtitle: 'High-performance matrix mathematics, vectorization vs loops, and feature data wrangling.',
    estimatedHours: 8,
    xpReward: 400,
    topics: ['NumPy ndarray & Broadcasting', 'Vectorized Operations (100x Speedup)', 'Pandas DataFrame Filtering & GroupBy', 'Feature Normalization & Missing Values'],
    lessons: [
      {
        id: 'w7-l1',
        weekNumber: 7,
        title: 'Vectorization vs Python For-Loops in NumPy',
        summary: 'Why processing arrays with NumPy vectorization is up to 100x faster by delegating to compiled C and SIMD hardware registers.',
        readTimeMinutes: 5,
        internshipTip: 'ML screening tests will flag any candidate who writes a Python `for i in range(len(data))` loop over numerical arrays. Always use vectorized array operations like `np.dot` or element-wise arithmetic.',
        language: 'python',
        codeSnippet: `import numpy as np

# Feature Matrix: 3 samples with 2 features each (e.g., [YearsExp, QuizScore])
X = np.array([
    [2.0, 85.0],
    [5.0, 95.0],
    [1.0, 70.0]
])

# Weights vector for prediction
weights = np.array([0.4, 0.6])

# Vectorized Dot Product (O(1) in C space, SIMD hardware accelerated)
predicted_ratings = np.dot(X, weights)
# Calculation:
# Sample 1: (2.0 * 0.4) + (85.0 * 0.6) = 0.8 + 51.0 = 51.8
# Sample 2: (5.0 * 0.4) + (95.0 * 0.6) = 2.0 + 57.0 = 59.0
print("Vectorized predictions:", predicted_ratings)`,
        explanationPoints: [
          'NumPy arrays store elements contiguously in homogeneous memory blocks.',
          'Broadcasting allows arithmetic between arrays of different shapes without copying data.',
          'Avoid looping over rows; use matrix multiplication (np.matmul or @ operator).',
        ],
        outputSimulation: 'Vectorized predictions: [51.8, 59.0, 42.4]',
      },
      {
        id: 'w7-l2',
        weekNumber: 7,
        title: 'Data Wrangling & Feature Normalization with Pandas',
        summary: 'Preparing real-world tabular data: handling missing values, imputing medians, and min-max feature scaling.',
        readTimeMinutes: 5,
        internshipTip: 'Never scale your entire dataset together before splitting! That causes Data Leakage (information from the test set leaking into the training set). Always fit the scaler on the training set only.',
        language: 'python',
        codeSnippet: `import pandas as pd

# Raw dataset with missing data
df = pd.DataFrame({
    'candidate': ['DevA', 'DevB', 'DevC', 'DevD'],
    'coding_score': [88, None, 95, 72],
    'years_exp': [1.5, 3.0, None, 2.0]
})

# 1. Impute missing values with column median
df['coding_score'] = df['coding_score'].fillna(df['coding_score'].median())
df['years_exp'] = df['years_exp'].fillna(df['years_exp'].median())

# 2. Min-Max Normalization: (x - min) / (max - min)
min_score = df['coding_score'].min()
max_score = df['coding_score'].max()
df['normalized_score'] = (df['coding_score'] - min_score) / (max_score - min_score)
print(df[['candidate', 'normalized_score']])`,
        explanationPoints: [
          'Median imputation is robust against extreme outliers compared to the mean.',
          'Normalization maps feature values to a uniform [0, 1] interval so gradient descent converges faster.',
          'Pandas boolean indexing allows lightning-fast row filtering: df[df["score"] > 80].',
        ],
        outputSimulation: 'Candidate DevC normalized_score: 1.0 | DevD: 0.0 | DevA: ~0.69',
      },
    ],
    challenges: [
      {
        id: 'w7-c1',
        weekNumber: 7,
        pillarId: 'ml-ai',
        title: 'Euclidean Distance Vector Calculator',
        difficulty: 'Easy',
        instructions: 'Implement `euclideanDistance(vecA, vecB)` that calculates the straight-line distance between two numerical coordinate vectors of equal length. Formula: sqrt(sum((a - b)^2)).',
        starterCode: `function euclideanDistance(vecA, vecB) {
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}`,
        language: 'javascript',
        solutionHint: 'Sum the squared differences for each dimension, then return Math.sqrt(sum).',
        testCases: [
          {
            inputDesc: '[0, 0] and [3, 4]',
            expectedDesc: '5',
            testFnString: `(fn) => Math.abs(fn([0, 0], [3, 4]) - 5) < 0.001`,
          },
          {
            inputDesc: '[1, 2, 3] and [1, 2, 3]',
            expectedDesc: '0',
            testFnString: `(fn) => Math.abs(fn([1, 2, 3], [1, 2, 3]) - 0) < 0.001`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w7-q1',
        weekNumber: 7,
        pillarId: 'ml-ai',
        difficulty: 'Medium',
        question: 'Why is it considered a critical machine learning defect (Data Leakage) to fit a feature scaler (e.g., StandardScaler) on the entire dataset prior to train/test splitting?',
        options: [
          'Because the test set will have missing columns.',
          'Information (mean and variance) from the test set leaks into the training pipeline, leading to overly optimistic evaluation metrics.',
          'NumPy arrays cannot handle scaled test data.',
          'It slows down model inference time by a factor of 2.',
        ],
        correctOptionIndex: 1,
        explanation: 'Data Leakage occurs when data outside the training set influences the model. If you compute mean/standard deviation across test samples, the model has implicitly "seen" the evaluation distribution.',
        screeningContext: 'High-frequency question in Applied AI & ML engineering interviews.',
      },
    ],
  },

  // ==========================================
  // WEEK 8: Scikit-Learn & Full-Stack AI Integration
  // ==========================================
  {
    weekNumber: 8,
    pillarId: 'ml-ai',
    pillarTitle: 'Machine Learning & AI',
    title: 'Scikit-Learn Modeling & Full-Stack AI Deployment',
    subtitle: 'Model training pipelines, evaluation metrics (Accuracy, Precision, Recall), and client-side inference integration.',
    estimatedHours: 8,
    xpReward: 400,
    topics: ['Train/Test Split & Cross Validation', 'Linear/Logistic Regression & Random Forest', 'Precision vs Recall vs F1 Score', 'Connecting React to Model Inference APIs'],
    lessons: [
      {
        id: 'w8-l1',
        weekNumber: 8,
        title: 'Model Training Workflow & Metrics (Precision vs Recall)',
        summary: 'When accuracy is misleading, how to evaluate classification models, and balancing False Positives vs False Negatives.',
        readTimeMinutes: 5,
        internshipTip: 'Assessment classic: "If only 1% of transactions are fraudulent, and a model predicts \'Not Fraud\' 100% of the time, what is its Accuracy vs Recall?" Accuracy is 99% (misleading!), but Recall is 0% (useless!).',
        language: 'python',
        codeSnippet: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# 1. Train / Test Split (80% training, 20% holdout test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 2. Fit Estimator
model = LogisticRegression()
model.fit(X_train, y_train)

# 3. Predict & Evaluate
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(classification_report(y_test, y_pred))`,
        explanationPoints: [
          'Precision = TP / (TP + FP) — Measures quality: "Of all predictions flagged as positive, how many were right?"',
          'Recall = TP / (TP + FN) — Measures quantity: "Of all actual positive cases in reality, how many did we catch?"',
          'F1 Score represents the harmonic mean of Precision and Recall.',
        ],
        outputSimulation: 'Model fitted in 14ms | Holdout Accuracy: 0.94 | Precision: 0.92 | Recall: 0.96 | F1: 0.94',
      },
      {
        id: 'w8-l2',
        weekNumber: 8,
        title: 'Full-Stack AI Integration: Model to React Frontend',
        summary: 'Packaging an inference endpoint with FastAPI and consuming real-time predictions in an interactive React UI.',
        readTimeMinutes: 5,
        internshipTip: 'In full-stack AI roles, you will be expected to bridge data science and frontend engineering. Always handle loading states, optimistic UI, and error boundaries around ML inference endpoints.',
        language: 'javascript',
        codeSnippet: `// React Frontend Hook for ML Model Prediction
function useModelInference() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const predict = async (candidateFeatures) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/predict-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: candidateFeatures }),
      });
      const data = await res.json();
      setPrediction(data); // { score: 94.2, probability: 0.96 }
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { predict, prediction, loading };
}`,
        explanationPoints: [
          'Models can be saved with joblib/pickle or converted to ONNX for lightning-fast client or edge runtime.',
          'Always serialize numpy data types (like np.float32) to native Python types before returning JSON responses.',
          'Client UI displays confidence intervals or probabilities to guide user decisions responsibly.',
        ],
        outputSimulation: 'Client sends features [years_exp: 2, quiz_score: 90] -> Backend returns { hire_prob: 0.89 } -> UI updates.',
      },
    ],
    challenges: [
      {
        id: 'w8-c1',
        weekNumber: 8,
        pillarId: 'ml-ai',
        title: 'Accuracy & Precision Metrics Calculator',
        difficulty: 'Easy',
        instructions: 'Write `calculateMetrics(tp, fp, tn, fn)` that returns an object `{ accuracy, precision }` rounded to 2 decimal places. Accuracy = (tp + tn) / (tp + fp + tn + fn); Precision = tp / (tp + fp). Handle division by zero by returning 0.',
        starterCode: `function calculateMetrics(tp, fp, tn, fn) {
  const total = tp + fp + tn + fn;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  return {
    accuracy: Number(accuracy.toFixed(2)),
    precision: Number(precision.toFixed(2))
  };
}`,
        language: 'javascript',
        solutionHint: 'Use the standard confusion matrix arithmetic formulas.',
        testCases: [
          {
            inputDesc: 'tp=8, fp=2, tn=85, fn=5',
            expectedDesc: '{ accuracy: 0.93, precision: 0.80 }',
            testFnString: `(fn) => {
              const res = fn(8, 2, 85, 5);
              return res.accuracy === 0.93 && res.precision === 0.8;
            }`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w8-q1',
        weekNumber: 8,
        pillarId: 'ml-ai',
        difficulty: 'Medium',
        question: 'In a medical cancer detection model where failing to identify a malignant tumor can be fatal, which evaluation metric must you prioritize optimizing?',
        options: [
          'Precision (minimize False Positives)',
          'Recall (minimize False Negatives)',
          'Raw Accuracy across all samples',
          'Mean Squared Error (MSE)',
        ],
        correctOptionIndex: 1,
        explanation: 'In high-stakes diagnosis or defect detection, False Negatives (missing a real cancer case) are catastrophic. Recall = TP / (TP + FN), so optimizing Recall directly minimizes False Negatives.',
        screeningContext: 'Standard screening question for ML and Full-Stack AI engineering candidates.',
      },
    ],
  },
];

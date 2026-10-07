import { WeekCurriculum } from '../types';

export const CURRICULUM_DATA: WeekCurriculum[] = [
  // =========================================================================
  // MONTH 1 · WEEK 1: Module 1 — Computational Thinking, CPython & Memory
  // =========================================================================
  {
    weekNumber: 1,
    monthNumber: 1,
    partId: 'part-1',
    partTitle: 'Part 1: Python & Foundations',
    moduleNumbers: [1],
    moduleTitles: ['Foundations of Programming & Computational Thinking'],
    pillarId: 'python-backend',
    pillarTitle: 'Python Foundations',
    title: 'Computational Thinking, CPython Internals & Memory Architecture',
    subtitle: 'Deterministic compute, CPython virtual machine bytecode, standard streams, memory references & type casting.',
    estimatedHours: 8,
    xpReward: 300,
    topics: [
      'Deterministic Compute (Lesson 1.1.1)',
      'CPython Pipeline: Source -> Bytecode -> VM (Lesson 4.1.1)',
      'Variables as Memory References (Lesson 6.1.1)',
      'Type Casting & Truncation Safety (Lesson 8.1.2)',
    ],
    lessons: [
      {
        id: 'w1-l1',
        weekNumber: 1,
        title: 'The CPython Execution Pipeline: Source Code -> Bytecode -> VM',
        summary: 'How Python compiles human-readable code into .pyc bytecode instructions executed by the CPython virtual machine loop.',
        readTimeMinutes: 5,
        internshipTip: 'Internship screeners frequently test whether candidates know Python is not purely interpreted: CPython pre-compiles source code to bytecode (.pyc) before the Virtual Machine eval loop executes it.',
        language: 'python',
        codeSnippet: `import dis

# Inspecting bytecode disassembly
def calculate_payload(raw_units: int) -> int:
    scaled = raw_units * 4
    return scaled + 10

# Disassemble into CPython opcode instructions
dis.dis(calculate_payload)
# Output shows LOAD_FAST, BINARY_OP (multiply), STORE_FAST, RETURN_VALUE`,
        explanationPoints: [
          'Python source code (.py) is first compiled into bytecode objects cached in __pycache__ (.pyc).',
          'CPython is implemented in C and features a stack-based virtual machine executing opcodes sequentially.',
          'Bytecode compilation catches syntax errors before runtime; runtime type mismatch errors occur during VM execution.',
        ],
        outputSimulation: `Bytecode disassembly:
  2           0 RESUME                   0
  3           2 LOAD_FAST                0 (raw_units)
              4 LOAD_CONST               1 (4)
              6 BINARY_OP                5 (*)
              8 STORE_FAST               1 (scaled)
  4          10 LOAD_FAST                1 (scaled)
             12 LOAD_CONST               2 (10)
             14 BINARY_OP                0 (+)
             16 RETURN_VALUE`,
      },
      {
        id: 'w1-l2',
        weekNumber: 1,
        title: 'Variables as Memory References & Object Identity (id vs ==)',
        summary: 'Why Python variables are pointers referencing heap objects rather than fixed containers, and understanding identity (is) vs equality (==).',
        readTimeMinutes: 5,
        internshipTip: 'A common technical interview screening question: "What is the difference between \'a == b\' and \'a is b\'?" Equality (==) checks equivalent value; identity (is) verifies memory address pointer identity (id(a) == id(b)).',
        language: 'python',
        codeSnippet: `# Variables are references to objects in memory
list_a = [1, 2, 3]
list_b = [1, 2, 3]
list_c = list_a

print(list_a == list_b)  # True  (Value equality)
print(list_a is list_b)  # False (Different memory addresses)
print(list_a is list_c)  # True  (Same reference pointer)

# Mutating via reference
list_c.append(4)
print(list_a) # [1, 2, 3, 4] — mutated through list_c reference!`,
        explanationPoints: [
          'Variables do not contain data values directly; they store memory address pointers.',
          'Small integers (-5 to 256) and interned strings are memoized in CPython memory pools.',
          'Mutating a shared mutable object (list, dict, set) affects all referencing aliases.',
        ],
        outputSimulation: 'Equality (==): True | Identity (is): False | list_a after reference append: [1, 2, 3, 4]',
      },
    ],
    challenges: [
      {
        id: 'w1-c1',
        weekNumber: 1,
        pillarId: 'python-backend',
        title: 'Safe Type Cast Parser',
        difficulty: 'Easy',
        instructions: 'Write a function `safeCastInteger(rawString, fallbackValue)` that safely parses a string into an integer. If the string is invalid or causes a conversion error, return `fallbackValue`.',
        starterCode: `function safeCastInteger(rawString, fallbackValue) {
  // Parse string to integer safely
  const parsed = parseInt(rawString, 10);
  if (isNaN(parsed)) return fallbackValue;
  return parsed;
}`,
        language: 'javascript',
        solutionHint: 'Use parseInt with radix 10 and verify with isNaN; return fallbackValue if NaN.',
        testCases: [
          {
            inputDesc: '"104", 0',
            expectedDesc: '104',
            testFnString: `(fn) => fn("104", 0) === 104`,
          },
          {
            inputDesc: '"invalid_token", -1',
            expectedDesc: '-1',
            testFnString: `(fn) => fn("invalid_token", -1) === -1`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w1-q1',
        weekNumber: 1,
        pillarId: 'python-backend',
        difficulty: 'Medium',
        question: 'In CPython, what is the fundamental difference between the equality operator (==) and the identity operator (is)?',
        options: [
          '== checks identical memory addresses; is checks object data values.',
          '== compares whether data values are equal; is checks whether two variables point to the exact same memory address (id).',
          'is only works on string variables; == works on all types.',
          'There is no difference in modern Python 3.12+.',
        ],
        correctOptionIndex: 1,
        explanation: 'The equality operator (==) calls __eq__ to evaluate equivalent contents. The identity operator (is) checks whether id(a) == id(b) (identical memory address reference in C heap).',
        screeningContext: 'Standard screening question tested in early-career Python technical rounds.',
      },
      {
        id: 'w1-q2',
        weekNumber: 1,
        pillarId: 'python-backend',
        difficulty: 'Hard',
        question: 'What is the true execution pipeline when executing a Python script `python app.py` with standard CPython?',
        options: [
          'Source code is directly interpreted line-by-line in native machine assembly without intermediate representations.',
          'Source code is parsed into an AST, compiled into bytecode (.pyc), and then executed by the CPython virtual machine evaluation loop.',
          'Python compiles ahead-of-time directly into binary ELF machine executables.',
          'Bytecode is only created when uploading packages to PyPI.',
        ],
        correctOptionIndex: 1,
        explanation: 'CPython compiles human-readable source code into an Abstract Syntax Tree (AST), then emits bytecode opcodes (.pyc cached in __pycache__), and finally feeds opcodes to its C-based virtual machine loop.',
        screeningContext: 'CPython runtime and compute architecture screening question.',
      },
      {
        id: 'w1-q3',
        weekNumber: 1,
        pillarId: 'python-backend',
        difficulty: 'Easy',
        question: 'In Bash shell environments used for deploying headless ML scripts, what exit code indicates that a program executed with complete success without errors?',
        options: ['1', '0', '-1', '255'],
        correctOptionIndex: 1,
        explanation: 'In Unix/POSIX standards, exit code 0 indicates success. Non-zero exit codes (1 to 255) signal various failure states, which operators inspect using `echo $?` or conditional chains like `cmd1 && cmd2`.',
        screeningContext: 'Core DevOps and Shell script screening check for backend/ML engineers.',
      },
      {
        id: 'w1-q4',
        weekNumber: 1,
        pillarId: 'python-backend',
        difficulty: 'Medium',
        question: 'In Python, what happens when you explicitly cast a float `int(9.99)`?',
        options: [
          'It rounds mathematically to 10.',
          'It truncates the fractional part towards zero, returning 9.',
          'It throws a TypeError because floats cannot be converted directly to integers.',
          'It returns 9.0 as a float.',
        ],
        correctOptionIndex: 1,
        explanation: 'int() on a floating-point number performs truncation towards zero, dropping all decimals without rounding. To perform mathematical rounding, use round(9.99).',
        screeningContext: 'Frequent data conversion and numerical precision screening gotcha.',
      },
    ],
  },

  // =========================================================================
  // MONTH 1 · WEEK 2: Module 1 (Part B) & Module 2 — Control Flow & Functions
  // =========================================================================
  {
    weekNumber: 2,
    monthNumber: 1,
    partId: 'part-1',
    partTitle: 'Part 1: Python & Foundations',
    moduleNumbers: [1, 2],
    moduleTitles: ['Control Flow & Intro to AI', 'Strings, Functions & Scope'],
    pillarId: 'python-backend',
    pillarTitle: 'Python Foundations',
    title: 'Control Flow, Functional Abstractions & Foundations of AI',
    subtitle: 'Guard clauses, while state control, higher-order functions, closures, and the shift from deterministic rules to machine learning.',
    estimatedHours: 8,
    xpReward: 300,
    topics: [
      'Guard Clauses & Escaping Nested Conditionals (Lesson 9.1.4)',
      'Defining Functions & Parameter Lifetime (Lessons 12.1 & 14.1)',
      'Higher-Order Functions & Lambdas (Lessons 15.1 & 16.1)',
      'Deterministic Rules vs Machine Learning (Lesson 10.5.1)',
    ],
    lessons: [
      {
        id: 'w2-l1',
        weekNumber: 2,
        title: 'Guard Clauses & Escaping Conditional Hell',
        summary: 'Refactoring deeply nested if-else pyramids into flat, clean linear guard clauses with early returns.',
        readTimeMinutes: 4,
        internshipTip: 'Clean code reviewers reject 4-level nested if statements. Replacing nested branches with inverted guard clauses is an immediate signal of production engineering maturity.',
        language: 'python',
        codeSnippet: `# ❌ Deeply nested branching pyramid
def evaluate_candidate_bad(candidate):
    if candidate is not None:
        if candidate.get("age", 0) >= 18:
            if candidate.get("has_degree"):
                if candidate.get("passed_test"):
                    return "ACCEPTED"
    return "REJECTED"

# ✅ Clean Guard Clause Pattern (Fail Fast, Flat Hierarchy)
def evaluate_candidate_clean(candidate):
    if not candidate:
        return "REJECTED"
    if candidate.get("age", 0) < 18:
        return "REJECTED"
    if not candidate.get("has_degree"):
        return "REJECTED"
    if not candidate.get("passed_test"):
        return "REJECTED"

    return "ACCEPTED"`,
        explanationPoints: [
          'Guard clauses handle validation and edge cases first, returning early.',
          'Reduces cyclomatic complexity and mental cognitive load during code reviews.',
          'Main execution flow remains aligned at zero indentation level.',
        ],
        outputSimulation: 'Linear guard clauses evaluate edge cases in O(1) without nested indentation blocks.',
      },
      {
        id: 'w2-l2',
        weekNumber: 2,
        title: 'Higher-Order Functions & The Paradigm Shift to AI',
        summary: 'Passing functions as first-class citizens and understanding why rule-based systems hit limits that machine learning solves.',
        readTimeMinutes: 5,
        internshipTip: 'Screening interviewers love contrasting classical programming (Rules + Data = Answers) with Machine Learning (Data + Answers = Rules). Know this formulation verbatim.',
        language: 'python',
        codeSnippet: `# Higher-Order Function: Accepting behavior as arguments
def apply_data_pipeline(data: list[int], transform_fn) -> list[int]:
    return [transform_fn(x) for x in data]

# Using anonymous lambda transforms
normalized = apply_data_pipeline([10, 20, 30], lambda x: x / 100)
# -> [0.1, 0.2, 0.3]

# The ML Paradigm Shift:
# Classical Programming: Rules + Data -> Predictions
# Machine Learning: Data + Target Outcomes -> Discovered Model Rules`,
        explanationPoints: [
          'Python treats functions as first-class citizens: they can be passed as args, returned, and stored.',
          'Traditional if/else rules cannot scale to complex perception (computer vision, NLP).',
          'Machine Learning models parameterize weights by learning patterns directly from labeled training data.',
        ],
        outputSimulation: 'Data pipeline normalized: [0.1, 0.2, 0.3] | Paradigm: Learning parameters from data',
      },
    ],
    challenges: [
      {
        id: 'w2-c1',
        weekNumber: 2,
        pillarId: 'python-backend',
        title: 'Higher-Order Array Transformer',
        difficulty: 'Easy',
        instructions: 'Implement `transformList(items, predicateFn, mapFn)` that filters an array with `predicateFn` and maps the remaining elements using `mapFn`.',
        starterCode: `function transformList(items, predicateFn, mapFn) {
  return items.filter(predicateFn).map(mapFn);
}`,
        language: 'javascript',
        solutionHint: 'Chain the predicate filter followed by the map transformation.',
        testCases: [
          {
            inputDesc: '[1, 2, 3, 4], x => x % 2 === 0, x => x * 10',
            expectedDesc: '[20, 40]',
            testFnString: `(fn) => {
              const res = fn([1, 2, 3, 4], x => x % 2 === 0, x => x * 10);
              return JSON.stringify(res) === '[20,40]';
            }`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w2-q1',
        weekNumber: 2,
        pillarId: 'python-backend',
        difficulty: 'Easy',
        question: 'According to computational paradigm theory, what distinguishes Classical Programming from Machine Learning?',
        options: [
          'Classical programming uses Python; machine learning only uses C++.',
          'Classical: inputs Rules + Data to produce Answers. Machine Learning: inputs Data + Answers to learn the Rules.',
          'Machine learning is always 100% accurate; classical programming is probabilistic.',
          'Classical programming requires GPUs; machine learning runs only in browser RAM.',
        ],
        correctOptionIndex: 1,
        explanation: 'In classical computing, software engineers manually encode rules that operate on data. In machine learning, algorithms optimize parameter weights by examining historical data paired with target answers.',
        screeningContext: 'Core conceptual question from Module 10.5 in technical AI screenings.',
      },
      {
        id: 'w2-q2',
        weekNumber: 2,
        pillarId: 'python-backend',
        difficulty: 'Medium',
        question: 'Why do production engineering teams enforce using "Guard Clauses" (early returns) over deeply nested if/elif/else branching structures?',
        options: [
          'Guard clauses eliminate the need for unit testing.',
          'Guard clauses invert conditions to handle errors immediately, flattening code indentation and reducing cyclomatic complexity.',
          'Python does not allow more than 2 levels of indentation.',
          'Guard clauses make code execute 100x faster by bypassing bytecode compilation.',
        ],
        correctOptionIndex: 1,
        explanation: 'Guard clauses check preconditions and return early, preventing "arrow-shaped" deeply nested pyramids. This keeps the primary happy path linear and clean at root indentation.',
        screeningContext: 'Clean architecture and production code readability screening standard.',
      },
      {
        id: 'w2-q3',
        weekNumber: 2,
        pillarId: 'python-backend',
        difficulty: 'Medium',
        question: 'In Python lexical scoping, what keyword allows an inner nested function to modify a variable in its enclosing (outer) non-global scope?',
        options: ['global', 'nonlocal', 'outer', 'super'],
        correctOptionIndex: 1,
        explanation: 'The `nonlocal` keyword tells Python that a variable identifier belongs to the nearest enclosing scope (excluding global scope), allowing stateful closures without global pollution.',
        screeningContext: 'Advanced function scope and closure interview question.',
      },
      {
        id: 'w2-q4',
        weekNumber: 2,
        pillarId: 'python-backend',
        difficulty: 'Easy',
        question: 'In Machine Learning dataset terminology, what is the fundamental difference between "Features" and "Labels"?',
        options: [
          'Features are output predictions; Labels are input measurements.',
          'Features are the measurable input properties (independent variables X); Labels are the target outcome or ground-truth class to predict (dependent variable y).',
          'Features only exist in supervised learning; Labels only exist in unsupervised clustering.',
          'Features must always be integers; Labels must always be floats.',
        ],
        correctOptionIndex: 1,
        explanation: 'In supervised machine learning, Features (X) are input vectors fed into the model, and Labels (y) are ground-truth target outputs the model learns to approximate.',
        screeningContext: 'Essential Machine Learning taxonomy question.',
      },
    ],
  },

  // =========================================================================
  // MONTH 1 · WEEK 3: Module 3 & Module 4 — Data Structures & OOP
  // =========================================================================
  {
    weekNumber: 3,
    monthNumber: 1,
    partId: 'part-1',
    partTitle: 'Part 1: Python & Foundations',
    moduleNumbers: [3, 4],
    moduleTitles: ['Built-in Data Structures', 'Object-Oriented Programming'],
    pillarId: 'python-backend',
    pillarTitle: 'Python Backend',
    title: 'Data Structures, Hash Maps, OOP & Dunder Methods',
    subtitle: 'Lists, tuples, hash sets, dictionary indexing, comprehensions, classes, inheritance & dunder magic methods.',
    estimatedHours: 8,
    xpReward: 350,
    topics: [
      'List/Dict/Set Comprehensions (Lesson 23.1)',
      'Hash Map Lookups O(1) vs Linear O(N) (Lesson 21.1)',
      'Classes, __init__ & self (Lessons 24.1 & 26)',
      'Dunder Methods: __repr__, __eq__, __len__ (Lesson 28.1)',
    ],
    lessons: [
      {
        id: 'w3-l1',
        weekNumber: 3,
        title: 'Pythonic Comprehensions & Reverse Hash Map Indexing',
        summary: 'Writing clean, idiomatic list and dictionary comprehensions for O(1) instant key lookup inverted tables.',
        readTimeMinutes: 4,
        internshipTip: 'In Python technical rounds, writing verbose manual append loops when a comprehension is appropriate signals lack of Pythonic fluency. Master dictionary and list comprehensions.',
        language: 'python',
        codeSnippet: `# Dictionary Comprehension (Inverting key-value lookup for O(1) access)
user_roles = {"alice": "admin", "bob": "developer", "charlie": "designer"}
role_index = {role: user for user, role in user_roles.items()}

# List Comprehension with filtering
scores = [78, 92, 85, 64, 99, 45]
honor_roll = [s for s in scores if s >= 85]
print("Role Index:", role_index)
print("Honor Roll:", honor_roll)`,
        explanationPoints: [
          'Dictionary comprehensions construct hash maps in a single expressive pass.',
          'Hash table lookups take average O(1) constant time, compared to list O(N) scanning.',
          'Set comprehensions {x for x in seq} automatically eliminate duplicates.',
        ],
        outputSimulation: 'Role Index: {"admin": "alice", "developer": "bob"} | Honor Roll: [92, 85, 99]',
      },
      {
        id: 'w3-l2',
        weekNumber: 3,
        title: 'Object-Oriented Architecture & Dunder Magic Methods',
        summary: 'Designing robust data models with classes, __init__, __repr__, inheritance, and encapsulation.',
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
        id: 'w3-c1',
        weekNumber: 3,
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
            testFnString: `(fn) => JSON.stringify(fn([2, 7, 11, 15], 9)) === '[0,1]'`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w3-q1',
        weekNumber: 3,
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
      {
        id: 'w3-q2',
        weekNumber: 3,
        pillarId: 'python-backend',
        difficulty: 'Easy',
        question: 'What is the average time complexity of checking membership (`if key in hash_table:`) in a Python `dict` vs checking membership (`if item in items:`) in a standard Python `list`?',
        options: [
          'dict is O(N); list is O(1)',
          'dict is O(1) amortized; list is O(N) linear scan',
          'Both are O(log N)',
          'Both are O(N)',
        ],
        correctOptionIndex: 1,
        explanation: 'Python dictionaries use hash tables with O(1) expected constant lookup time. Lists require a sequential scan through all N elements, taking O(N) linear time.',
        screeningContext: 'Core LeetCode data structure complexity question.',
      },
      {
        id: 'w3-q3',
        weekNumber: 3,
        pillarId: 'python-backend',
        difficulty: 'Medium',
        question: 'In Python OOP, what is the convention and architectural distinction between implementing `__repr__` vs `__str__` on a class?',
        options: [
          '__repr__ is for mathematical operators; __str__ is for serialization.',
          '__repr__ should be unambiguous and developer-focused (often valid Python code to recreate the object); __str__ is an informal, human-readable string representation.',
          '__str__ is required; __repr__ is deprecated in Python 3.',
          'There is no difference; Python treats them identically.',
        ],
        correctOptionIndex: 1,
        explanation: '`__repr__` is intended for developers, interactive debugging, and logging, and should ideally be unambiguous. `__str__` is intended for friendly presentation to end users.',
        screeningContext: 'Standard OOP design question in backend technical screens.',
      },
      {
        id: 'w3-q4',
        weekNumber: 3,
        pillarId: 'python-backend',
        difficulty: 'Easy',
        question: 'How do you create an inverted dictionary in Python (swapping keys and values) in a single Pythonic expression?',
        options: [
          'inverted = dict.swap(original)',
          '{v: k for k, v in original.items()}',
          '[v: k for k, v in original]',
          'original.invert()',
        ],
        correctOptionIndex: 1,
        explanation: 'A dictionary comprehension `{v: k for k, v in original.items()}` iterates over key-value tuples and constructs the inverted mapping in a single O(N) pass.',
        screeningContext: 'Python comprehension idiom screening check.',
      },
    ],
  },

  // =========================================================================
  // MONTH 1 · WEEK 4: Modules 5, 6 & 7 — Advanced DSA, Python & Concurrency
  // =========================================================================
  {
    weekNumber: 4,
    monthNumber: 1,
    partId: 'part-1',
    partTitle: 'Part 1: Python & Foundations',
    moduleNumbers: [5, 6, 7],
    moduleTitles: ['Advanced DSA', 'Advanced Python Features', 'Modules, Testing & Concurrency'],
    pillarId: 'python-backend',
    pillarTitle: 'Python Backend',
    title: 'Advanced DSA, Generators, Decorators & Concurrency',
    subtitle: 'Stacks, queues, BSTs, generators & yield, decorators, context managers, Pytest, threading and asyncio.',
    estimatedHours: 8,
    xpReward: 350,
    topics: [
      'Stacks & Queues with OOP (Lesson 29.1)',
      'Generators & yield Memory Efficiency (Lesson 35.1)',
      'Decorators & Function Wrappers (Lesson 36.1)',
      'Threading, The GIL & AsyncIO (Lessons 45.1 & 46.1)',
    ],
    lessons: [
      {
        id: 'w4-l1',
        weekNumber: 4,
        title: 'Generators & Lazy Evaluation with `yield`',
        summary: 'Generating millions of records with constant O(1) memory overhead using Python generator iterators.',
        readTimeMinutes: 5,
        internshipTip: 'When processing gigabytes of log files or streaming ML dataset batches, using list comprehensions crashes servers with Out Of Memory (OOM) errors. Generators evaluate lazily on-demand.',
        language: 'python',
        codeSnippet: `# Generator streaming batches lazily with O(1) memory
def stream_dataset_batches(total_samples: int, batch_size: int):
    for start_idx in range(0, total_samples, batch_size):
        yield list(range(start_idx, min(start_idx + batch_size, total_samples)))

# Only 1 batch exists in memory at any point in time
batch_generator = stream_dataset_batches(total_samples=1000, batch_size=250)
print(next(batch_generator)[:3]) # [0, 1, 2]
print(next(batch_generator)[:3]) # [250, 251, 252]`,
        explanationPoints: [
          'yield pauses function execution, saves state frame, and emits a value to the caller.',
          'Generators implement Python iterator protocol (__iter__ and __next__).',
          'Memory consumption is constant regardless of whether processing 10 items or 10,000,000 items.',
        ],
        outputSimulation: 'Batch 1: [0, 1, 2, ...] | Batch 2: [250, 251, 252, ...] | Memory consumed: 128 bytes',
      },
      {
        id: 'w4-l2',
        weekNumber: 4,
        title: 'Decorators: Higher-Order Function Metaprogramming',
        summary: 'Implementing logging, performance timers, and authentication wrappers using Python @decorator syntax.',
        readTimeMinutes: 5,
        internshipTip: 'FastAPI and Flask route definitions (@app.get) are decorators! Understand how decorators wrap functions using *args and **kwargs.',
        language: 'python',
        codeSnippet: `import time
from functools import wraps

def benchmark_timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"[{func.__name__}] executed in {duration:.6f}s")
        return result
    return wrapper

@benchmark_timer
def simulate_heavy_compute(n: int) -> int:
    return sum(i * i for i in range(n))

simulate_heavy_compute(100_000)`,
        explanationPoints: [
          'A decorator is a function that takes a function as argument and returns an enhanced replacement wrapper.',
          'functools.wraps preserves original docstrings and function name metadata.',
          '*args and **kwargs allow the wrapper to accept arbitrary positional and keyword arguments.',
        ],
        outputSimulation: '[simulate_heavy_compute] executed in 0.008412s | Output returned.',
      },
    ],
    challenges: [
      {
        id: 'w4-c1',
        weekNumber: 4,
        pillarId: 'python-backend',
        title: 'Stack with Max Element O(1)',
        difficulty: 'Medium',
        instructions: 'Implement a Stack data structure with methods `push(val)`, `pop()`, and `getMax()`, where `getMax()` returns the current maximum element in O(1) time.',
        starterCode: `class MaxStack {
  constructor() {
    this.stack = [];
    this.maxStack = [];
  }
  push(val) {
    this.stack.push(val);
    const currMax = this.maxStack.length > 0 ? this.maxStack[this.maxStack.length - 1] : val;
    this.maxStack.push(Math.max(val, currMax));
  }
  pop() {
    this.maxStack.pop();
    return this.stack.pop();
  }
  getMax() {
    return this.maxStack[this.maxStack.length - 1];
  }
}`,
        language: 'javascript',
        solutionHint: 'Maintain an auxiliary stack tracking the running maximum at every depth level.',
        testCases: [
          {
            inputDesc: 'push(5), push(1), push(10), getMax() -> 10, pop(), getMax() -> 5',
            expectedDesc: '5',
            testFnString: `(MaxStack) => {
              const s = new MaxStack();
              s.push(5);
              s.push(1);
              s.push(10);
              const m1 = s.getMax();
              s.pop();
              const m2 = s.getMax();
              return m1 === 10 && m2 === 5;
            }`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w4-q1',
        weekNumber: 4,
        pillarId: 'python-backend',
        difficulty: 'Medium',
        question: 'What is Python\'s Global Interpreter Lock (GIL) and how does it impact multi-threaded programs in CPython?',
        options: [
          'It locks the file system so multiple users cannot write to the same disk.',
          'It is a mutex that prevents multiple native OS threads from executing Python bytecodes simultaneously in CPython, making CPU-bound multi-threading execute sequentially.',
          'It forces all Python code to run in a web browser sandbox.',
          'It disables network sockets during testing.',
        ],
        correctOptionIndex: 1,
        explanation: 'In CPython, the GIL protects memory management from race conditions by allowing only one native thread to execute Python bytecode at a time. For CPU-bound tasks, multiprocessing or C extensions must be used; for I/O-bound tasks, asyncio or threading release the GIL during waiting.',
        screeningContext: 'High-frequency Python systems engineering interview question.',
      },
      {
        id: 'w4-q2',
        weekNumber: 4,
        pillarId: 'python-backend',
        difficulty: 'Medium',
        question: 'Why are Python generator functions with `yield` preferred over returning a complete list when streaming massive machine learning datasets?',
        options: [
          'Generators convert data automatically to SQL.',
          'Generators maintain state and produce values lazily on-demand, requiring O(1) constant memory rather than allocating gigabytes of RAM in advance.',
          'Generators run 50x faster by compiling directly to GPU shaders.',
          'Generators allow infinite recursion without call stack frames.',
        ],
        correctOptionIndex: 1,
        explanation: 'A generator returns an iterator that yields one item at a time lazily via the `__next__()` protocol, keeping memory consumption minimal regardless of dataset size.',
        screeningContext: 'Essential data engineering & ML pipeline screening question.',
      },
      {
        id: 'w4-q3',
        weekNumber: 4,
        pillarId: 'python-backend',
        difficulty: 'Hard',
        question: 'Why is `collections.deque` used for FIFO Queue implementations instead of a standard Python `list.pop(0)`?',
        options: [
          'Standard lists do not have a pop method.',
          'list.pop(0) takes O(N) linear time because all remaining elements must shift left in memory; deque.popleft() takes O(1) constant time via a doubly linked block structure.',
          'deque is written in Rust, whereas list is written in C.',
          'deque enforces strict type checks on input items.',
        ],
        correctOptionIndex: 1,
        explanation: 'In a dynamic array list, removing index 0 forces memory shifting of all subsequent elements O(N). collections.deque is implemented as a doubly linked list of fixed blocks providing true O(1) appends and pops from both ends.',
        screeningContext: 'Core LeetCode queue pattern optimization screening check.',
      },
      {
        id: 'w4-q4',
        weekNumber: 4,
        pillarId: 'python-backend',
        difficulty: 'Medium',
        question: 'What is the purpose of decorating the inner wrapper of a custom Python decorator with `@functools.wraps(func)`?',
        options: [
          'It compiles the function with Cython.',
          'It preserves the original function metadata, such as __name__, __doc__, and parameter signatures, preventing them from being overwritten by wrapper details.',
          'It automatically retries the function 3 times on exception.',
          'It converts synchronous functions to asyncio coroutines.',
        ],
        correctOptionIndex: 1,
        explanation: 'Without @wraps(func), the decorated function will report wrapper metadata (e.g. `fn.__name__ == "wrapper"`), breaking introspection, debuggers, and automated documentation generators.',
        screeningContext: 'Advanced Python decorator interview question.',
      },
    ],
  },

  // =========================================================================
  // MONTH 2 · WEEK 5: Module 8 & Module 9 — Web Foundations & Core JS Engine
  // =========================================================================
  {
    weekNumber: 5,
    monthNumber: 2,
    partId: 'part-2',
    partTitle: 'Part 2: Frontend & React',
    moduleNumbers: [8, 9],
    moduleTitles: ['Web Foundations & Styling Architecture', 'Core JavaScript & The DOM Engine'],
    pillarId: 'web-foundations',
    pillarTitle: 'Web Foundations & DOM',
    title: 'Semantic HTML5, CSS Grid/Flexbox & The DOM Engine',
    subtitle: 'AI Interval 1.1 & 2.1, accessibility trees, CSS box model, execution contexts, closures and event delegation.',
    estimatedHours: 8,
    xpReward: 350,
    topics: [
      'The DOM & Semantic HTML (Lesson 47.1)',
      'CSS Flexbox & 2D Grid Layouts (Lessons 51.1 & 52.1)',
      'Execution Context & Closures (Lessons 55.1 & 58.1)',
      'Event Bubbling & Delegation (Lessons 68.1 & 69.1)',
    ],
    lessons: [
      {
        id: 'w5-l1',
        weekNumber: 5,
        title: 'DOM Event Propagation: Bubbling & Event Delegation',
        summary: 'How events bubble up through parent nodes and why delegating listeners to a single ancestor improves performance and prevents memory leaks.',
        readTimeMinutes: 5,
        internshipTip: 'A classic frontend screening question: "If you render 10,000 table rows with click handlers, how do you prevent browser memory exhaustion?" The answer is always Event Delegation on the parent container.',
        language: 'javascript',
        codeSnippet: `// Event Delegation Pattern
const table = document.querySelector('#candidate-table');

table.addEventListener('click', (event) => {
  // Capture clicks specifically on delete buttons via closest()
  const deleteBtn = event.target.closest('button[data-action="delete"]');
  if (!deleteBtn) return;

  const candidateId = deleteBtn.dataset.id;
  console.log(\`Deleted candidate record #\${candidateId}\`);
});`,
        explanationPoints: [
          'Events default to Phase 3: Bubbling (target -> parent -> body -> document).',
          'event.target is the innermost clicked node; event.currentTarget is the listener node.',
          'Event delegation replaces thousands of individual listeners with a single parent handler.',
        ],
        outputSimulation: '[Click on button #item-42] -> Event bubbles to #candidate-table -> target captured -> "Deleted candidate record #42"',
      },
      {
        id: 'w5-l2',
        weekNumber: 5,
        title: 'Closures & Lexical Scoping in JavaScript',
        summary: 'How inner functions retain access to outer lexical scope variables after the outer function has finished executing.',
        readTimeMinutes: 4,
        internshipTip: 'Screeners love asking: "How do you create a private state container without ES2022 private class fields (#)?" The answer is a closure factory function.',
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
          'Inner functions retain access to outer variables via the lexical scope chain.',
          'Private state cannot be overwritten externally.',
          'Enables memoization, function factories, and module encapsulation.',
        ],
        outputSimulation: 'Call 1: {allowed: true, callNumber: 1} | Call 2: {allowed: true, callNumber: 2} | Call 3: {allowed: false}',
      },
    ],
    challenges: [
      {
        id: 'w5-c1',
        weekNumber: 5,
        pillarId: 'web-foundations',
        title: 'Event Delegation Action Extractor',
        difficulty: 'Easy',
        instructions: 'Write `resolveAction(target)` that accepts an event target object ({ tagName: string, dataset: { action?: string } }) and returns target.dataset.action if tagName is "BUTTON", or "NONE" otherwise.',
        starterCode: `function resolveAction(target) {
  if (target && target.tagName === 'BUTTON' && target.dataset && target.dataset.action) {
    return target.dataset.action;
  }
  return 'NONE';
}`,
        language: 'javascript',
        solutionHint: 'Verify tagName === "BUTTON" and dataset.action presence.',
        testCases: [
          {
            inputDesc: '{ tagName: "BUTTON", dataset: { action: "delete" } }',
            expectedDesc: '"delete"',
            testFnString: `(fn) => fn({ tagName: 'BUTTON', dataset: { action: 'delete' } }) === 'delete'`,
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'w5-q1',
        weekNumber: 5,
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
      {
        id: 'w5-q2',
        weekNumber: 5,
        pillarId: 'web-foundations',
        difficulty: 'Easy',
        question: 'Which HTML5 element represents the primary, unique landmark content of a document and must NOT be repeated multiple times?',
        options: ['<section>', '<main>', '<article>', '<aside>'],
        correctOptionIndex: 1,
        explanation: 'According to HTML5 WCAG specifications, a document must only possess a single visible <main> element representing unique primary content.',
        screeningContext: 'Standard screening question on accessible semantic architecture.',
      },
      {
        id: 'w5-q3',
        weekNumber: 5,
        pillarId: 'web-foundations',
        difficulty: 'Medium',
        question: 'How does applying `box-sizing: border-box` globally in CSS prevent layout bugs?',
        options: [
          'It forces all elements to render as flex containers.',
          'It includes padding and border within the declared width and height, preventing containers from unexpectedly expanding and breaking layouts.',
          'It makes fonts responsive across mobile screens automatically.',
          'It disables the CSS box model.',
        ],
        correctOptionIndex: 1,
        explanation: 'Under `content-box`, padding and border add to the element\'s declared width. With `border-box`, width = content + padding + border, ensuring predictable mathematical dimensions.',
        screeningContext: 'Universal CSS box model screening check.',
      },
      {
        id: 'w5-q4',
        weekNumber: 5,
        pillarId: 'web-foundations',
        difficulty: 'Hard',
        question: 'What is the primary memory and performance benefit of using the Event Delegation pattern on an ancestor container?',
        options: [
          'It automatically debounces scroll events.',
          'Instead of attaching thousands of event listeners to individual child nodes, a single listener on the parent handles events via bubbling, conserving RAM and DOM node overhead.',
          'It allows cross-origin communication between iframes.',
          'It executes click handlers in Web Workers.',
        ],
        correctOptionIndex: 1,
        explanation: 'Event delegation leverages event bubbling to intercept interactions from child elements at a single ancestor listener node, preventing memory exhaustion when rendering large dynamic lists.',
        screeningContext: 'High-frequency frontend system design and performance interview question.',
      },
    ],
  },

  // =========================================================================
  // MONTH 2 · WEEK 6: Module 10 — Asynchronous JS & Modern Tooling
  // =========================================================================
  {
    weekNumber: 6,
    monthNumber: 2,
    partId: 'part-2',
    partTitle: 'Part 2: Frontend & React',
    moduleNumbers: [10],
    moduleTitles: ['Asynchronous JS & Modern Tooling'],
    pillarId: 'js-async',
    pillarTitle: 'Core JS & Async',
    title: 'The Event Loop, Promises, Async/Await & Modern Tooling',
    subtitle: 'Microtasks vs Macrotasks, Promise.all vs allSettled, fetch API error gotchas, ES6+ destructuring and Vite.',
    estimatedHours: 8,
    xpReward: 350,
    topics: [
      'The Event Loop & Microtask Queue (Lessons 75.1 & 76.1)',
      'Promise Concurrency: all() vs allSettled() (Lessons 73.1 & 74.1)',
      'Async/Await Exception Handling & Fetch API (Lessons 77.1 & 78.1)',
      'ES6+ Destructuring, Spread/Rest & Vite (Lessons 79.1–85.1)',
    ],
    lessons: [
      {
        id: 'w6-l1',
        weekNumber: 6,
        title: 'The JavaScript Event Loop: Microtasks vs Macrotasks',
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
        id: 'w6-l2',
        weekNumber: 6,
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
    ],
    challenges: [
      {
        id: 'w6-c1',
        weekNumber: 6,
        pillarId: 'js-async',
        title: 'Custom Array Memoizer',
        difficulty: 'Medium',
        instructions: 'Implement `memoize(fn)` which returns a cached version of a single-argument function. If called with an argument already computed, return cached result without executing `fn` again.',
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
        solutionHint: 'Use a JavaScript Map closure to store computed key-value pairs.',
        testCases: [
          {
            inputDesc: 'memoized square function with 5 then 5',
            expectedDesc: '25 (1 call)',
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
        id: 'w6-q1',
        weekNumber: 6,
        pillarId: 'js-async',
        difficulty: 'Medium',
        question: `What will be printed to the console?\n\nsetTimeout(() => console.log('A'), 0);\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');`,
        options: ['A, B, C', 'C, A, B', 'C, B, A', 'B, C, A'],
        correctOptionIndex: 2,
        explanation: 'Synchronous "C" logs first. Then the microtask "B" is flushed from the Promise queue. Finally the timer callback macrotask "A" runs.',
        screeningContext: 'Frequent HackerRank / Codility screening question.',
      },
      {
        id: 'w6-q2',
        weekNumber: 6,
        pillarId: 'js-async',
        difficulty: 'Medium',
        question: 'How does `Promise.all([p1, p2, p3])` behave if p2 rejects with an error while p1 and p3 succeed?',
        options: [
          'It waits for all promises to resolve and ignores p2.',
          'It rejects immediately with p2\'s error (fail-fast behavior), discarding results of p1 and p3.',
          'It converts the rejection into null and returns [p1, null, p3].',
          'It retries p2 until it succeeds.',
        ],
        correctOptionIndex: 1,
        explanation: 'Promise.all is strictly fail-fast. If any single promise rejects, the returned aggregate promise immediately rejects. Use `Promise.allSettled()` if you want all outcomes regardless of failure.',
        screeningContext: 'Core asynchronous concurrency screening question.',
      },
      {
        id: 'w6-q3',
        weekNumber: 6,
        pillarId: 'js-async',
        difficulty: 'Easy',
        question: 'Does standard browser `window.fetch()` reject its Promise when receiving HTTP 404 Not Found or HTTP 500 Internal Server Error?',
        options: [
          'Yes, any HTTP status >= 400 automatically causes the promise to reject.',
          'No! It resolves normally with `response.ok = false`. It only rejects on true network failures (DNS offline, CORS blocked).',
          'Only for 500 errors, but resolves for 404.',
          'Only if the server response body is empty.',
        ],
        correctOptionIndex: 1,
        explanation: 'A fundamental HTTP client gotcha: `fetch()` only rejects on network failures. You must inspect `if (!response.ok)` to handle 4xx and 5xx HTTP statuses.',
        screeningContext: '#1 frontend asynchronous networking interview trap.',
      },
      {
        id: 'w6-q4',
        weekNumber: 6,
        pillarId: 'js-async',
        difficulty: 'Medium',
        question: 'In ES6+ data transformation, does the spread operator `{ ...original }` create a deep clone or a shallow clone?',
        options: [
          'A deep clone of all nested objects and arrays.',
          'A shallow clone: top-level properties are copied, but nested objects/arrays retain shared references.',
          'It creates an immutable frozen object.',
          'It throws a TypeError if the object contains methods.',
        ],
        correctOptionIndex: 1,
        explanation: 'Object and array spread (`...`) creates a shallow copy. Mutating a nested property inside `{ ...original }` mutates the original object\'s nested reference.',
        screeningContext: 'Frequent React state mutation bug screening question.',
      },
    ],
  },

  // =========================================================================
  // MONTH 2 · WEEK 7: Modules 11 & 12 — React Foundations & Routing
  // =========================================================================
  {
    weekNumber: 7,
    monthNumber: 2,
    partId: 'part-2',
    partTitle: 'Part 2: Frontend & React',
    moduleNumbers: [11, 12],
    moduleTitles: ['React Foundations (The Paradigm Shift)', 'Routing & State Architecture'],
    pillarId: 'web-foundations',
    pillarTitle: 'React Architecture',
    title: 'React Hooks, Component Lifecycle, Custom Hooks & Routing',
    subtitle: 'JSX rules, useState, asynchronous state updates, useEffect cleanup, custom hooks, useRef, and routing architecture.',
    estimatedHours: 8,
    xpReward: 350,
    topics: [
      'JSX Rules & Functional Components (Lessons 86.1–90.1)',
      'useState & Asynchronous State Updates (Lessons 96.1 & 98.1)',
      'useEffect Dependency Arrays & Cleanup (Lessons 102.1 & 103.1)',
      'Custom Hooks & Routing Architecture (Lessons 104.1 & 110.1)',
    ],
    lessons: [
      {
        id: 'w7-l1',
        weekNumber: 7,
        title: 'React State Updates: Batching & Pure Functional Updates',
        summary: 'Why setState is asynchronous, how React batches updates, and why using prevState callback prevents race condition bugs.',
        readTimeMinutes: 5,
        internshipTip: 'A classic React screening gotcha: "What happens if you call setCount(count + 1) three times in a single event handler?" Count increments only once! You must write setCount(prev => prev + 1).',
        language: 'javascript',
        codeSnippet: `// ❌ Buggy: Stale state closures under batching
const incrementThreeTimesBuggy = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
  // Result: count only increases by 1!
};

// ✅ Pure functional updater pattern
const incrementThreeTimesSafe = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  // Result: count correctly increases by 3!
};`,
        explanationPoints: [
          'React batches state updates inside event handlers to prevent wasteful re-renders.',
          'Direct references to `count` read the snapshot from the current render closure.',
          'Passing an updater callback `prev => prev + 1` queues state transitions sequentially.',
        ],
        outputSimulation: 'Functional updater ensures sequential state evaluation without stale closures.',
      },
      {
        id: 'w7-l2',
        weekNumber: 7,
        title: 'Custom Hooks: Abstracting Reusable Stateful Logic',
        summary: 'Extracting stateful business logic into composable, testable custom hooks that adhere to the Rules of Hooks.',
        readTimeMinutes: 5,
        internshipTip: 'In React code screens, candidates who copy-paste useEffect and fetch logic across components fail architecture reviews. Senior engineers encapsulate data fetching into custom hooks.',
        language: 'javascript',
        codeSnippet: `// Custom Hook for API Data Fetching with AbortController
function useFetchData(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort(); // Cleanup function
  }, [endpoint]);

  return { data, loading, error };
}`,
        explanationPoints: [
          'Custom hook names must start with "use" to enforce the linter Rules of Hooks.',
          'Always return cleanup functions from useEffect to cancel pending network requests.',
          'Hooks can return either tuples [data, setData] or objects { data, loading, error }.',
        ],
        outputSimulation: 'useFetchData("/api/modules") -> { data: [...], loading: false, error: null }',
      },
    ],
    challenges: [
      {
        id: 'w7-c1',
        weekNumber: 7,
        pillarId: 'web-foundations',
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
        solutionHint: 'Wrap execution inside a while loop and increment attempt counter on catch.',
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
        id: 'w7-q1',
        weekNumber: 7,
        pillarId: 'web-foundations',
        difficulty: 'Medium',
        question: 'Why should you return a cleanup function from a React useEffect hook when initiating data subscriptions or intervals?',
        options: [
          'To force the component to re-render in background mode.',
          'To tear down listeners or abort network requests before the component unmounts or before the effect re-runs, preventing memory leaks.',
          'Cleanup functions are required by JSX syntax parsers.',
          'To delete the browser cache after each render.',
        ],
        correctOptionIndex: 1,
        explanation: 'When dependencies change or a component unmounts, React executes the cleanup function to prevent memory leaks, cancel pending fetch requests, or clear active setInterval timers.',
        screeningContext: 'Fundamental React lifecycle screening assessment.',
      },
      {
        id: 'w7-q2',
        weekNumber: 7,
        pillarId: 'web-foundations',
        difficulty: 'Medium',
        question: 'What happens if you invoke `setCount(count + 1)` three times sequentially within the same event handler in React 18+?',
        options: [
          'The count increments by 3 immediately.',
          'Due to automatic batching and stale closures, count only increments by 1. To increment by 3, you must use functional state updates `setCount(prev => prev + 1)`.',
          'React throws a Maximum Update Depth Exceeded error.',
          'Count becomes undefined.',
        ],
        correctOptionIndex: 1,
        explanation: 'React batches state updates and references the current snapshot of `count` from the render closure. The functional updater syntax ensures each update receives the pending updated value.',
        screeningContext: 'Classic React technical screening question tested at Meta, Airbnb, etc.',
      },
      {
        id: 'w7-q3',
        weekNumber: 7,
        pillarId: 'web-foundations',
        difficulty: 'Easy',
        question: 'In React form architecture, what defines a "Controlled Component"?',
        options: [
          'A component that disables all user mouse clicks.',
          'A component where form input state is managed directly by React state (via value and onChange), acting as the single source of truth.',
          'A form that only accepts numbers.',
          'A component that interacts exclusively with Redux.',
        ],
        correctOptionIndex: 1,
        explanation: 'In a controlled component, the input element\'s value is driven by React state, and changes dispatch state updates through onChange listeners.',
        screeningContext: 'Core React form design pattern screening question.',
      },
      {
        id: 'w7-q4',
        weekNumber: 7,
        pillarId: 'web-foundations',
        difficulty: 'Hard',
        question: 'What is the primary architectural rule regarding React Custom Hooks?',
        options: [
          'Custom hooks must always return JSX.',
          'Custom hook names must start with "use", and they can only be called at the top level of functional components or other hooks (never conditionally or in loops).',
          'Custom hooks must be declared inside class components.',
          'Custom hooks cannot use built-in hooks like useState.',
        ],
        correctOptionIndex: 1,
        explanation: 'The Rules of Hooks require custom hooks to start with "use" and be called unconditionally at top level so React reliably tracks hook call order between renders.',
        screeningContext: 'React architecture and linting rule compliance check.',
      },
    ],
  },

  // =========================================================================
  // MONTH 2 · WEEK 8: Modules 13, 14 & 15 — Enterprise State, Backend & AI
  // =========================================================================
  {
    weekNumber: 8,
    monthNumber: 2,
    partId: 'part-3',
    partTitle: 'Part 3: Backend & APIs',
    moduleNumbers: [13, 14, 15],
    moduleTitles: ['Enterprise State & Performance', 'RESTful API Architecture', 'Full-Stack AI Integration & Model Serving'],
    pillarId: 'ml-ai',
    pillarTitle: 'Backend & Full-Stack AI',
    title: 'Enterprise State, REST Backend APIs & Full-Stack AI Serving',
    subtitle: 'useReducer, Context API, FastAPI REST endpoints, Pydantic validation, NumPy vectorization, Scikit-Learn pipelines & model inference deployment.',
    estimatedHours: 8,
    xpReward: 400,
    topics: [
      'useReducer & Context API (Lessons 114.1 & 116.1)',
      'FastAPI & RESTful Status Codes (Lessons 127.1 & 129.1)',
      'NumPy Vectorization & Pandas Wrangling (Lessons 135.1 & 136.1)',
      'Scikit-Learn Model Training & React Inference (Lessons 137.1–141.1)',
    ],
    lessons: [
      {
        id: 'w8-l1',
        weekNumber: 8,
        title: 'REST Backend Endpoints with FastAPI & Pydantic Validation',
        summary: 'Building high-performance async REST routes with automatic Swagger schemas, type validation, and idiomatic HTTP status codes.',
        readTimeMinutes: 5,
        internshipTip: 'A common backend interview question: "What is the difference between PUT and PATCH?" PUT replaces the entire resource entity; PATCH applies partial modifications to specific fields.',
        language: 'python',
        codeSnippet: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr

app = FastAPI(title="DevSprint Inference Service")

class CandidateSchema(BaseModel):
    username: str
    quiz_score: float
    years_exp: float

# 201 Created for new resource
@app.post("/api/v1/candidates", status_code=status.HTTP_201_CREATED)
async def register_candidate(payload: CandidateSchema):
    # Pydantic validates input types automatically
    return {
        "status": "registered",
        "username": payload.username,
        "score": payload.quiz_score
    }`,
        explanationPoints: [
          'FastAPI leverages Python type hints for compile-time validation and OpenAPI docs.',
          'Pydantic models reject invalid inputs with HTTP 422 Unprocessable Entity automatically.',
          'Always use proper HTTP status codes (201 Created, 204 No Content, 404 Not Found).',
        ],
        outputSimulation: 'POST /api/v1/candidates -> 201 Created -> { status: "registered", username: "alex", score: 92.5 }',
      },
      {
        id: 'w8-l2',
        weekNumber: 8,
        title: 'Full-Stack AI: Model Serving & React Frontend Integration',
        summary: 'Training Scikit-Learn models, avoiding Data Leakage, serializing weights, and consuming real-time predictions from a React client.',
        readTimeMinutes: 5,
        internshipTip: 'Never scale your entire dataset together before splitting! That causes Data Leakage. Fit the scaler on the training set only, then transform the test split.',
        language: 'python',
        codeSnippet: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# 1. Train / Test Split (80% training, 20% holdout test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 2. Fit Estimator on Training Split Only
model = LogisticRegression()
model.fit(X_train, y_train)

# 3. Evaluate Predictions
y_pred = model.predict(X_test)
print(f"Holdout Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(classification_report(y_test, y_pred))`,
        explanationPoints: [
          'Precision = TP / (TP + FP) — Measures prediction purity.',
          'Recall = TP / (TP + FN) — Measures how many actual positive cases were caught.',
          'Serialized models (joblib/ONNX) are deployed behind FastAPI endpoints for real-time frontend consumption.',
        ],
        outputSimulation: 'Model fitted in 12ms | Holdout Accuracy: 0.94 | Precision: 0.92 | Recall: 0.96 | F1: 0.94',
      },
    ],
    challenges: [
      {
        id: 'w8-c1',
        weekNumber: 8,
        pillarId: 'ml-ai',
        title: 'Accuracy & Precision Metrics Calculator',
        difficulty: 'Easy',
        instructions: 'Write `calculateMetrics(tp, fp, tn, fn)` that returns `{ accuracy, precision }` rounded to 2 decimal places. Accuracy = (tp + tn) / total; Precision = tp / (tp + fp). Handle division by zero by returning 0.',
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
        question: 'Why is it considered a critical machine learning defect (Data Leakage) to fit a feature scaler (e.g., StandardScaler) on the entire dataset prior to train/test splitting?',
        options: [
          'Because the test set will have missing columns.',
          'Information (mean and variance) from the test set leaks into the training pipeline, leading to overly optimistic evaluation metrics that fail in production.',
          'NumPy arrays cannot handle scaled test data.',
          'It slows down model inference time by a factor of 2.',
        ],
        correctOptionIndex: 1,
        explanation: 'Data Leakage occurs when data outside the training set influences the model. If you compute mean/standard deviation across test samples, the model has implicitly "seen" the evaluation distribution.',
        screeningContext: 'High-frequency question in Applied AI & ML engineering interviews.',
      },
      {
        id: 'w8-q2',
        weekNumber: 8,
        pillarId: 'ml-ai',
        difficulty: 'Hard',
        question: 'In an AI fraud detection system where missing an actual fraudulent transaction costs thousands of dollars, which evaluation metric must the model be optimized for?',
        options: [
          'Precision (minimize False Positives)',
          'Recall (minimize False Negatives)',
          'Accuracy (total correct classifications)',
          'Mean Squared Error (MSE)',
        ],
        correctOptionIndex: 1,
        explanation: 'Recall = TP / (TP + FN). When False Negatives (missing a fraud event) have severe consequences, optimizing Recall ensures the model flags as many true positive cases as possible.',
        screeningContext: 'Fundamental quantitative metric trade-off question in ML interviews.',
      },
      {
        id: 'w8-q3',
        weekNumber: 8,
        pillarId: 'ml-ai',
        difficulty: 'Medium',
        question: 'Why is NumPy array matrix multiplication `np.dot(X, W)` over 50x faster than writing standard Python nested `for` loops?',
        options: [
          'NumPy uses cloud serverless workers.',
          'NumPy arrays use contiguous memory buffers and execute pre-compiled C/Fortran SIMD vector instructions that utilize CPU cache locality without Python bytecode interpreter overhead.',
          'NumPy converts all data to strings.',
          'Python for-loops run on a single background worker thread.',
        ],
        correctOptionIndex: 1,
        explanation: 'NumPy delegates numerical array computations to optimized BLAS/LAPACK C libraries and SIMD hardware instructions, bypassing dynamic type checks and pointer indirection.',
        screeningContext: 'Essential computational performance question for AI & ML engineers.',
      },
      {
        id: 'w8-q4',
        weekNumber: 8,
        pillarId: 'ml-ai',
        difficulty: 'Easy',
        question: 'In a modern Python FastAPI REST backend, what HTTP status code is automatically returned when a client payload fails Pydantic schema validation?',
        options: [
          '200 OK',
          '422 Unprocessable Entity',
          '500 Internal Server Error',
          '404 Not Found',
        ],
        correctOptionIndex: 1,
        explanation: 'FastAPI uses Pydantic to validate request bodies; when input types or validation constraints fail, it automatically returns HTTP 422 Unprocessable Entity with detailed field error locations.',
        screeningContext: 'Standard FastAPI and REST API design screening check.',
      },
      {
        id: 'w8-q5',
        weekNumber: 8,
        pillarId: 'ml-ai',
        difficulty: 'Medium',
        question: 'What is the most semantically appropriate HTTP status code when an ML inference service successfully creates and stores an asynchronous prediction task in the database?',
        options: [
          '200 OK',
          '201 Created',
          '204 No Content',
          '304 Not Modified',
        ],
        correctOptionIndex: 1,
        explanation: 'HTTP 201 Created informs the client that the request was fulfilled and resulted in a newly created resource entity.',
        screeningContext: 'Core RESTful API status code screening question.',
      },
    ],
  },
];

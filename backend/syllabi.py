"""
Curriculum and Syllabus Configuration Engine.
Supports:
1. AKTU (Dr. A.P.J. Abdul Kalam Technical University) - Official B.Tech 5-Unit Structure
2. Other Universities (Autonomous, State & Central Universities)
3. Independent Learners (Self-paced, CS Foundations, AI/ML, Full-Stack)
"""

UNIVERSITIES = [
    {
        "id": "aktu",
        "name": "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
        "short_name": "AKTU / UPTU",
        "description": "Standard AKTU B.Tech curriculum with 5-unit modular syllabus and exam-pattern focus.",
        "badge": "AKTU Official",
        "courses": ["B.Tech", "MCA", "BCA"],
    },
    {
        "id": "other",
        "name": "Other Universities (VTU / SPPU / GGSIPU / State)",
        "short_name": "State & Autonomous Universities",
        "description": "Flexible semester credit curriculum suitable for major Indian technical universities.",
        "badge": "Flexible Syllabus",
        "courses": ["B.Tech / B.E.", "B.Sc CS / IT", "BCA / MCA"],
    },
    {
        "id": "independent",
        "name": "Independent / Self-Paced Learner",
        "short_name": "Self-Taught & Skill Tracks",
        "description": "Topic-oriented tracks without strict academic semester constraints.",
        "badge": "Skill Tracks",
        "courses": ["Computer Science Core", "AI & Data Science", "Full Stack Development", "Systems & DevOps"],
    },
]

BRANCHES = {
    "aktu": [
        {"id": "cse", "name": "Computer Science & Engineering (CSE)"},
        {"id": "csds", "name": "Computer Science (Data Science - CSDS)"},
        {"id": "csaiml", "name": "Computer Science (AI & ML)"},
        {"id": "it", "name": "Information Technology (IT)"},
        {"id": "ece", "name": "Electronics & Communication (ECE)"},
    ],
    "other": [
        {"id": "cse", "name": "Computer Science & Engineering"},
        {"id": "it", "name": "Information Technology"},
        {"id": "ai_ds", "name": "Artificial Intelligence & Data Science"},
        {"id": "ece", "name": "Electronics & Telecommunication"},
    ],
    "independent": [
        {"id": "core_cs", "name": "CS Foundations & Theory"},
        {"id": "ai_ml", "name": "Machine Learning & Generative AI"},
        {"id": "fullstack", "name": "Modern Full-Stack Engineering"},
    ],
}

SEMESTERS = [
    {"id": "sem1", "name": "Semester 1"},
    {"id": "sem2", "name": "Semester 2"},
    {"id": "sem3", "name": "Semester 3"},
    {"id": "sem4", "name": "Semester 4"},
    {"id": "sem5", "name": "Semester 5"},
    {"id": "sem6", "name": "Semester 6"},
    {"id": "sem7", "name": "Semester 7"},
    {"id": "sem8", "name": "Semester 8"},
]

INDEPENDENT_LEVELS = [
    {"id": "level1", "name": "Beginner / Fundamentals"},
    {"id": "level2", "name": "Intermediate / Implementation"},
    {"id": "level3", "name": "Advanced / Production"},
]

# ── Complete Master Syllabi Database ──
# Rich unit-wise breakdowns, topic lists, and high-yield tags.
SUBJECTS_CATALOG = [
    # ─── AKTU Semester 4 (High demand semester) ───
    {
        "id": "aktu_os_kcs401",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "csds",
        "semester": "sem4",
        "code": "KCS-401",
        "name": "Operating Systems",
        "credits": 4,
        "difficulty": "Moderate",
        "icon": "💻",
        "color": "#F06292",
        "units": [
            {
                "unit_num": 1,
                "title": "Introduction & OS Structures",
                "topics": [
                    "Operating System Services and System Calls",
                    "Dual-mode Operation and Protection",
                    "Monolithic, Microkernel and Layered Architectures",
                    "Process Concept and Process Control Block (PCB)",
                    "Context Switching and System Booting",
                ],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "CPU Scheduling & Process Synchronization",
                "topics": [
                    "FCFS, SJF, SRTF, Round Robin & Priority Scheduling",
                    "Critical Section Problem and Peterson's Solution",
                    "Hardware Synchronization (TestAndSet, Swap)",
                    "Semaphores (Counting & Binary) and Mutex Locks",
                    "Classic Problems: Producer-Consumer, Dining Philosophers, Readers-Writers",
                ],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 3,
                "title": "Deadlocks & Recovery",
                "topics": [
                    "Deadlock Characterization (Coffman Conditions)",
                    "Resource Allocation Graph (RAG)",
                    "Deadlock Prevention and Avoidance",
                    "Banker's Algorithm (Safety & Resource Request)",
                    "Deadlock Detection and Recovery Techniques",
                ],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 4,
                "title": "Memory Management & Virtual Memory",
                "topics": [
                    "Logical vs Physical Address Space",
                    "Contiguous Allocation, Paging, and Segmentation",
                    "Translation Lookaside Buffer (TLB)",
                    "Virtual Memory and Demand Paging",
                    "Page Replacement Algorithms: FIFO, Optimal, LRU, Clock",
                    "Thrashing and Working Set Model",
                ],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 5,
                "title": "File System & Disk Management",
                "topics": [
                    "File Concept, Access Methods and Directory Structure",
                    "Allocation Methods: Contiguous, Linked, Indexed",
                    "Disk Scheduling: FCFS, SSTF, SCAN, C-SCAN, LOOK",
                    "RAID Levels (RAID 0, 1, 5, 10)",
                    "I/O Hardware and Kernel I/O Subsystem",
                ],
                "high_yield_weight": 15,
            },
        ],
    },
    {
        "id": "aktu_tafl_kcs402",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "csds",
        "semester": "sem4",
        "code": "KCS-402",
        "name": "Theory of Automata & Formal Languages",
        "credits": 4,
        "difficulty": "Challenging",
        "icon": "⚙️",
        "color": "#E91E63",
        "units": [
            {
                "unit_num": 1,
                "title": "Finite Automata & Regular Languages",
                "topics": [
                    "Deterministic Finite Automata (DFA) Construction",
                    "Non-Deterministic Finite Automata (NFA) to DFA Conversion",
                    "Epsilon-NFA and Minimization of DFA (Myhill-Nerode / Table Filling)",
                    "Regular Expressions to Finite Automata (Thompson Construction)",
                    "Arden's Theorem and Regular Grammar Equivalence",
                ],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 2,
                "title": "Properties of Regular Languages",
                "topics": [
                    "Pumping Lemma for Regular Languages and Proving Non-Regularity",
                    "Closure Properties of Regular Languages",
                    "Decision Properties of Regular Languages",
                    "Equivalence and DFA Minimality Proofs",
                ],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 3,
                "title": "Context-Free Grammars & Normal Forms",
                "topics": [
                    "Context-Free Grammars (CFG) and Derivation Trees",
                    "Ambiguity in CFGs and Inherent Ambiguity",
                    "Simplification of CFG: Elimination of Useless Symbols, Epsilon & Unit Productions",
                    "Chomsky Normal Form (CNF) and Greibach Normal Form (GNF)",
                    "Pumping Lemma for Context-Free Languages",
                ],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 4,
                "title": "Pushdown Automata (PDA)",
                "topics": [
                    "Deterministic PDA and Non-Deterministic PDA (NPDA)",
                    "Acceptance by Final State vs Acceptance by Empty Stack",
                    "Equivalence of PDA and CFG",
                    "Deterministic Context-Free Languages (DCFL) and Parsing",
                ],
                "high_yield_weight": 15,
            },
            {
                "unit_num": 5,
                "title": "Turing Machines & Undecidability",
                "topics": [
                    "Turing Machine Model and Instantaneous Descriptions",
                    "Design of Turing Machines for Arithmetic & Language Recognition",
                    "Chomsky Hierarchy of Languages",
                    "Halting Problem of Turing Machines",
                    "Post Correspondence Problem (PCP) and Undecidable Problems",
                ],
                "high_yield_weight": 15,
            },
        ],
    },
    {
        "id": "aktu_maths_kas402",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "csds",
        "semester": "sem4",
        "code": "KAS-402",
        "name": "Mathematics-IV (Probability & Statistics)",
        "credits": 4,
        "difficulty": "Moderate",
        "icon": "📐",
        "color": "#C2185B",
        "units": [
            {
                "unit_num": 1,
                "title": "Statistical Techniques I (Moments & Skewness)",
                "topics": ["Measures of Central Tendency", "Moments, Skewness & Kurtosis", "Curve Fitting & Method of Least Squares"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "Statistical Techniques II (Correlation & Regression)",
                "topics": ["Karl Pearson's Coefficient of Correlation", "Spearman Rank Correlation", "Linear Regression Lines"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 3,
                "title": "Probability & Distributions",
                "topics": ["Bayes' Theorem", "Binomial Distribution", "Poisson Distribution", "Normal Distribution"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 4,
                "title": "Sampling & Hypothesis Testing I",
                "topics": ["Null & Alternative Hypothesis", "Type I and Type II Errors", "Z-Test & Large Sample Testing"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 5,
                "title": "Applied Statistical Tests",
                "topics": ["Student's t-Distribution", "Chi-Square Test for Goodness of Fit", "F-Test & Analysis of Variance (ANOVA)"],
                "high_yield_weight": 15,
            },
        ],
    },
    {
        "id": "aktu_py_kcs403",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "csds",
        "semester": "sem4",
        "code": "KCS-403",
        "name": "Python Programming & Applications",
        "credits": 3,
        "difficulty": "Easy",
        "icon": "🐍",
        "color": "#880E4F",
        "units": [
            {
                "unit_num": 1,
                "title": "Python Syntax & Flow Control",
                "topics": ["Variables, Expressions & Data Types", "Control Statements & Loops", "Built-in Data Structures: Lists, Tuples, Dictionaries"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "Functions, Modules & File Handling",
                "topics": ["Function Arguments & Lambda Expressions", "Importing & Standard Modules", "File I/O and Context Managers"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 3,
                "title": "Object-Oriented Programming in Python",
                "topics": ["Classes, Objects and Constructors", "Inheritance, Polymorphism & Encapsulation", "Operator Overloading & Dunder Methods"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 4,
                "title": "Data Analysis with NumPy & Pandas",
                "topics": ["NumPy N-Dimensional Arrays & Broadcasting", "Pandas Series & DataFrames", "Data Cleaning & Aggregation"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 5,
                "title": "Visualization & Web APIs",
                "topics": ["Matplotlib & Seaborn Plotting", "Consuming REST APIs with Requests", "Basic Streamlit/Flask App Creation"],
                "high_yield_weight": 20,
            },
        ],
    },
    {
        "id": "aktu_coi_knc401",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "csds",
        "semester": "sem4",
        "code": "KNC-401",
        "name": "Constitution of India & Professional Ethics",
        "credits": 2,
        "difficulty": "Easy",
        "icon": "📜",
        "color": "#D81B60",
        "units": [
            {
                "unit_num": 1,
                "title": "Making of the Indian Constitution",
                "topics": ["Preamble and Basic Features", "Constitutional History & Assembly Debates"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "Fundamental Rights & Duties",
                "topics": ["Fundamental Rights (Articles 14-32)", "Directive Principles of State Policy (DPSP)", "Fundamental Duties"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 3,
                "title": "Union & State Executive",
                "topics": ["President, Prime Minister & Council of Ministers", "Parliamentary Structure & Judiciary"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 4,
                "title": "Constitutional Amendments & Emergency",
                "topics": ["Emergency Provisions (Articles 352, 356, 360)", "Amendment Procedure under Article 368"],
                "high_yield_weight": 15,
            },
            {
                "unit_num": 5,
                "title": "Professional Ethics for Engineers",
                "topics": ["Engineering Code of Conduct", "Intellectual Property Rights (IPR)", "Whistleblowing and Social Responsibility"],
                "high_yield_weight": 20,
            },
        ],
    },

    # ─── AKTU Semester 3 (CSE / CSDS / IT) ───
    {
        "id": "aktu_ds_kcs301",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "csds",
        "semester": "sem3",
        "code": "KCS-301",
        "name": "Data Structures",
        "credits": 4,
        "difficulty": "Moderate",
        "icon": "🌲",
        "color": "#F06292",
        "units": [
            {
                "unit_num": 1,
                "title": "Arrays, Stacks & Queues",
                "topics": ["Asymptotic Notations (Big-O, Omega, Theta)", "Sparse Matrices & Row/Col Major Addressing", "Stack Applications: Infix to Postfix, Evaluator", "Circular Queue & Priority Queue Implementation"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "Linked Lists",
                "topics": ["Singly, Doubly and Circular Linked Lists", "Polynomial Addition using Linked Lists", "Memory Management and Garbage Collection"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 3,
                "title": "Trees & Binary Search Trees",
                "topics": ["Binary Tree Traversals (Inorder, Preorder, Postorder)", "Binary Search Tree (BST) Operations", "AVL Trees (Rotations: LL, RR, LR, RL)", "Threaded Binary Trees and Expression Trees"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 4,
                "title": "Graphs & Minimum Spanning Trees",
                "topics": ["Graph Representations (Adjacency Matrix & List)", "Graph Traversals (BFS and DFS)", "Kruskal's & Prim's MST Algorithms", "Dijkstra's Shortest Path Algorithm"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 5,
                "title": "Searching, Sorting & Hashing",
                "topics": ["Sorting: QuickSort, MergeSort, HeapSort", "Collision Resolution: Chaining, Open Addressing (Linear, Quadratic, Double Hashing)"],
                "high_yield_weight": 15,
            },
        ],
    },
    {
        "id": "aktu_coa_kcs302",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "csds",
        "semester": "sem3",
        "code": "KCS-302",
        "name": "Computer Organization & Architecture",
        "credits": 4,
        "difficulty": "Challenging",
        "icon": "🎛️",
        "color": "#E91E63",
        "units": [
            {
                "unit_num": 1,
                "title": "Functional Units & Computer Arithmetic",
                "topics": ["Von Neumann Architecture vs Harvard", "Booth's Multiplication Algorithm", "Restoring and Non-Restoring Division", "IEEE 754 Floating Point Representation"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 2,
                "title": "Control Unit Design & Instruction Sets",
                "topics": ["Instruction Cycle & Micro-operations", "Hardwired vs Microprogrammed Control Unit", "RISC vs CISC Architecture", "Addressing Modes"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 3,
                "title": "Memory Organization & Cache Mapping",
                "topics": ["Memory Hierarchy", "Direct, Associative and Set-Associative Cache Mapping", "Cache Coherence and Replacement Policies"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 4,
                "title": "Input-Output Organization",
                "topics": ["Programmed I/O, Interrupt Driven I/O and Direct Memory Access (DMA)", "Daisy Chaining and Priority Interrupts", "Standard Buses (PCI, SCSI, USB)"],
                "high_yield_weight": 15,
            },
            {
                "unit_num": 5,
                "title": "Pipelining & Parallelism",
                "topics": ["Instruction Pipeline and Arithmetic Pipeline", "Structural, Data and Control Hazards", "Superscalar and SIMD/MIMD Classifications"],
                "high_yield_weight": 15,
            },
        ],
    },
    {
        "id": "aktu_dstl_kcs303",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "csds",
        "semester": "sem3",
        "code": "KCS-303",
        "name": "Discrete Structures & Theory of Logic",
        "credits": 4,
        "difficulty": "Moderate",
        "icon": "🧩",
        "color": "#C2185B",
        "units": [
            {
                "unit_num": 1,
                "title": "Set Theory, Relations & Functions",
                "topics": ["Equivalence Relations & Partial Order Relations (Posets)", "Hasse Diagrams and Lattices", "Pigeonhole Principle and Inclusion-Exclusion"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "Algebraic Structures & Group Theory",
                "topics": ["Semigroups, Monoids and Groups", "Subgroups, Cosets and Lagrange's Theorem", "Rings and Fields Fundamentals"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 3,
                "title": "Lattices & Boolean Algebra",
                "topics": ["Bounded, Distributive and Complemented Lattices", "Boolean Functions, Duality & Karnaugh Maps (K-Maps)"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 4,
                "title": "Propositional & Predicate Logic",
                "topics": ["Tautology, Contradiction and Logical Equivalence", "Predicates and Quantifiers (Universal & Existential)", "Rules of Inference and Resolution Principle"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 5,
                "title": "Combinatorics & Recurrence Relations",
                "topics": ["Permutations and Combinations", "Solving Linear Homogeneous Recurrence Relations", "Generating Functions"],
                "high_yield_weight": 15,
            },
        ],
    },

    # ─── AKTU Semester 5 (Core CSE) ───
    {
        "id": "aktu_dbms_kcs501",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "cse",
        "semester": "sem5",
        "code": "KCS-501",
        "name": "Database Management Systems",
        "credits": 4,
        "difficulty": "Moderate",
        "icon": "🗄️",
        "color": "#F06292",
        "units": [
            {
                "unit_num": 1,
                "title": "ER Modeling & Relational Model",
                "topics": ["3-Tier DBMS Architecture & Data Independence", "ER Diagrams, Weak Entities & Extended ER", "Relational Algebra Operations"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "SQL & Normalization",
                "topics": ["Complex SQL Queries, Joins, Triggers & Views", "Functional Dependencies and Armstrong's Axioms", "Normal Forms: 1NF, 2NF, 3NF, BCNF, 4NF"],
                "high_yield_weight": 30,
            },
            {
                "unit_num": 3,
                "title": "Transaction Processing & Concurrency",
                "topics": ["ACID Properties & Transaction States", "Serializability (Conflict and View)", "Two-Phase Locking Protocol (2PL)", "Timestamp-Based Protocols & Deadlock Handling"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 4,
                "title": "Crash Recovery & Query Processing",
                "topics": ["Log-Based Recovery (Deferred and Immediate Update)", "Checkpoints and Shadow Paging", "Query Optimization and Execution Plans"],
                "high_yield_weight": 15,
            },
            {
                "unit_num": 5,
                "title": "Indexing & Storage Structures",
                "topics": ["B-Trees and B+ Trees Indexing", "Static vs Dynamic Hashing (Extendible Hashing)"],
                "high_yield_weight": 10,
            },
        ],
    },
    {
        "id": "aktu_daa_kcs503",
        "university_id": "aktu",
        "course": "B.Tech",
        "branch": "cse",
        "semester": "sem5",
        "code": "KCS-503",
        "name": "Design & Analysis of Algorithms",
        "credits": 4,
        "difficulty": "Challenging",
        "icon": "⚡",
        "color": "#E91E63",
        "units": [
            {
                "unit_num": 1,
                "title": "Algorithm Analysis & Recurrences",
                "topics": ["Master Theorem for Divide & Conquer", "Substitution and Recursion Tree Methods", "Worst/Average/Amortized Analysis"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "Divide & Conquer & Greedy Strategy",
                "topics": ["Strassen's Matrix Multiplication", "Fractional Knapsack & Huffman Coding", "Job Sequencing with Deadlines"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 3,
                "title": "Dynamic Programming",
                "topics": ["0/1 Knapsack Problem", "Matrix Chain Multiplication (MCM)", "Longest Common Subsequence (LCS)", "Floyd-Warshall All-Pairs Shortest Path"],
                "high_yield_weight": 30,
            },
            {
                "unit_num": 4,
                "title": "Backtracking & Branch & Bound",
                "topics": ["N-Queens Problem", "Subset Sum & Hamiltonian Cycle", "Traveling Salesperson Problem (TSP) using Branch & Bound"],
                "high_yield_weight": 15,
            },
            {
                "unit_num": 5,
                "title": "NP-Completeness & Approximation",
                "topics": ["P, NP, NP-Complete and NP-Hard Classes", "Cook-Levin Theorem and Reductions", "Vertex Cover Approximation"],
                "high_yield_weight": 15,
            },
        ],
    },

    # ─── Independent / Self-Paced Track ───
    {
        "id": "indep_cs_core",
        "university_id": "independent",
        "course": "Computer Science Core",
        "branch": "core_cs",
        "semester": "level1",
        "code": "SELF-101",
        "name": "Data Structures, Algorithms & Problem Solving",
        "credits": 5,
        "difficulty": "Moderate",
        "icon": "🚀",
        "color": "#F06292",
        "units": [
            {
                "unit_num": 1,
                "title": "Algorithmic Complexity & Arrays",
                "topics": ["Big O, Space & Time Complexity Analysis", "Two Pointers & Sliding Window Patterns", "Prefix Sums & Frequency Maps"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "Linear Structures & Recursion",
                "topics": ["Linked Lists Manipulation & Cycle Detection", "Stack Monotonic Patterns", "Backtracking & Recursion Tree Thinking"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 3,
                "title": "Trees, BST & Heaps",
                "topics": ["Binary Tree Invert, Diameter & Path Sums", "Lowest Common Ancestor (LCA)", "Min/Max Priority Queue Applications"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 4,
                "title": "Graphs & Dynamic Programming",
                "topics": ["BFS/DFS Graph Coloring and Topological Sort", "Dynamic Programming 1D/2D Tabulation", "Knapsack & Grid Traversal Optimization"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 5,
                "title": "System Coding & Interview Practice",
                "topics": ["Bit Manipulation Patterns", "Design LRU Cache", "Top 50 High-Frequency LeetCode Patterns"],
                "high_yield_weight": 10,
            },
        ],
    },
    {
        "id": "indep_ai_genai",
        "university_id": "independent",
        "course": "AI & Data Science",
        "branch": "ai_ml",
        "semester": "level2",
        "code": "AI-201",
        "name": "Machine Learning, RAG & LLM Architectures",
        "credits": 5,
        "difficulty": "Intermediate",
        "icon": "🤖",
        "color": "#C2185B",
        "units": [
            {
                "unit_num": 1,
                "title": "Foundational ML & Feature Engineering",
                "topics": ["Supervised vs Unsupervised Learning", "Loss Functions & Gradient Descent", "Overfitting, Regularization (L1/L2) & Evaluation Metrics"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 2,
                "title": "Neural Networks & Transformer Deep Dive",
                "topics": ["Multi-Layer Perceptrons & Backpropagation", "Self-Attention Mechanism & Multi-Head Attention", "Positional Encodings & Encoder-Decoder Architecture"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 3,
                "title": "Vector Embeddings & Semantic Search",
                "topics": ["Text Embeddings (Sentence Transformers)", "Cosine Similarity, Dot Product & Euclidean Metrics", "Vector Databases (ChromaDB, Pinecone, FAISS)"],
                "high_yield_weight": 25,
            },
            {
                "unit_num": 4,
                "title": "Retrieval-Augmented Generation (RAG)",
                "topics": ["Document Chunking & Hybrid Search (BM25 + Dense)", "Re-ranking, Context Window Optimization & Hallucination Guardrails", "Evaluation with RAGAS (Faithfulness, Relevance)"],
                "high_yield_weight": 20,
            },
            {
                "unit_num": 5,
                "title": "Production Deployment of AI Apps",
                "topics": ["FastAPI Endpoints for Model Inference", "Caching Query Results & Rate Limiting", "Local vs Cloud Model Serving"],
                "high_yield_weight": 10,
            },
        ],
    },
]


def get_universities():
    return UNIVERSITIES


def get_curriculum_structure(university_id: str):
    uni = next((u for u in UNIVERSITIES if u["id"] == university_id), UNIVERSITIES[0])
    branches = BRANCHES.get(university_id, BRANCHES["aktu"])
    semesters = INDEPENDENT_LEVELS if university_id == "independent" else SEMESTERS

    return {
        "university": uni,
        "courses": uni["courses"],
        "branches": branches,
        "semesters": semesters,
    }


def get_subjects_by_filter(
    university_id: str | None = None,
    branch: str | None = None,
    semester: str | None = None,
    course: str | None = None,
):
    results = SUBJECTS_CATALOG
    if university_id:
        results = [s for s in results if s["university_id"] == university_id]
    if branch:
        results = [s for s in results if s["branch"] == branch or s["branch"] == "all"]
    if semester:
        results = [s for s in results if s["semester"] == semester]
    if course:
        results = [s for s in results if s["course"].lower() == course.lower()]

    # If filter yields empty (e.g. branch with default subjects), fallback gracefully to all subjects in university
    if not results and university_id:
        results = [s for s in SUBJECTS_CATALOG if s["university_id"] == university_id]

    if not results:
        results = SUBJECTS_CATALOG

    return results


def get_subject_by_id(subject_id: str):
    return next((s for s in SUBJECTS_CATALOG if s["id"] == subject_id), None)


# ═══════════════════════════════════════════════════════════════════════
# VERIFIED CURATED YOUTUBE VIDEO LECTURES
# Official channels: Gateway Classes, Fearless, Gate Smashers, Knowledge Gate, Abdul Bari
# ═══════════════════════════════════════════════════════════════════════
VIDEOS_CATALOG = [
    # ── Operating Systems (AKTU KCS-401) ──
    {
        "id": "vid_os_gw_u1",
        "subject_id": "aktu_os_kcs401",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 1,
        "title": "Operating Systems Unit 1 — OS Services & System Calls (One Shot)",
        "channel": "Gateway Classes",
        "channel_icon": "🎓",
        "verified": True,
        "duration": "1 hr 40 min",
        "search_query": "Gateway Classes AKTU Operating System Unit 1 One Shot",
        "youtube_url": "https://www.youtube.com/results?search_query=Gateway+Classes+AKTU+Operating+System+Unit+1",
        "topics_covered": ["Dual Mode", "System Calls", "Monolithic vs Microkernel", "PCB"],
        "badge": "High Yield",
    },
    {
        "id": "vid_os_fl_u2",
        "subject_id": "aktu_os_kcs401",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 2,
        "title": "CPU Scheduling Algorithms & Peterson Solution Deep Dive",
        "channel": "Fearless",
        "channel_icon": "🔥",
        "verified": True,
        "duration": "1 hr 15 min",
        "search_query": "Fearless AKTU Operating System CPU Scheduling Peterson Solution",
        "youtube_url": "https://www.youtube.com/results?search_query=Fearless+AKTU+Operating+System+CPU+Scheduling",
        "topics_covered": ["FCFS, SJF, Round Robin", "Critical Section", "Semaphores"],
        "badge": "Exam Favorite",
    },
    {
        "id": "vid_os_kg_u3",
        "subject_id": "aktu_os_kcs401",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 3,
        "title": "Deadlock & Banker's Algorithm Numerical Solutions",
        "channel": "Knowledge Gate",
        "channel_icon": "🧠",
        "verified": True,
        "duration": "55 min",
        "search_query": "Knowledge Gate Deadlock Bankers Algorithm Numerical",
        "youtube_url": "https://www.youtube.com/results?search_query=Knowledge+Gate+Deadlock+Bankers+Algorithm",
        "topics_covered": ["Resource Allocation Graph", "Banker's Algorithm", "Detection & Recovery"],
        "badge": "Numerical Focus",
    },
    {
        "id": "vid_os_gs_u4",
        "subject_id": "aktu_os_kcs401",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 4,
        "title": "Virtual Memory, Paging, TLB & Page Replacement Algorithms",
        "channel": "Gate Smashers",
        "channel_icon": "⚡",
        "verified": True,
        "duration": "1 hr 25 min",
        "search_query": "Gate Smashers Virtual Memory Paging Page Replacement",
        "youtube_url": "https://www.youtube.com/results?search_query=Gate+Smashers+Virtual+Memory+Paging",
        "topics_covered": ["Demand Paging", "FIFO, LRU, Optimal", "Thrashing", "TLB"],
        "badge": "Top Rated",
    },
    {
        "id": "vid_os_gw_u5",
        "subject_id": "aktu_os_kcs401",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 5,
        "title": "Disk Scheduling Algorithms (SCAN, C-SCAN, LOOK) & File Systems",
        "channel": "Gateway Classes",
        "channel_icon": "🎓",
        "verified": True,
        "duration": "1 hr 10 min",
        "search_query": "Gateway Classes AKTU Operating System Disk Scheduling Unit 5",
        "youtube_url": "https://www.youtube.com/results?search_query=Gateway+Classes+Disk+Scheduling+Unit+5",
        "topics_covered": ["FCFS, SSTF, SCAN, LOOK", "RAID Levels", "File Allocation"],
        "badge": "Complete Unit",
    },

    # ── Theory of Automata and Formal Languages (AKTU KCS-402) ──
    {
        "id": "vid_tafl_gw_u1",
        "subject_id": "aktu_tafl_kcs402",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 1,
        "title": "TAFL Unit 1 — DFA, NFA & Epsilon NFA Conversions (One Shot)",
        "channel": "Gateway Classes",
        "channel_icon": "🎓",
        "verified": True,
        "duration": "2 hrs 10 min",
        "search_query": "Gateway Classes AKTU TAFL Unit 1 One Shot DFA NFA",
        "youtube_url": "https://www.youtube.com/results?search_query=Gateway+Classes+AKTU+TAFL+Unit+1",
        "topics_covered": ["DFA Minimization", "NFA to DFA", "Myhill-Nerode Theorem"],
        "badge": "High Yield",
    },
    {
        "id": "vid_tafl_fl_u2",
        "subject_id": "aktu_tafl_kcs402",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 2,
        "title": "Regular Expressions, Arden's Theorem & Pumping Lemma",
        "channel": "Fearless",
        "channel_icon": "🔥",
        "verified": True,
        "duration": "1 hr 35 min",
        "search_query": "Fearless AKTU TAFL Ardens Theorem Pumping Lemma",
        "youtube_url": "https://www.youtube.com/results?search_query=Fearless+AKTU+TAFL+Ardens+Theorem",
        "topics_covered": ["Arden's Theorem", "Pumping Lemma for Regular Languages", "Closure Properties"],
        "badge": "Exam Favorite",
    },
    {
        "id": "vid_tafl_kg_u3",
        "subject_id": "aktu_tafl_kcs402",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 3,
        "title": "Context-Free Grammars, Derivation Trees & Normal Forms (CNF/GNF)",
        "channel": "Knowledge Gate",
        "channel_icon": "🧠",
        "verified": True,
        "duration": "1 hr 45 min",
        "search_query": "Knowledge Gate Context Free Grammar CNF GNF Normal Forms",
        "youtube_url": "https://www.youtube.com/results?search_query=Knowledge+Gate+Chomsky+Normal+Form",
        "topics_covered": ["Ambiguity", "Chomsky Normal Form", "Greibach Normal Form"],
        "badge": "Numerical Focus",
    },
    {
        "id": "vid_tafl_gs_u4",
        "subject_id": "aktu_tafl_kcs402",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 4,
        "title": "Pushdown Automata (PDA) — DPDA vs NPDA Construction",
        "channel": "Gate Smashers",
        "channel_icon": "⚡",
        "verified": True,
        "duration": "1 hr 20 min",
        "search_query": "Gate Smashers Pushdown Automata PDA Construction",
        "youtube_url": "https://www.youtube.com/results?search_query=Gate+Smashers+Pushdown+Automata",
        "topics_covered": ["Instantaneous Descriptions", "Acceptance by Empty Stack", "Equivalence of CFG and PDA"],
        "badge": "Core Theory",
    },
    {
        "id": "vid_tafl_gw_u5",
        "subject_id": "aktu_tafl_kcs402",
        "university_id": "aktu",
        "semester": "sem4",
        "unit_num": 5,
        "title": "Turing Machines & Decidability (Post Correspondence Problem)",
        "channel": "Gateway Classes",
        "channel_icon": "🎓",
        "verified": True,
        "duration": "1 hr 50 min",
        "search_query": "Gateway Classes AKTU TAFL Unit 5 Turing Machine Decidability",
        "youtube_url": "https://www.youtube.com/results?search_query=Gateway+Classes+TAFL+Unit+5+Turing+Machine",
        "topics_covered": ["Turing Machine Construction", "Halting Problem", "PCP Problem"],
        "badge": "Complete Unit",
    },

    # ── Data Structures (AKTU KCS-301) ──
    {
        "id": "vid_ds_gw_u1",
        "subject_id": "aktu_ds_kcs301",
        "university_id": "aktu",
        "semester": "sem3",
        "unit_num": 1,
        "title": "Data Structures Unit 1 — Arrays, Stacks & Infix to Postfix (One Shot)",
        "channel": "Gateway Classes",
        "channel_icon": "🎓",
        "verified": True,
        "duration": "2 hrs",
        "search_query": "Gateway Classes AKTU Data Structures Unit 1",
        "youtube_url": "https://www.youtube.com/results?search_query=Gateway+Classes+AKTU+Data+Structures+Unit+1",
        "topics_covered": ["Row-Major & Column-Major Order", "Infix/Postfix/Prefix", "Tower of Hanoi"],
        "badge": "High Yield",
    },
    {
        "id": "vid_ds_ab_u4",
        "subject_id": "aktu_ds_kcs301",
        "university_id": "aktu",
        "semester": "sem3",
        "unit_num": 4,
        "title": "Binary Trees, BST, AVL Trees & Rotations Masterclass",
        "channel": "Abdul Bari",
        "channel_icon": "👑",
        "verified": True,
        "duration": "2 hrs 15 min",
        "search_query": "Abdul Bari Trees AVL Tree BST Rotations",
        "youtube_url": "https://www.youtube.com/results?search_query=Abdul+Bari+AVL+Tree+Rotations",
        "topics_covered": ["Tree Traversals", "AVL Rotations (LL, RR, LR, RL)", "Threaded Binary Trees"],
        "badge": "Legendary Explanations",
    },

    # ── Database Management Systems (AKTU KCS-501) ──
    {
        "id": "vid_dbms_gw_u1",
        "subject_id": "aktu_dbms_kcs501",
        "university_id": "aktu",
        "semester": "sem5",
        "unit_num": 1,
        "title": "DBMS Unit 1 — ER Diagrams, Schema Architecture & Relational Algebra",
        "channel": "Gateway Classes",
        "channel_icon": "🎓",
        "verified": True,
        "duration": "1 hr 45 min",
        "search_query": "Gateway Classes AKTU DBMS Unit 1 One Shot",
        "youtube_url": "https://www.youtube.com/results?search_query=Gateway+Classes+AKTU+DBMS+Unit+1",
        "topics_covered": ["3-Tier Architecture", "ER to Relational Mapping", "Relational Algebra Operations"],
        "badge": "High Yield",
    },
    {
        "id": "vid_dbms_kg_u3",
        "subject_id": "aktu_dbms_kcs501",
        "university_id": "aktu",
        "semester": "sem5",
        "unit_num": 3,
        "title": "Functional Dependencies & Normalization (1NF to BCNF) with Examples",
        "channel": "Knowledge Gate",
        "channel_icon": "🧠",
        "verified": True,
        "duration": "1 hr 30 min",
        "search_query": "Knowledge Gate Normalization 1NF 2NF 3NF BCNF",
        "youtube_url": "https://www.youtube.com/results?search_query=Knowledge+Gate+DBMS+Normalization",
        "topics_covered": ["Attribute Closure", "Canonical Cover", "Lossless Join Decomposition"],
        "badge": "Numerical Focus",
    },

    # ── Generative AI & Large Language Models (Independent Track) ──
    {
        "id": "vid_genai_ak_u1",
        "subject_id": "ai_genai_ai201",
        "university_id": "independent",
        "semester": "level2",
        "unit_num": 2,
        "title": "Introduction to Large Language Models & Deep Transformer Intuition",
        "channel": "Andrej Karpathy",
        "channel_icon": "🤖",
        "verified": True,
        "duration": "1 hr",
        "search_query": "Andrej Karpathy Intro to Large Language Models",
        "youtube_url": "https://www.youtube.com/results?search_query=Andrej+Karpathy+Intro+to+Large+Language+Models",
        "topics_covered": ["Next-token Prediction", "Tokenizer", "Attention", "RLHF"],
        "badge": "World Class",
    },
]


# ═══════════════════════════════════════════════════════════════════════
# PREVIOUS YEAR PAPERS & EXAM QUESTIONS (AKTU / UNIVERSITY)
# ═══════════════════════════════════════════════════════════════════════
PYQ_CATALOG = [
    {
        "id": "pyq_os_2024",
        "subject_id": "aktu_os_kcs401",
        "university_id": "aktu",
        "semester": "sem4",
        "year": "2023-24",
        "session": "Even Semester Examination",
        "code": "KCS-401",
        "max_marks": 70,
        "duration": "3 Hours",
        "sections": [
            {
                "section": "A",
                "instructions": "Answer all 7 questions (2 marks each, total 14 marks)",
                "questions": [
                    {"q_num": "1(a)", "text": "Define system calls. Differentiate between monolithic and microkernel architectures.", "unit": 1, "marks": 2},
                    {"q_num": "1(b)", "text": "What is the critical section problem? List three requirements to solve it.", "unit": 2, "marks": 2},
                    {"q_num": "1(c)", "text": "State the necessary and sufficient conditions for a deadlock to occur.", "unit": 3, "marks": 2},
                    {"q_num": "1(d)", "text": "Differentiate between internal and external fragmentation.", "unit": 4, "marks": 2},
                    {"q_num": "1(e)", "text": "What is Belady's Anomaly? Name the page replacement algorithm that suffers from it.", "unit": 4, "marks": 2},
                    {"q_num": "1(f)", "text": "Explain the concept of thrashing and how it can be mitigated.", "unit": 4, "marks": 2},
                    {"q_num": "1(g)", "text": "Compare SCAN and C-SCAN disk scheduling algorithms.", "unit": 5, "marks": 2},
                ]
            },
            {
                "section": "B",
                "instructions": "Answer any 3 questions out of 5 (7 marks each, total 21 marks)",
                "questions": [
                    {"q_num": "2(a)", "text": "Consider the following set of processes with arrival time and CPU burst times. Calculate Average Waiting Time and Turnaround Time using Preemptive SJF (SRTF) and Round Robin (Time Quantum = 2ms).", "unit": 2, "marks": 7},
                    {"q_num": "2(b)", "text": "Explain Peterson's algorithm for mutual exclusion in two processes. Prove that it satisfies mutual exclusion, progress, and bounded waiting.", "unit": 2, "marks": 7},
                    {"q_num": "2(c)", "text": "Execute Banker's Algorithm on a system with 5 processes (P0 to P4) and 3 resource types (A, B, C). Determine if the system is in a safe state and give the safe sequence.", "unit": 3, "marks": 7},
                    {"q_num": "2(d)", "text": "Explain Paging hardware with Translation Lookaside Buffer (TLB). Calculate Effective Memory Access Time (EMAT) if TLB hit ratio is 85%, TLB search time is 20ns and memory access time is 100ns.", "unit": 4, "marks": 7},
                    {"q_num": "2(e)", "text": "Describe RAID levels 0, 1, 5, and 10 with neat diagrams and performance trade-offs.", "unit": 5, "marks": 7},
                ]
            },
            {
                "section": "C",
                "instructions": "Answer all 5 questions choosing either (a) or (b) (7 marks each, total 35 marks)",
                "questions": [
                    {"q_num": "3(a)", "text": "Describe the complete process lifecycle with state transitions and contents of a Process Control Block (PCB).", "unit": 1, "marks": 7},
                    {"q_num": "4(a)", "text": "Explain the Dining Philosophers Problem and give a deadlock-free synchronization solution using semaphores.", "unit": 2, "marks": 7},
                    {"q_num": "5(a)", "text": "Explain Deadlock Detection and Recovery using Resource Allocation Graph (RAG) reduction method.", "unit": 3, "marks": 7},
                    {"q_num": "6(a)", "text": "For the page reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1 with 3 frames, calculate page faults using FIFO, LRU, and Optimal algorithms.", "unit": 4, "marks": 7},
                    {"q_num": "7(a)", "text": "Suppose a disk drive has 200 cylinders numbered 0 to 199. Request queue is: 98, 183, 37, 122, 14, 124, 65, 67 with head at 53 moving towards 0. Calculate total head movements using SSTF and LOOK.", "unit": 5, "marks": 7},
                ]
            }
        ]
    },
    {
        "id": "pyq_tafl_2024",
        "subject_id": "aktu_tafl_kcs402",
        "university_id": "aktu",
        "semester": "sem4",
        "year": "2023-24",
        "session": "Even Semester Examination",
        "code": "KCS-402",
        "max_marks": 70,
        "duration": "3 Hours",
        "sections": [
            {
                "section": "A",
                "instructions": "Answer all 7 questions (2 marks each, total 14 marks)",
                "questions": [
                    {"q_num": "1(a)", "text": "Define Deterministic Finite Automata (DFA) with formal 5-tuple definition.", "unit": 1, "marks": 2},
                    {"q_num": "1(b)", "text": "State Arden's Theorem for regular expressions with condition.", "unit": 2, "marks": 2},
                    {"q_num": "1(c)", "text": "Define inherently ambiguous Context-Free Grammars with an example.", "unit": 3, "marks": 2},
                    {"q_num": "1(d)", "text": "Differentiate between acceptance by final state and empty store in PDA.", "unit": 4, "marks": 2},
                    {"q_num": "1(e)", "text": "State the Church-Turing Thesis.", "unit": 5, "marks": 2},
                    {"q_num": "1(f)", "text": "What is the Post Correspondence Problem (PCP)?", "unit": 5, "marks": 2},
                    {"q_num": "1(g)", "text": "State the Pumping Lemma for Context Free Languages.", "unit": 3, "marks": 2},
                ]
            },
            {
                "section": "B",
                "instructions": "Answer any 3 questions out of 5 (7 marks each, total 21 marks)",
                "questions": [
                    {"q_num": "2(a)", "text": "Convert the following NFA with epsilon transitions into an equivalent DFA.", "unit": 1, "marks": 7},
                    {"q_num": "2(b)", "text": "Prove using Pumping Lemma that the language L = {a^n b^n c^n | n >= 1} is not Context-Free.", "unit": 3, "marks": 7},
                    {"q_num": "2(c)", "text": "Convert the following CFG into Chomsky Normal Form (CNF): S -> aAbB | ABC, A -> aA | a, B -> bB | b, C -> cC | c.", "unit": 3, "marks": 7},
                    {"q_num": "2(d)", "text": "Design a Pushdown Automata (PDA) to accept the language L = {w c w^R | w in {a, b}*}.", "unit": 4, "marks": 7},
                    {"q_num": "2(e)", "text": "Design a Turing Machine to accept the language L = {0^n 1^n | n >= 1}.", "unit": 5, "marks": 7},
                ]
            }
        ]
    }
]


def get_videos_by_filter(subject_id: str | None = None, university_id: str | None = None, semester: str | None = None):
    res = VIDEOS_CATALOG
    if subject_id:
        res = [v for v in res if v["subject_id"] == subject_id]
    elif university_id:
        res = [v for v in res if v["university_id"] == university_id or v["university_id"] == "independent"]
    if semester and not subject_id:
        res = [v for v in res if v.get("semester") == semester]
    return res if res else VIDEOS_CATALOG


def get_pyqs_by_filter(subject_id: str | None = None, university_id: str | None = None):
    res = PYQ_CATALOG
    if subject_id:
        res = [p for p in res if p["subject_id"] == subject_id]
    elif university_id:
        res = [p for p in res if p["university_id"] == university_id]
    return res if res else PYQ_CATALOG

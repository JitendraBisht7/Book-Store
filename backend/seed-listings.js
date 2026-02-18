require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const books = [
    { title: 'Engineering Mathematics', price: 250, description: 'Advanced engineering mathematics textbook by Erwin Kreyszig. Covers linear algebra, ODEs, complex analysis, and numerical methods. Good condition, some highlighting.' },
    { title: 'Data Structures and Algorithms', price: 320, description: 'Comprehensive DSA book covering arrays, linked lists, trees, graphs, sorting, searching. Perfect for coding interview prep. Like new.' },
    { title: 'Introduction to Algorithms (CLRS)', price: 450, description: 'The classic CLRS textbook, 3rd edition. Covers all major algorithms and data structures in depth. Hardcover, minor wear.' },
    { title: 'Operating System Concepts', price: 280, description: 'Silberschatz OS textbook covering processes, threads, memory management, file systems. 9th edition. Clean pages.' },
    { title: 'Computer Networks', price: 300, description: 'Tanenbaum Computer Networks, 5th edition. OSI model, TCP/IP, routing, application layer protocols. Good for semester exams.' },
    { title: 'Database System Concepts', price: 350, description: 'Korth and Sudarshan DBMS textbook. SQL, normalization, transactions, indexing. Well maintained, no markings.' },
    { title: 'Digital Logic Design', price: 180, description: 'Morris Mano digital logic book. Boolean algebra, combinational and sequential circuits, flip-flops, counters. Slightly used.' },
    { title: 'Object Oriented Programming with C++', price: 200, description: 'Balagurusamy C++ OOP textbook. Classes, inheritance, polymorphism, templates, exception handling. Clean copy.' },
    { title: 'Theory of Computation', price: 220, description: 'Automata theory textbook. DFA, NFA, context-free grammars, Turing machines, undecidability. Some pencil notes.' },
    { title: 'Discrete Mathematics', price: 270, description: 'Kenneth Rosen Discrete Mathematics textbook. Logic, sets, relations, graph theory, combinatorics. Great condition.' },
    { title: 'Software Engineering', price: 230, description: 'Pressman Software Engineering textbook. SDLC, agile, design patterns, testing, project management. 8th edition.' },
    { title: 'Artificial Intelligence: A Modern Approach', price: 500, description: 'Russell and Norvig AI textbook, 4th edition. Search, knowledge representation, machine learning, NLP. Like new.' },
    { title: 'Machine Learning by Tom Mitchell', price: 380, description: 'Classic ML textbook. Decision trees, neural networks, Bayesian learning, instance-based learning. Hardcover.' },
    { title: 'Compiler Design', price: 240, description: 'Aho, Sethi, Ullman - Dragon Book. Lexical analysis, parsing, code generation, optimization. Some highlighting.' },
    { title: 'Microprocessor and Microcontroller', price: 190, description: '8085 and 8086 microprocessor textbook. Assembly language, interfacing, interrupts. Well used but readable.' },
    { title: 'Physics for Engineers', price: 210, description: 'University physics textbook. Mechanics, thermodynamics, electromagnetism, optics, modern physics. Clean copy.' },
    { title: 'Engineering Chemistry', price: 150, description: 'First year engineering chemistry. Electrochemistry, polymers, water treatment, corrosion. Paperback, good condition.' },
    { title: 'Linear Algebra', price: 280, description: 'Gilbert Strang Linear Algebra textbook. Vector spaces, eigenvalues, SVD, applications. Excellent condition.' },
    { title: 'Probability and Statistics', price: 260, description: 'Probability, random variables, distributions, hypothesis testing, regression analysis. Clean, no markings.' },
    { title: 'Web Development with JavaScript', price: 340, description: 'Full stack web dev book. HTML, CSS, JavaScript, React, Node.js, MongoDB. Recent edition, like new.' },
    { title: 'Python Programming', price: 290, description: 'Learn Python programming from basics to advanced. OOP, file handling, web scraping, data analysis. Brand new.' },
    { title: 'Java: The Complete Reference', price: 400, description: 'Herbert Schildt Java textbook. Core Java, multithreading, I/O, networking, JavaFX. 11th edition.' },
    { title: 'Signals and Systems', price: 310, description: 'Oppenheim Signals and Systems textbook. Fourier, Laplace, Z-transforms, LTI systems, sampling. Minor wear.' },
    { title: 'Control Systems Engineering', price: 270, description: 'Nagrath and Gopal Control Systems. Transfer functions, stability, root locus, Bode plots. Clean condition.' },
    { title: 'Electronics Devices and Circuits', price: 220, description: 'Boylestad electronic devices textbook. Diodes, BJT, FET, amplifiers, oscillators. Paperback, well maintained.' },
    { title: 'Communication Systems', price: 330, description: 'Haykin Communication Systems textbook. AM, FM, digital modulation, noise, information theory. 5th edition.' },
    { title: 'Numerical Methods', price: 180, description: 'Numerical analysis textbook. Root finding, interpolation, integration, ODE solvers, curve fitting. Some notes inside.' },
    { title: 'Environmental Engineering', price: 170, description: 'Environmental science and engineering. Air pollution, water treatment, solid waste, EIA. Good for semester exams.' },
    { title: 'Engineering Graphics', price: 160, description: 'Engineering drawing textbook. Projections, sections, isometric views, AutoCAD basics. Includes drawing sheets.' },
    { title: 'Thermodynamics', price: 290, description: 'PK Nag Engineering Thermodynamics. Laws of thermodynamics, entropy, cycles, refrigeration. 6th edition, clean.' },
];

const seedListings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // Find user by email
        const user = await User.findOne({ email: 'jitu@gmail.com' });
        if (!user) {
            console.error('User jitu@gmail.com not found! Please register first.');
            process.exit(1);
        }

        console.log(`Found user: ${user.username} (${user._id})`);

        // Create products
        const products = books.map(book => ({
            ...book,
            image: `https://via.placeholder.com/400x500?text=${encodeURIComponent(book.title.substring(0, 20))}`,
            owner: user._id,
        }));

        const result = await Product.insertMany(products);
        console.log(`Successfully created ${result.length} listings for ${user.username}!`);

        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

seedListings();

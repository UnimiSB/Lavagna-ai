Lavagna AI (branded in-app as "AI & Prompting per Avvocati") is a specialized web application designed as an interactive guide for Italian lawyers to master Artificial Intelligence and prompting techniques.

🏛️ Context & Purpose
Developed for the Ordine degli Avvocati di Como (Como Bar Association), this project serves as a digital handbook ("prontuario") resulting from training sessions held in late 2024 and early 2025. Its goal is to provide legal professionals with a structured way to learn, test, and implement AI in their daily civil and criminal practice.

🚀 Key Functional Areas
Prompting Catalog: A searchable library of legal-specific prompting techniques categorized by complexity (Base, Advanced, Expert). Each technique includes specific advantages, disadvantages, and ready-to-use legal examples.
Interactive Chat: A custom interface allowing lawyers to interact directly with AI models to practice the learned techniques.
Legal Best Practices: A dedicated section for ethical considerations, technical tips, and "best practices" tailored to the Italian legal framework.
Prompt Generator: Tools designed to help construct structured legal queries based on specific case requirements.
Glossary: A technical-legal dictionary to help users navigate the terminology of Generative AI.
💻 Technical Stack
The project is built with a modern, "premium-feel" architecture:

Core: React 19, Vite, and TypeScript.
Styling: Tailwind CSS with shadcn/ui (based on Radix UI) for a clean, accessible, and responsive interface.
Icons & Visuals: Lucide React for iconography and Recharts for data visualization features.
Data Handling: React Hook Form and Zod for robust validation.
State Management: Custom React hooks for features like favorites, dark mode, and clipboard operations.
📂 Key Directory Overview
src/components/: Contains the main feature sections (Catalog, Comparison, Chat, etc.).
src/data/: Houses the structured legal knowledge (techniques, glossary items).
src/hooks/: Encapsulates reusable logic for the UI.
src/types/: Ensures type safety across the legal and technical data structures.

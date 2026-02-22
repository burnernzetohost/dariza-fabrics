import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const wordCount = editor.getText().trim().split(/\s+/).filter(word => word.length > 0).length;

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-[#012d20]">
            <div className="bg-gray-100 flex gap-1 p-2 border-b border-gray-300 flex-wrap">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 text-sm rounded ${editor.isActive('bold') ? 'bg-[#012d20] text-white' : 'bg-white text-gray-700 hover:bg-gray-200'} font-bold transition`}
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 text-sm rounded ${editor.isActive('italic') ? 'bg-[#012d20] text-white' : 'bg-white text-gray-700 hover:bg-gray-200'} italic transition`}
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1 text-sm rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-[#012d20] text-white' : 'bg-white text-gray-700 hover:bg-gray-200'} font-semibold transition`}
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1 text-sm rounded ${editor.isActive('bulletList') ? 'bg-[#012d20] text-white' : 'bg-white text-gray-700 hover:bg-gray-200'} transition`}
                >
                    • List
                </button>
            </div>

            <div className="p-4 bg-white min-h-[200px] prose max-w-none">
                <EditorContent editor={editor} className="outline-none min-h-[160px]" />
            </div>

            <div className="bg-gray-50 p-2 text-xs text-right border-t border-gray-200 text-gray-500">
                {wordCount} words {wordCount < 150 ? <span className="text-orange-500">(recommend 150-300+ words)</span> : <span className="text-green-600">(good length)</span>}
            </div>

            <style jsx global>{`
                .ProseMirror:focus {
                    outline: none;
                }
                .ProseMirror p {
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                }
                .ProseMirror h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-top: 1em;
                    margin-bottom: 0.5em;
                }
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5em;
                }
            `}</style>
        </div>
    );
}

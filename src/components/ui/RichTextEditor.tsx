import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function RichTextEditor({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (html: string) => void;
  label: string;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-label": label,
        "aria-multiline": "true",
        class: "rich-content",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML())
      editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);
  if (!editor) return null;
  const tools = [
    [
      "Gras",
      () => editor.chain().focus().toggleBold().run(),
      editor.isActive("bold"),
    ],
    [
      "Italique",
      () => editor.chain().focus().toggleItalic().run(),
      editor.isActive("italic"),
    ],
    [
      "Titre",
      () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      editor.isActive("heading", { level: 2 }),
    ],
    [
      "Sous-titre",
      () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      editor.isActive("heading", { level: 3 }),
    ],
    [
      "Liste",
      () => editor.chain().focus().toggleBulletList().run(),
      editor.isActive("bulletList"),
    ],
    [
      "Numérotation",
      () => editor.chain().focus().toggleOrderedList().run(),
      editor.isActive("orderedList"),
    ],
    ["Annuler", () => editor.chain().focus().undo().run(), false],
    ["Rétablir", () => editor.chain().focus().redo().run(), false],
  ] as const;
  return (
    <div className="rich-editor">
      <div
        className="rich-toolbar"
        role="toolbar"
        aria-label={`Mise en forme : ${label}`}
      >
        {tools.map(([name, action, active]) => (
          <button
            key={name}
            type="button"
            aria-pressed={active}
            onClick={action}
          >
            {name}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

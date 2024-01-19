import React from "react";
import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  useEditor,
  EditorContent,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "../../components/ui/button";
const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];
const content = `<p class="text-neutral-500 text-[0.6275rem]"></p>`;
export const TipTapEditor = () => {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class:
          " h-[13vh] overflow-y-auto outline-none bg-white border-[2px] border-neutral-200 rounded-md p-2 sticky bottom-0 text-neutral-500 resize-none max-w-[95%] w-[95%] ",
      },
    },
    onUpdate: ({ editor }) => {
      console.log(JSON.stringify(editor.getHTML()));
    },
  });
  return (
    <div className="w-full flex flex-col  max-w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      {/* <FloatingMenu editor={editor}>I'm Floating</FloatingMenu>
      <BubbleMenu editor={editor}>I'm Floating</BubbleMenu> */}
    </div>
  );
};

import { FiBold, FiItalic, FiUnderline } from "react-icons/fi";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";
import { IoListOutline } from "react-icons/io5";
import { MdOutlineFormatListNumbered } from "react-icons/md";
import { RiDoubleQuotesR } from "react-icons/ri";
import { CiRedo, CiUndo } from "react-icons/ci";

const MenuBar = ({ editor }) => {
  //   const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2 flex-wrap items-center justify-start mt-6 mb-2">
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`
         ${
           editor.isActive("bold") ? "is-active" : ""
         }text black text-[1rem] dark:text-white  w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <FiBold />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${
          editor.isActive("italic") ? "is-active" : ""
        } dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <FiItalic />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`
        ${
          editor.isActive("strike") ? "is-active" : ""
        }  text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <FiUnderline />
      </Button>
      {/* <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`{editor.isActive("paragraph") ? "is-active" : ""}text black text-[1rem] dark:text-white`}
      >
        paragraph
      </Button> */}
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`{editor.isActive("heading", { level: 1 }) ? "is-active" : ""}text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <LuHeading1 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`{editor.isActive("heading", { level: 2 }) ? "is-active" : ""}text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <LuHeading2 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${
          editor.isActive("heading", { level: 3 }) ? "is-active" : ""
        }text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <LuHeading3 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${
          editor.isActive("heading", { level: 4 }) ? "is-active" : ""
        }text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <LuHeading4 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`${
          editor.isActive("heading", { level: 5 }) ? "is-active" : ""
        }text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <LuHeading5 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`${
          editor.isActive("heading", { level: 6 }) ? "is-active" : ""
        }text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <LuHeading6 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${
          editor.isActive("bulletList") ? "is-active" : ""
        }text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <IoListOutline />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${
          editor.isActive("orderedList") ? "is-active" : ""
        }text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <MdOutlineFormatListNumbered />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${
          editor.isActive("blockquote") ? "is-active" : ""
        }text black text-[1rem] dark:text-white w-6 aspect-square grid place-items-center rounded-lg`}
      >
        <RiDoubleQuotesR />
      </Button>
      {/* <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="text-white"
      >
        horizontal rule
      </Button> */}
      {/* <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className="text-white"
      >
        hard break
      </Button> */}
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="text-white w-6 aspect-square grid place-items-center rounded-lg"
      >
        <CiUndo />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="text-white w-6 aspect-square grid place-items-center rounded-lg"
      >
        <CiRedo />
      </Button>
    </div>
  );
};

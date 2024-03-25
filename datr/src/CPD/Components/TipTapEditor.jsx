import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  useEditor,
  EditorContent,
  ReactRenderer,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "../../components/ui/button";
import Mention from "@tiptap/extension-mention";
import { useAxiosClient } from "../../api/useAxiosClient";
import { cn } from "@/lib/utils.ts";
export const TipTapEditor = ({
  users = [],
  updateMentions,
  addMessage,
  disabled = false,
}) => {
  const [canSendMessage, setCanSendMessage] = useState(false);
  const [query, setQuery] = useState("");
  const [mentions, setMentions] = useState([]);
  const { axios } = useAxiosClient();
  const { id } = useParams();
  const client = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationKey: ["message", `${id}`],
    mutationFn: (data) =>
      axios("comments/add", {
        method: "POST",
        data: {
          ticketId: id,
          content: data,
          commentType: "MESSAGE",
          mentions,
          cc: [],
          bcc: [],
        },
      })
        .then((resp) => {
          console.log(id);
          console.log("adding");
          editor.commands.clearContent(false);
          addMessage(resp.data);
          // console.log(resp.data);
          client.invalidateQueries({ queryKey: ["comments", `${id}`] });

          return resp.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        }),
  });

  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    Markdown.configure({
      html: true, // Allow HTML input/output
      tightLists: false, // No <p> inside <li> in markdown output
      tightListClass: "tight", // Add class to <ul> allowing you to remove <p> margins when tight
      bulletListMarker: "-", // <li> prefix in markdown output
      linkify: false, // Create links from "https://..." text
      breaks: true, // New lines (\n) in markdown input are converted to <br>
      transformPastedText: true, // Allow to paste markdown text in the editor
      transformCopiedText: true, // Copied text is transformed to markdown
    }),
    Mention.configure({
      HTMLAttributes: {
        class: "text-blue-300 text-[0.75rem] font-semibold",
      },
      suggestion: {
        items: async ({ query }) => {
          // console.log(usersQuery.data);
          const data = await axios(`users/start-with?value=${query}`).then(
            (resp) => resp.data
          );
          console.log(data);
          const queries = data
            ? data.filter((user) =>
                user.email.toLowerCase().startsWith(query.toLowerCase())
              )
            : [];
          console.log(data, "logs");
          return queries;
        },
        render: () => {
          let component;
          let popup;

          return {
            onStart: (props) => {
              component = new ReactRenderer(MentionList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },

            onUpdate(props) {
              component.updateProps(props);
              const { query } = props;
              setQuery(query);
              if (!props.clientRect) {
                // console.log(props, "updated");
                return;
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup[0].hide();

                return true;
              }

              return component.ref?.onKeyDown(props);
            },

            onExit(props) {
              popup[0].destroy();
              // console.log("destroying", props);
              component.destroy();
            },
          };
        },
      },
    }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
  ];

  const content = `<p class="text-neutral-500 text-[0.6275rem]"></p>`;
  const editor = useEditor({
    extensions,
    content,
    autofocus: true,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[13vh] overflow-y-auto outline-none bg-white border-[2px] border-neutral-200 rounded-md p-2 sticky bottom-0 prose  prose-sm sm:prose-base lg:prose-lg xl:prose-2xl  max-w-[95%] w-[95%] prose [&_ol]:list-decimal [&_ul]:list-disc"
        ),
      },
    },
    onUpdate: ({ editor, transaction }) => {
      let mentionSet = new Set();
      const doc = editor.getJSON().content;
      setCanSendMessage(doc.length > 0);
      doc.forEach((singleContent) => {
        if (singleContent.content[0]?.type === "mention") {
          singleContent.content.forEach((_content) => {
            if (_content.type === "mention") {
              mentionSet.add(_content.attrs.id);
            }
          });
        }
      });

      setMentions(Array.from(mentionSet));
    },
  });

  const sendMessage = () => {
    // const data = editor.storage.markdown.getMarkdown();
    const data = editor.getHTML();
    sendMessageMutation.mutate(data);
  };

  return (
    <div className="w-full flex flex-col  max-w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} disabled={disabled} />

      {/* <EditorProvider
        slotBefore={<MenuBar />}
        slotAfter={<Button>test</Button>}
        extensions={extensions}
        content={content}
        enableCoreExtensions
        editorProps={{}}
      /> */}
      <Button
        disabled={!canSendMessage && !sendMessageMutation.isPending}
        onClick={() => sendMessage()}
        className="w-max px-6 text-white my-2 rounded-xl dark:bg-darkBlue bg-darkBlue hover:bg-lightPink dark:hover:bg-lightPink transition-all"
        variant={"outline"}
      >
        Send
      </Button>
      {/* <FloatingMenu editor={editor}>I'm Floating</FloatingMenu> */}
      {/* <BubbleMenu editor={editor}>I'm Floating</BubbleMenu> */}
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
import axios from "axios";
import { useAuth } from "../../api/useAuth";
import tippy from "tippy.js";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Markdown } from "tiptap-markdown";
import Heading from "@tiptap/extension-heading";

const MenuBar = ({ editor, setMentions }) => {
  // const { editor } = useCurrentEditor();

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
           editor.isActive("bold")
             ? "is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200 "
             : "dark:text-white  "
         } text-[1rem] w-6 aspect-square grid place-items-center rounded-lg transition-all`}
      >
        <FiBold />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${
          editor.isActive("italic")
            ? "is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        } w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
      >
        <FiItalic />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`
        ${
          editor.isActive("strike")
            ? "is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        }  w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
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
        className={`${
          editor.isActive("heading", { level: 1 })
            ? "is-active is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        } w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
      >
        <LuHeading1 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${
          editor.isActive("heading", { level: 2 })
            ? "is-active is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        } w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
      >
        <LuHeading2 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${
          editor.isActive("heading", { level: 3 })
            ? "is-active is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        } w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
      >
        <LuHeading3 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${
          editor.isActive("heading", { level: 4 })
            ? "is-active is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        } w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
      >
        <LuHeading4 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`${
          editor.isActive("heading", { level: 5 })
            ? "is-active is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        } w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
      >
        <LuHeading5 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`${
          editor.isActive("heading", { level: 6 })
            ? "is-active is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        } w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
      >
        <LuHeading6 />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${
          editor.isActive("bulletList")
            ? "is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        }w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
      >
        <IoListOutline />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${
          editor.isActive("orderedList")
            ? "is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : " dark:text-white text-white"
        }w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
      >
        <MdOutlineFormatListNumbered />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${
          editor.isActive("blockquote")
            ? "is-active dark:bg-neutral-200 dark:text-black font-semibold bg-neutral-200 text-black dark:hover:bg-neutral-200 hover:bg-neutral-200"
            : "dark:text-white text-white"
        }w-6 aspect-square grid place-items-center rounded-lg text-[1rem] transition-all`}
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

const MentionList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState();
  const { addMention } = props;
  const selectItem = (index) => {
    const item = props.items[index];
    // props.addMention(item.ncaaUserEmail);
    if (item) {
      props.command({
        id: item.email,
        userId: item.id,
        email: item.email,
      });
    }
  };
  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    console.log("down");
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };
  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);
  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="flex flex-col space-y-2 px-1 p-1 bg-white shadow-md">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`item ${
              index === selectedIndex ? "bg-neutral-100  font-semibold " : ""
            } text-center w-max px-2`}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.email}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
});

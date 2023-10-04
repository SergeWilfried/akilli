'use client';

// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import { Card } from '@/components/shared';
import { TaskWithFiles } from '../../types';
// import { TaskWithFiles } from '../../types';

interface EditorProps {
  task: TaskWithFiles;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Tiptap = (props: EditorProps) => {
  // const { task } = props;
  // const editor = useEditor({
  //   extensions: [StarterKit],
  //   content: `<p>
  //   This is a radically reduced version of tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
  // </p>
  // <p>
  //   The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
  // </p>`,
  // });
  // const tasks: TaskWithFiles = [];
  return (
    <>
      <div className="flex flex-col w-full lg:flex-row">
        <div
          className="flex-grow h-32 card rounded-box place-items-center flex justify-center items-center w-1/2"
          style={{ backgroundColor: 'red' }}
        ></div>
        <div className="divider lg:divider-horizontal"></div>
        <div
          className="flex-grow h-32 card rounded-box place-items-center flex justify-center items-center w-1/2"
          style={{ backgroundColor: 'lightgray' }}
        ></div>
      </div>
    </>
  );
};

export default Tiptap;

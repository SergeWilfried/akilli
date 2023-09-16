'use client';

interface DragAndDropProps {
  handleChange: (e: any) => void;
  removeFile: (fileName: any, idx: any) => void;
  openFileExplorer: () => void;
  dragActive: boolean;
  inputRef: any;
  files: [];
}
export default function DragAndDrop(props: DragAndDropProps) {
  const {
    handleChange,
    removeFile,
    openFileExplorer,
    dragActive,
    inputRef,
    files,
  } = props;

  return (
    <div
      className={`${
        dragActive ? 'bg-blue-400' : 'bg-blue-100'
      }  p-4 w-full rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center`}
    >
      {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
      <input
        placeholder="fileInput"
        className="hidden"
        ref={inputRef}
        type="file"
        multiple={true}
        onChange={handleChange}
        accept=".mp3,.wav,.txt"
      />
      <p>
        Drag & Drop files or{' '}
        <span
          className="font-bold text-blue-600 cursor-pointer"
          onClick={openFileExplorer}
        >
          <u>Select files</u>
        </span>{' '}
        to upload
      </p>

      <div className="flex flex-col items-center p-3">
        {files.map((file: any, idx: any) => (
          <div key={idx} className="flex flex-row space-x-5">
            <span>{file.name}</span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => removeFile(file.name, idx)}
            >
              remove
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

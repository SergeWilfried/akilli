'use client';

import { useState } from 'react';
import SimpleProgressBar from '../shared/SimpleProgressBar';
import { usePresignedUpload } from 'next-s3-upload';
import { useSession } from 'next-auth/react';
import { renameFile } from '../files/ImportFile';
interface DragAndDropProps {
  inputRef: any;
  fields: any;
  // task: Task
}
export default function DragAndDrop(props: DragAndDropProps) {
  const { inputRef, fields } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [urls, setUrls] = useState(['']);
  const { data } = useSession();
  const { uploadToS3, files } = usePresignedUpload();

  const [stateFiles, setFiles] = useState<File[]>([]);
  const dragActive = false; // or false, based on your logic
  async function handleChange(e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files['length']; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
        const file = e.target.files[i];
        const date = new Date().toISOString();
        const newname = `${date}.${file.name.split('.').pop()}`;

        const renamedFile = renameFile(file, newname);
        const { url } = await uploadToS3(renamedFile, {
          endpoint: {
            request: {
              body: fields,
              url: '/api/teams/akilli/upload',
              headers: {
                authorization: data ? data.user.id : '',
              },
            },
          },
        });
        setUrls((current) => [...current, url]);
      }
    }
  }

  function openFileExplorer() {
    inputRef.current.value = '';
    inputRef.current.click();
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...stateFiles];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

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
        name="files"
        ref={inputRef}
        type="file"
        multiple={true}
        onChange={handleChange}
        accept=".mp3,.wav,.txt"
      />
      {files.length === 0 && (
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
      )}

      <div className="flex flex-col items-center p-3">
        {files.map((file, idx: any) => (
          <div key={idx} className="flex flex-row space-x-5">
            <span>{file.file.name}</span>
            <span>
              <SimpleProgressBar progress={file.progress} remaining={0} />
            </span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => removeFile(file.file.name, idx)}
            >
              remove
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}